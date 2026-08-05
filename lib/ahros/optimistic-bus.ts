/**
 * Optimistic EventBus — Wraps the AHROS EventBus with optimistic update support.
 *
 * Provides:
 *  - Snapshot/rollback for optimistic mutations
 *  - Conflict detection and resolution
 *  - Automatic rollback on error
 *  - Queue for pending optimistic updates
 *
 * Usage:
 * ```ts
 * const optBus = getOptimisticBus();
 * const snapshot = optBus.snapshot('artifact-123');
 * // Apply optimistic update to store...
 * await optBus.commit('artifact-123', { type: 'ARTIFACT_UPDATED', ... });
 * // On error: optBus.rollback('artifact-123', snapshot);
 * ```
 */

import { getEventBus, type EventBus } from "./event-bus";
import type { SyncEvent, SyncEventType, ArtifactType } from "./types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OptimisticSnapshot {
  id: string;
  timestamp: number;
  state: unknown;
}

export interface OptimisticUpdate<T = unknown> {
  id: string;
  targetId: string;
  event: Omit<SyncEvent, "id" | "timestamp">;
  optimisticState: T;
  previousState: T;
  status: "pending" | "committed" | "rolled_back" | "conflict";
  createdAt: number;
  resolvedAt?: number;
}

export interface ConflictResolution {
  type: "keep_remote" | "keep_local" | "merge" | "manual";
  resolved?: boolean;
  mergedState?: unknown;
}

export interface OptimisticBusOptions {
  /** Max number of pending optimistic updates to track */
  maxPending?: number;
  /** Whether to auto-rollback on publish error */
  autoRollback?: boolean;
  /** Default conflict resolution strategy */
  defaultConflictResolution?: ConflictResolution["type"];
}

// ─── OptimisticBus Class ─────────────────────────────────────────────────────

export class OptimisticBus {
  private bus: EventBus;
  private snapshots: Map<string, OptimisticSnapshot> = new Map();
  private pendingUpdates: Map<string, OptimisticUpdate> = new Map();
  private options: Required<OptimisticBusOptions>;

  constructor(bus: EventBus, options: OptimisticBusOptions = {}) {
    this.bus = bus;
    this.options = {
      maxPending: options.maxPending ?? 100,
      autoRollback: options.autoRollback ?? true,
      defaultConflictResolution: options.defaultConflictResolution ?? "keep_local",
    };
  }

  /**
   * Snapshot the current state of a target (artifact, execution, etc.) for potential rollback.
   */
  snapshot<T>(targetId: string, state: T): OptimisticSnapshot {
    const snap: OptimisticSnapshot = {
      id: `snap-${targetId}-${Date.now()}`,
      timestamp: Date.now(),
      state: JSON.parse(JSON.stringify(state)), // deep clone
    };
    this.snapshots.set(targetId, snap);
    return snap;
  }

  /**
   * Get a previous snapshot for a target.
   */
  getSnapshot(targetId: string): OptimisticSnapshot | undefined {
    return this.snapshots.get(targetId);
  }

