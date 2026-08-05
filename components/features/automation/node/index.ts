// ─── Node types map for React Flow ─────────────────────────────────────

import { StartNode } from "./StartNode";
import { EndNode } from "./EndNode";
import { DecisionNode } from "./DecisionNode";
import { ActionNode } from "./ActionNode";
import { TriggerNode } from "./TriggerNode";
import { OutputNode } from "./OutputNode";
import { WorkflowNode } from "./WorkflowNode";
import { SubflowNode } from "./SubflowNode";
import { LoopNode } from "./LoopNode";
import { EmailNode } from "./EmailNode";
import { NotificationNode } from "./NotificationNode";
import { MessageNode } from "./MessageNode";
import { ApiNode } from "./ApiNode";
import { DatabaseNode } from "./DatabaseNode";
import { CloudNode } from "./CloudNode";
import { CustomNode } from "./CustomNode";
import { ScriptNode } from "./ScriptNode";
import { ConditionNode } from "./ConditionNode";
import { GenericNode } from "./GenericNode";
import { WaitNode } from "./WaitNode";
import { GroupNode } from "./GroupNode";
import { SubWorkflowNode } from "./SubWorkflowNode";
import {
  EnhancedEmployeeNode,
  DepartmentGroupNode,
  CompactCardNode,
  CircularNode,
  DiamondNode,
  HexagonNode,
  StadiumNode,
  AnnotationNode,
  MetricCardNode,
} from "./CustomNodes";

// ─── SOP Node Integration ──────────────────────────────────────────────────
import { SOPNodeTypes } from "../sop-workflow/nodes";

// ─── Node exports (public API) ───────────────────────────────────────────
export { NodeBase } from "./NodeBase";
export { WaitNode } from "./WaitNode";
export { GroupNode } from "./GroupNode";
export { SubWorkflowNode } from "./SubWorkflowNode";
export type { NodeBaseProps } from "./NodeBase";
export { StartNode } from "./StartNode";
export { EndNode } from "./EndNode";
export { DecisionNode } from "./DecisionNode";
export { ActionNode } from "./ActionNode";
export { TriggerNode } from "./TriggerNode";
export { OutputNode } from "./OutputNode";
export { WorkflowNode } from "./WorkflowNode";
export { SubflowNode } from "./SubflowNode";
export { LoopNode } from "./LoopNode";
export { EmailNode } from "./EmailNode";
export { NotificationNode } from "./NotificationNode";
export { MessageNode } from "./MessageNode";
export { ApiNode } from "./ApiNode";
export { DatabaseNode } from "./DatabaseNode";
export { CloudNode } from "./CloudNode";
export { CustomNode } from "./CustomNode";
export { ScriptNode } from "./ScriptNode";
export { ConditionNode } from "./ConditionNode";
export { GenericNode } from "./GenericNode";

export type {
  EnhancedEmployeeNodeData,
  DepartmentGroupNodeData,
  CompactCardNodeData,
  CircularNodeData,
  DiamondNodeData,
  HexagonNodeData,
  StadiumNodeData,
  AnnotationNodeData,
  MetricCardNodeData,
} from "./CustomNodes";

// ─── Types ─────────────────────────────────────────────────────────────────
export * from "./types";

// ─── Node types mapping for React Flow ─────────────────────────────────────
export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  decision: DecisionNode,
  action: ActionNode,
  trigger: TriggerNode,
  output: OutputNode,
  workflow: WorkflowNode,
  subflow: SubflowNode,
  loop: LoopNode,
  email: EmailNode,
  notification: NotificationNode,
  message: MessageNode,
  api: ApiNode,
  database: DatabaseNode,
  cloud: CloudNode,
  custom: CustomNode,
  script: ScriptNode,
  condition: ConditionNode,
  default: GenericNode,
  wait: WaitNode,
  group: GroupNode,
  subworkflow: SubWorkflowNode,
  // Custom visual nodes
  enhancedEmployee: EnhancedEmployeeNode,
  departmentGroup: DepartmentGroupNode,
  compactCard: CompactCardNode,
  circular: CircularNode,
  diamond: DiamondNode,
  hexagon: HexagonNode,
  stadium: StadiumNode,
  annotation: AnnotationNode,
  metricCard: MetricCardNode,
  // SOP Workflow nodes
  ...SOPNodeTypes,
};
