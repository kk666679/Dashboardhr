/**
 * AHROS Event Bus — Typed event-driven orchestration layer.
 *
 * Manages artifact synchronization across the workspace.
 * Every artifact subscribes to updates and reacts accordingly.
 */

import { v4 as uuidv4 } from "uuid";
import type { SyncEvent, SyncEventType, ArtifactType } from "./types";

type EventHandler = (event: SyncEvent) => void | Promise<void>;

interface Subscription {
  id: string;
  eventType: SyncEventType | "*";
  artifactType?: ArtifactType;
  handler: EventHandler;
  once: boolean;
}

/**
 * Central event bus for AHROS artifact synchronization.
 * Implements a typed publish/subscribe pattern.
 */
export class EventBus {
  private subscriptions: Map<string, Subscription> = new Map();
  private handlersByType: Map<SyncEventType | "*", Set<string>> = new Map();
  private handlersByArtifact: Map<ArtifactType, Set<string>> = new Map();
  private history: SyncEvent[] = [];
  private maxHistory = 1000;
  private source: string;

  constructor(source = "ahros-core") {
    this.source = source;
  }

  /**
   * Subscribe to events of a specific type (or all events with "*").
   */
  subscribe(
    eventType: SyncEventType | "*",
    handler: EventHandler,
    options?: { artifactType?: ArtifactType; once?: boolean }
  ): string {
    const id = uuidv4();
    const subscription: Subscription = {
      id,
      eventType,
      handler,
      once: options?.once ?? false,
      artifactType: options?.artifactType,
    };

    this.subscriptions.set(id, subscription);

    // Index by event type
    const typeSet = this.handlersByType.get(eventType) ?? new Set();
    typeSet.add(id);
    this.handlersByType.set(eventType, typeSet);

    // Index by artifact type (if specified)
    if (options?.artifactType) {
      const artifactSet =
        this.handlersByArtifact.get(options.artifactType) ?? new Set();
      artifactSet.add(id);
      this.handlersByArtifact.set(options.artifactType, artifactSet);
    }

    return id;
  }

  /**
   * Subscribe to a single event (auto-unsubscribes after first fire).
   */
  once(
    eventType: SyncEventType,
    handler: EventHandler,
    options?: { artifactType?: ArtifactType }
  ): string {
    return this.subscribe(eventType, handler, { ...options, once: true });
  }

  /**
   * Unsubscribe by subscription ID.
   */
  unsubscribe(id: string): boolean {
    const sub = this.subscriptions.get(id);
    if (!sub) return false;

    // Remove from event type index
    const typeSet = this.handlersByType.get(sub.eventType);
    if (typeSet) {
      typeSet.delete(id);
      if (typeSet.size === 0) this.handlersByType.delete(sub.eventType);
    }

    // Remove from artifact type index
    if (sub.artifactType) {
      const artifactSet = this.handlersByArtifact.get(sub.artifactType);
      if (artifactSet) {
        artifactSet.delete(id);
        if (artifactSet.size === 0)
          this.handlersByArtifact.delete(sub.artifactType);
      }
    }

    return this.subscriptions.delete(id);
  }

  /**
   * Publish an event to all matching subscribers.
   */
  async publish(event: Omit<SyncEvent, "id" | "timestamp">): Promise<void> {
    const fullEvent: SyncEvent = {
      ...event,
      id: uuidv4(),
      timestamp: new Date(),
    };

    // Add to history
    this.history.push(fullEvent);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    // Collect all matching handler IDs
    const matchedIds = new Set<string>();

    // Match by exact event type
    const exactHandlers = this.handlersByType.get(event.type);
    if (exactHandlers) {
      exactHandlers.forEach((id) => matchedIds.add(id));
    }

    // Match by wildcard
    const wildcardHandlers = this.handlersByType.get("*");
    if (wildcardHandlers) {
      wildcardHandlers.forEach((id) => matchedIds.add(id));
    }

    // Filter by artifact type if event has one
    const filteredIds = Array.from(matchedIds).filter((id) => {
      const sub = this.subscriptions.get(id);
      if (!sub) return false;
      if (
        sub.artifactType &&
        event.artifactType &&
        sub.artifactType !== event.artifactType
      ) {
        return false;
      }
      return true;
    });

    // Execute handlers
    const onceIds: string[] = [];
    const promises: Promise<void>[] = [];

    for (const id of filteredIds) {
      const sub = this.subscriptions.get(id);
      if (!sub) continue;

      try {
        const result = sub.handler(fullEvent);
        if (result instanceof Promise) {
          promises.push(result);
        }
      } catch (error) {
        console.error(
          `[EventBus] Error in handler ${id} for ${event.type}:`,
          error
        );
      }

      if (sub.once) {
        onceIds.push(id);
      }
    }

    // Wait for all async handlers
    if (promises.length > 0) {
      await Promise.allSettled(promises);
    }

    // Clean up once subscriptions
    onceIds.forEach((id) => this.unsubscribe(id));
  }

  /**
   * Get event history for audit/debugging.
   */
  getHistory(filter?: {
    eventType?: SyncEventType;
    artifactType?: ArtifactType;
    limit?: number;
  }): SyncEvent[] {
    let filtered = this.history;

    if (filter?.eventType) {
      filtered = filtered.filter((e) => e.type === filter.eventType);
    }
    if (filter?.artifactType) {
      filtered = filtered.filter(
        (e) => e.artifactType === filter.artifactType
      );
    }

    const limit = filter?.limit ?? 50;
    return filtered.slice(-limit);
  }

  /**
   * Clear event history.
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Get current subscription count.
   */
  get subscriberCount(): number {
    return this.subscriptions.size;
  }
}

// Singleton instance for the application
let globalEventBus: EventBus | null = null;

/**
 * Get or create the global AHROS Event Bus instance.
 */
export function getEventBus(source = "ahros-core"): EventBus {
  if (!globalEventBus) {
    globalEventBus = new EventBus(source);
  }
  return globalEventBus;
}

/**
 * Reset the global event bus (useful for testing).
 */
export function resetEventBus(): void {
  globalEventBus = null;
}