  /**
   * Perform an optimistic mutation: snapshot, apply, and publish.
   * If publish fails and autoRollback is true, automatically rolls back.
   *
   * Returns the optimistic update record.
   */
  async mutate<T>(
    targetId: string,
    event: Omit<SyncEvent, "id" | "timestamp">,
    optimisticState: T,
    previousState: T,
  ): Promise<OptimisticUpdate<T>> {
    // Enforce max pending limit
    if (this.pendingUpdates.size >= this.options.maxPending) {
      this.pruneOldest();
    }

    // Check for existing pending update on same target (conflict)
    const existing = Array.from(this.pendingUpdates.values()).find(
      (u) => u.targetId === targetId && u.status === "pending",
    );

    if (existing) {
      // Handle conflict according to strategy
      const resolution = this.resolveConflict(existing, { targetId, event, optimisticState, previousState });
      if (resolution.type === "keep_remote") {
        // Keep existing, reject new
        const update: OptimisticUpdate<T> = {
          id: `opt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          targetId,
          event,
          optimisticState,
          previousState,
          status: "conflict",
          createdAt: Date.now(),
          resolvedAt: Date.now(),
        };
        this.pendingUpdates.set(update.id, update as unknown as OptimisticUpdate);
        return update;
      }
      // Otherwise, roll back existing and proceed
      if (existing.status === "pending") {
        existing.status = "rolled_back";
        existing.resolvedAt = Date.now();
      }
    }

    // Snapshot and create optimistic update
    this.snapshot(targetId, previousState);
    const updateId = `opt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const update: OptimisticUpdate<T> = {
      id: updateId,
      targetId,
      event,
      optimisticState,
      previousState,
      status: "pending",
      createdAt: Date.now(),
    };

    this.pendingUpdates.set(updateId, update as unknown as OptimisticUpdate);

    // Apply optimistic state (caller must update their store)
    // Store the update for potential rollback

    // Publish to event bus
    try {
      await this.bus.publish(event);
      update.status = "committed";
      update.resolvedAt = Date.now();
    } catch (error) {
      update.status = "rolled_back";
      update.resolvedAt = Date.now();
      console.error(`[OptimisticBus] Publish failed for ${targetId}, rolling back:`, error);

      if (this.options.autoRollback) {
        // Notify caller via return status — caller should restore snapshot
        throw new OptimisticRollbackError(
          `Optimistic update failed for ${targetId}`,
          targetId,
          previousState,
        );
      }
    }

    return update;
  }

  /**
   * Commit a pending optimistic update as confirmed.
   */
  commit(updateId: string): boolean {
    const update = this.pendingUpdates.get(updateId);
    if (!update || update.status !== "pending") return false;

    update.status = "committed";
    update.resolvedAt = Date.now();
    this.snapshots.delete(update.targetId);
    return true;
  }

  /**
   * Rollback a specific optimistic update.
   */
  rollback(updateId: string): boolean {
    const update = this.pendingUpdates.get(updateId);
    if (!update) return false;

    update.status = "rolled_back";
    update.resolvedAt = Date.now();
    return true;
  }

  /**
   * Rollback to a snapshot for a given target.
   */
  rollbackToSnapshot(targetId: string): OptimisticSnapshot | undefined {
    const snap = this.snapshots.get(targetId);
    if (snap) {
      this.snapshots.delete(targetId);
    }
    return snap;
  }

  /**
   * Get all pending (unresolved) optimistic updates.
   */
  getPendingUpdates(): OptimisticUpdate[] {
    return Array.from(this.pendingUpdates.values()).filter(
      (u) => u.status === "pending",
    );
  }

  /**
   * Get all optimistic updates for a specific target.
   */
  getUpdatesForTarget(targetId: string): OptimisticUpdate[] {
    return Array.from(this.pendingUpdates.values()).filter(
      (u) => u.targetId === targetId,
    );
  }

  /**
   * Check if a target has pending optimistic updates.
   */
  hasPendingUpdates(targetId: string): boolean {
    return this.getUpdatesForTarget(targetId).some(
      (u) => u.status === "pending",
    );
  }

  /**
   * Clear all snapshots and resolved updates.
   */
  cleanResolved(maxAge?: number): void {
    const now = Date.now();
    const age = maxAge ?? 60_000; // default 1 minute

    for (const [id, update] of this.pendingUpdates) {
      if (update.status !== "pending" && update.resolvedAt) {
        if (now - update.resolvedAt > age) {
          this.pendingUpdates.delete(id);
        }
      }
    }

    for (const [id, snap] of this.snapshots) {
      if (now - snap.timestamp > age) {
        this.snapshots.delete(id);
      }
    }
  }

  /**
   * Clear everything.
   */
  clear(): void {
    this.snapshots.clear();
    this.pendingUpdates.clear();
  }

  /**
   * Get the count of pending updates.
   */
  get pendingCount(): number {
    return this.getPendingUpdates().length;
  }

  // ── Private ──────────────────────────────────────────────────────────────

  private resolveConflict(
    existing: OptimisticUpdate,
    incoming: {
      targetId: string;
      event: Omit<SyncEvent, "id" | "timestamp">;
      optimisticState: unknown;
      previousState: unknown;
    },
  ): ConflictResolution {
    // If same event type for same target, keep the most recent
    if (existing.event.type === incoming.event.type) {
      return { type: "keep_remote", resolved: true };
    }
    return { type: this.options.defaultConflictResolution, resolved: false };
  }

  private pruneOldest(): void {
    const pending = this.getPendingUpdates();
    if (pending.length === 0) return;

    const oldest = pending.reduce((a, b) =>
      a.createdAt < b.createdAt ? a : b,
    );
    this.pendingUpdates.delete(oldest.id);
  }
}

// ─── Error Class ─────────────────────────────────────────────────────────────

export class OptimisticRollbackError extends Error {
  public targetId: string;
  public rollbackState: unknown;

  constructor(message: string, targetId: string, rollbackState: unknown) {
    super(message);
    this.name = "OptimisticRollbackError";
    this.targetId = targetId;
    this.rollbackState = rollbackState;
  }
}

// ─── Singleton ───────────────────────────────────────────────────────────────

let globalOptimisticBus: OptimisticBus | null = null;

/**
 * Get or create the global OptimisticBus instance.
 */
export function getOptimisticBus(
  options?: OptimisticBusOptions,
): OptimisticBus {
  if (!globalOptimisticBus) {
    const bus = getEventBus("optimistic-bus");
    globalOptimisticBus = new OptimisticBus(bus, options);
  }
  return globalOptimisticBus;
}

/**
 * Reset the global optimistic bus (useful for testing).
 */
export function resetOptimisticBus(): void {
  globalOptimisticBus?.clear();
  globalOptimisticBus = null;
}