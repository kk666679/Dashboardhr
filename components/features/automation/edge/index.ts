// ─── Existing exports ──────────────────────────────────────────────────────
export { BaseEdge } from "./BaseEdge";
export { EdgeLabel } from "./EdgeLabel";
export { edgeMarkers, getMarker } from "./EdgeMarkers";
export { createEdge, createEdges, getEdgeColor, getEdgeStyle } from "./EdgeUtils";
export type { EdgeData, EdgeType } from "./EdgeUtils";

// ─── New exports from automationEdge.tsx ─────────────────────────────────
export {
  AnimatedFlowEdge,
  StepEdge,
  StatusEdge,
  ConditionalEdge,
  DashedEdge,
} from "./automationEdge";

import { AnimatedFlowEdge, StepEdge, StatusEdge, ConditionalEdge, DashedEdge } from "./automationEdge";

// ─── Edge types mapping for React Flow ────────────────────────────────────
export const edgeTypes = {
  animatedFlow: AnimatedFlowEdge,
  step: StepEdge,
  status: StatusEdge,
  conditional: ConditionalEdge,
  dashed: DashedEdge,
};