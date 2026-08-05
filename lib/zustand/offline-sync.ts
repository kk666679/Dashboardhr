/**
 * Offline Sync Manager — Queues mutations when offline, replays when online.
 *
 * Tracks pending mutations in a queue persisted to localStorage.
 * On reconnect, replays mutations in order and invalidates queries.
 */

"use client";

import { v4 as uuidv4 } from "uuid";
import { getEventBus } from "@/lib/ahros/event-bus";
import type { SyncEventType, ArtifactType } from "@/lib/ahros/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface QueuedMutation {
  id: string;
  type: SyncEventType;
  artifactType?: ArtifactType;
  artifactId?: string;
  payload?: unknown;
  source: string;
  queuedAt: number;
  retryCount: number;
  maxRetries: number;
  status: "queued" | "processing" | "completed" | "failed";
  lastError?: string;
}

export interface OfflineSyncOptions {
  storageKey?: string;
  maxRetries?: number;
  autoProcess?: boolean;
  onSyncStart?: () => void;
  onSyncComplete?: (results: { succeeded: number; failed: number }) => void;
  onMutationFailed?: (mutation: QueuedMutation, error: Error) => void;
}

// ─── OfflineSyncManager ──────────────────────────────────────────────────────

export class OfflineSyncManager {
  private queue: QueuedMutation[] = [];
  private options: Required<OfflineSyncOptions>;
  private isProcessing = false;
  private isOnline = true;
  private onlineListeners: Set<() => void> = new Set();
  private offlineListeners: Set<() => void> = new Set();

  constructor(options: OfflineSyncOptions = {}) {
    this.options = {
      storageKey: options.storageKey ?? "ahros-offline-queue",
      maxRetries: options.maxRetries ?? 3,
      autoProcess: options.autoProcess ?? true,
      onSyncStart: options.onSyncStart ?? (() => {}),
      onSyncComplete: options.onSyncComplete ?? (() => {}),
      onMutationFailed: options.onMutationFailed ?? (() => {}),
    };

    this.loadQueue();

    if (typeof window !== "undefined") {
      window.addEventListener("online", this.handleOnline);
      window.addEventListener("offline", this.handleOffline);
      this.isOnline = navigator.onLine;
    }
  }

  enqueue(
    mutation: Omit<QueuedMutation, "id" | "queuedAt" | "retryCount" | "status">,
  ): string {
    const id = uuidv4();
    const queued: QueuedMutation = {
      ...mutation,
      id,
      queuedAt: Date.now(),
      retryCount: 0,
      status: "queued",
    };

    this.queue.push(queued);
    this.persistQueue();

    if (this.isOnline && this.options.autoProcess) {
      this.processQueue();
    }

    return id;
  }

  getQueue(): QueuedMutation[] {
    return [...this.queue];
  }

  get pendingCount(): number {
    return this.queue.filter(
      (m) => m.status === "queued" || m.status === "processing",
    ).length;
  }

  get failedCount(): number {
    return this.queue.filter((m) => m.status === "failed").length;
  }

  async processQueue(): Promise<{ succeeded: number; failed: number }> {
    if (this.isProcessing || !this.isOnline) {
      return { succeeded: 0, failed: 0 };
    }

    this.isProcessing = true;
    this.options.onSyncStart();

    let succeeded = 0;
    let failed = 0;

    const pending = this.queue.filter(
      (m) => m.status === "queued" || m.status === "failed",
    );

    for (const mutation of pending) {
      if (!this.isOnline) break;

      mutation.status = "processing";
      this.persistQueue();

      try {
        const bus = getEventBus("offline-sync");
        await bus.publish({
          type: mutation.type,
          artifactId: mutation.artifactId,
          artifactType: mutation.artifactType,
          payload: mutation.payload,
          source: mutation.source,
        });

        mutation.status = "completed";
        succeeded++;
      } catch (error) {
        mutation.retryCount++;
        const err = error instanceof Error ? error : new Error(String(error));

        if (mutation.retryCount >= this.options.maxRetries) {
          mutation.status = "failed";
          mutation.lastError = err.message;
          failed++;
          this.options.onMutationFailed(mutation, err);
        } else {
          mutation.status = "queued";
        }
      }

      this.persistQueue();
    }

    this.queue = this.queue.filter((m) => m.status !== "completed");
    this.persistQueue();

    this.isProcessing = false;
    this.options.onSyncComplete({ succeeded, failed });

    return { succeeded, failed };
  }

  retryMutation(mutationId: string): boolean {
    const mutation = this.queue.find((m) => m.id === mutationId);
    if (!mutation || mutation.status !== "failed") return false;

    mutation.status = "queued";
    mutation.retryCount = 0;
    mutation.lastError = undefined;
    this.persistQueue();

    if (this.isOnline) {
      this.processQueue();
    }

    return true;
  }

  retryAllFailed(): number {
    const failed = this.queue.filter((m) => m.status === "failed");
    failed.forEach((m) => {
      m.status = "queued";
      m.retryCount = 0;
      m.lastError = undefined;
    });
    this.persistQueue();

    if (this.isOnline) {
      this.processQueue();
    }

    return failed.length;
  }

  removeMutation(mutationId: string): boolean {
    const index = this.queue.findIndex((m) => m.id === mutationId);
    if (index === -1) return false;
    this.queue.splice(index, 1);
    this.persistQueue();
    return true;
  }

  clearQueue(): void {
    this.queue = [];
    this.persistQueue();
  }

  onOnline(listener: () => void): () => void {
    this.onlineListeners.add(listener);
    return () => this.onlineListeners.delete(listener);
  }

  onOffline(listener: () => void): () => void {
    this.offlineListeners.add(listener);
    return () => this.offlineListeners.delete(listener);
  }

  get online(): boolean {
    return this.isOnline;
  }

  destroy(): void {
    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.handleOnline);
      window.removeEventListener("offline", this.handleOffline);
    }
    this.onlineListeners.clear();
    this.offlineListeners.clear();
  }

  private handleOnline = () => {
    this.isOnline = true;
    this.onlineListeners.forEach((l) => l());

    if (this.options.autoProcess) {
      this.processQueue();
    }
  };

  private handleOffline = () => {
    this.isOnline = false;
    this.offlineListeners.forEach((l) => l());
  };

  private persistQueue(): void {
    try {
      localStorage.setItem(
        this.options.storageKey,
        JSON.stringify(this.queue),
      );
    } catch {
      console.warn("[OfflineSync] Failed to persist queue");
    }
  }

  private loadQueue(): void {
    try {
      const raw = localStorage.getItem(this.options.storageKey);
      if (raw) {
        this.queue = JSON.parse(raw);
      }
    } catch {
      this.queue = [];
    }
  }
}

// ─── Singleton ───────────────────────────────────────────────────────────────

let globalOfflineSync: OfflineSyncManager | null = null;

export function getOfflineSyncManager(
  options?: OfflineSyncOptions,
): OfflineSyncManager {
  if (!globalOfflineSync) {
    globalOfflineSync = new OfflineSyncManager(options);
  }
  return globalOfflineSync;
}

export function resetOfflineSyncManager(): void {
  globalOfflineSync?.destroy();
  globalOfflineSync = null;
}