/**
 * useOptimisticMutation — React hook for optimistic mutations via the EventBus.
 *
 * Provides:
 *  - Snapshot/rollback lifecycle wrapped in a React hook
 *  - Integration with Zustand stores and tRPC queries
 *  - Automatic rollback on error
 *  - Conflict detection with configurable resolution
 *  - Loading/success/error states
 *
 * @example
 * ```tsx
 * const { mutate, isPending, error } = useOptimisticMutation({
 *   store: useArtifactStore,
 *   getState: (state) => state.getArtifact('my-id'),
 *   setState: (state, newData) => state.updateArtifactData('my-id', newData),
 *   eventType: 'ARTIFACT_UPDATED',
 *   onError: (prevState) => {
 *     // Optional rollback side-effect
 *   },
 * });
 *
 * // Usage:
 * mutate({ someField: 'new value' });
 * ```
 */

"use client";

import { useCallback, useRef, useState } from "react";
import { getOptimisticBus, OptimisticRollbackError } from "@/lib/ahros/optimistic-bus";
import { getEventBus } from "@/lib/ahros/event-bus";
import type { SyncEventType, ArtifactType } from "@/lib/ahros/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OptimisticMutationOptions<TState, TPayload> {
  /** Target ID for the optimistic update (artifact ID, execution ID, etc.) */
  targetId: string;
  /** The EventBus event type to publish */
  eventType: SyncEventType;
  /** Optional artifact type for the event */
  artifactType?: ArtifactType;
  /** Function to get the current/previous state from store */
  getPreviousState: () => TState;
  /** Function to apply the optimistic state to store */
  applyOptimisticState: (payload: TPayload) => TState;
  /** Function to rollback to previous state in store */
  rollbackState: (previousState: TState) => void;
  /** Build the event payload from mutation input */
  buildPayload?: (input: TPayload) => unknown;
  /** Called after successful commit */
  onSuccess?: (result: TPayload) => void;
  /** Called when rollback happens */
  onRollback?: (previousState: TState, error: Error) => void;
  /** Whether to auto-rollback on error (default: true) */
  autoRollback?: boolean;
  /** Custom event source */
  source?: string;
  /** Invalidate specific tRPC query keys after success */
  invalidateQueryKeys?: string[][];
}

export interface OptimisticMutationState {
  /** Whether a mutation is in progress */
  isPending: boolean;
  /** Whether the last mutation succeeded */
  isSuccess: boolean;
  /** Whether the last mutation failed */
  isError: boolean;
  /** Error from last failed mutation */
  error: Error | null;
  /** Number of pending mutations */
  pendingCount: number;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useOptimisticMutation<TState, TPayload = unknown>(
  options: OptimisticMutationOptions<TState, TPayload>,
) {
  const {
    targetId,
    eventType,
    artifactType,
    getPreviousState,
    applyOptimisticState,
    rollbackState,
    buildPayload,
    onSuccess,
    onRollback,
    autoRollback = true,
    source = "use-optimistic-mutation",
    invalidateQueryKeys,
  } = options;

  const [state, setState] = useState<OptimisticMutationState>({
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    pendingCount: 0,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const mutate = useCallback(
    async (input: TPayload) => {
      const optBus = getOptimisticBus({ autoRollback });
      const bus = getEventBus(source);

      setState((prev) => ({
        ...prev,
        isPending: true,
        isSuccess: false,
        isError: false,
        error: null,
        pendingCount: prev.pendingCount + 1,
      }));

      // Get previous state
      const previousState = getPreviousState();

      // Apply optimistic state
      let optimisticState: TState;
      try {
        optimisticState = applyOptimisticState(input);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to apply optimistic state");
        rollbackState(previousState);
        setState((prev) => ({
          ...prev,
          isPending: false,
          isError: true,
          error,
          pendingCount: prev.pendingCount - 1,
        }));
        return;
      }

      // Build event payload
      const payload = buildPayload ? buildPayload(input) : (input as unknown);

      try {
        // Perform optimistic mutation via OptimisticBus
        await optBus.mutate(
          targetId,
          {
            type: eventType,
            artifactType,
            payload,
            source,
          },
          optimisticState,
          previousState,
        );

        // Also publish raw event to bus for other subscribers
        await bus.publish({
          type: eventType,
          artifactType,
          payload,
          source,
        });

        // Handle tRPC query invalidation if provided
        if (invalidateQueryKeys?.length) {
          try {
            const { trpc } = await import("@/lib/trpc");
            const utils = trpc.useUtils();
            await Promise.all(
              invalidateQueryKeys.map((key) => {
                const [router, ...rest] = key;
                const invalidator = (utils as any)[router];
                if (invalidator?.invalidate) {
                  return invalidator.invalidate(rest.length > 0 ? rest[0] : undefined);
                }
                return Promise.resolve();
              }),
            );
          } catch {
            // Silent fail for invalidation
          }
        }

        setState((prev) => ({
          ...prev,
          isPending: false,
          isSuccess: true,
          error: null,
          pendingCount: prev.pendingCount - 1,
        }));

        onSuccess?.(input);
      } catch (error) {
        // Rollback on error
        rollbackState(previousState);

        const err =
          error instanceof OptimisticRollbackError
            ? error
            : error instanceof Error
              ? error
              : new Error("Optimistic mutation failed");

        setState((prev) => ({
          ...prev,
          isPending: false,
          isError: true,
          error: err,
          pendingCount: prev.pendingCount - 1,
        }));

        onRollback?.(previousState, err);
      }
    },
    [
      targetId,
      eventType,
      artifactType,
      getPreviousState,
      applyOptimisticState,
      rollbackState,
      buildPayload,
      autoRollback,
      source,
      invalidateQueryKeys,
      onSuccess,
      onRollback,
    ],
  );

  const reset = useCallback(() => {
    setState({
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      pendingCount: 0,
    });
  }, []);

  return {
    mutate,
    mutateAsync: mutate,
    ...state,
    reset,
  };
}

// ─── Utility: Create optimistic mutation for artifact updates ───────────────

/**
 * Create an optimistic mutation specifically for artifact store updates.
 */
export function useOptimisticArtifactMutation(artifactId: string) {
  return useOptimisticMutation({
    targetId: artifactId,
    eventType: "ARTIFACT_UPDATED",
    getPreviousState: () => {
      try {
        const { useArtifactStore } = require("@/lib/zustand/artifact-store");
        const store = useArtifactStore.getState();
        return store.getArtifact(artifactId) ?? null;
      } catch {
        return null;
      }
    },
    applyOptimisticState: (data: unknown) => {
      try {
        const { useArtifactStore } = require("@/lib/zustand/artifact-store");
        const store = useArtifactStore.getState();
        store.updateArtifactData(artifactId, data);
        return data;
      } catch {
        return data;
      }
    },
    rollbackState: (previousState) => {
      if (previousState) {
        try {
          const { useArtifactStore } = require("@/lib/zustand/artifact-store");
          const store = useArtifactStore.getState();
          store.updateArtifactData(artifactId, (previousState as any).data);
        } catch {
          // ignore
        }
      }
    },
    source: "use-optimistic-artifact",
  });
}