/**
 * useEventBus — React hook for subscribing to AHROS EventBus events.
 *
 * Uses useSyncExternalStore for tear-free, concurrent-safe subscriptions.
 * Automatically subscribes/unsubscribes on mount/unmount.
 * Filters by event type and optional artifact type.
 */

import { useSyncExternalStore, useCallback, useRef } from "react";
import { getEventBus, type EventBus } from "@/lib/ahros/event-bus";
import type { SyncEvent, SyncEventType, ArtifactType } from "@/lib/ahros/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface EventBusSubscription {
  /** Unsubscribe from the event bus */
  unsubscribe: () => void;
}

export interface UseEventBusOptions {
  /** Subscribe to all events if "*" */
  eventType?: SyncEventType | "*";
  /** Filter by artifact type */
  artifactType?: ArtifactType;
  /** Maximum events in history */
  maxEvents?: number;
}

// ─── Singleton snapshot holders ──────────────────────────────────────────────

const listeners = new Set<() => void>();
let snapshot: SyncEvent[] = [];

function notifyListeners(): void {
  snapshot = [...snapshot]; // create new reference
  listeners.forEach((l) => l());
}

let globalBus: EventBus | null = null;
let globalSubscriptionId: string | null = null;

function ensureGlobalSubscription(): void {
  if (globalBus && globalSubscriptionId) return;
  globalBus = getEventBus("ahros-react");

  globalSubscriptionId = globalBus.subscribe("*", (event) => {
    snapshot = [...snapshot.slice(-999), event];
    notifyListeners();
  });
}

function getSnapshot(): SyncEvent[] {
  return snapshot;
}

function subscribeToEvents(callback: () => void): () => void {
  ensureGlobalSubscription();
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useEventBus(options?: UseEventBusOptions): {
  events: SyncEvent[];
  lastEvent: SyncEvent | null;
  publish: (event: Omit<SyncEvent, "id" | "timestamp">) => Promise<void>;
} {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const allEvents = useSyncExternalStore(subscribeToEvents, getSnapshot, getSnapshot);

  const filteredEvents = allEvents.filter((event) => {
    const opts = optionsRef.current;
    if (!opts) return true;
    if (opts.eventType && opts.eventType !== "*" && event.type !== opts.eventType) return false;
    if (opts.artifactType && event.artifactType !== opts.artifactType) return false;
    return true;
  });

  const maxEvents = options?.maxEvents ?? 100;
  const events = filteredEvents.slice(-maxEvents);

  const lastEvent = events.length > 0 ? events[events.length - 1] : null;

  const publish = useCallback(
    async (event: Omit<SyncEvent, "id" | "timestamp">) => {
      const bus = getEventBus("ahros-react");
      await bus.publish(event);
    },
    [],
  );

  return { events, lastEvent, publish };
}

// ─── Utility hooks ───────────────────────────────────────────────────────────

/**
 * Subscribe to a specific event type and call handler when it fires.
 */
export function useEventSubscription(
  eventType: SyncEventType | "*",
  handler: (event: SyncEvent) => void,
  deps: unknown[] = [],
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useSyncExternalStore(
    (callback) => {
      const bus = getEventBus("ahros-react");
      const id = bus.subscribe(eventType, (event) => {
        handlerRef.current(event);
      });

      // Also re-trigger when deps change
      return () => {
        bus.unsubscribe(id);
      };
    },
    () => null,
    () => null,
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
}

/**
 * Get the count of events of a specific type.
 */
export function useEventCount(eventType?: SyncEventType): number {
  const { events } = useEventBus({
    eventType: eventType ?? "*",
    maxEvents: 1000,
  });
  return events.length;
}

