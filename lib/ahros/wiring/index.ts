/**
 * AHROS Wiring Layer — React bindings for the AHROS core.
 *
 * These hooks bridge the gap between the typed core layer (EventBus, ArtifactRegistry,
 * ExecutionEngine, etc.) and React components using Zustand + useSyncExternalStore.
 *
 * @module ahros-wiring
 */

export { useEventBus, useEventSubscription, useEventCount, type EventBusSubscription } from "./use-event-bus";
export { useArtifact, useArtifactsByType, useArtifactSearch, useAllArtifacts } from "./use-artifact";
export { useAhros } from "./use-ahros";
export type { UseAhrosReturn } from "./use-ahros";
export { useBusinessEventPipeline } from "./use-business-event-pipeline";
export type { PipelineStage, PipelineState } from "./use-business-event-pipeline";

