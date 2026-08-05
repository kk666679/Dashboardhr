import {
  SOPStartNode,
  SOPEndNode,
  SOPDecisionNode,
  SOPActionNode,
  SOPApprovalNode,
  SOPNotificationNode,
  SOPEmailNode,
  SOPTaskNode,
} from "./SOPNodes";

export {
  SOPStartNode,
  SOPEndNode,
  SOPDecisionNode,
  SOPActionNode,
  SOPApprovalNode,
  SOPNotificationNode,
  SOPEmailNode,
  SOPTaskNode,
};

export const SOPNodeTypes = {
  sop_start: SOPStartNode,
  sop_end: SOPEndNode,
  sop_decision: SOPDecisionNode,
  sop_action: SOPActionNode,
  sop_approval: SOPApprovalNode,
  sop_notification: SOPNotificationNode,
  sop_email: SOPEmailNode,
  sop_task: SOPTaskNode,
};
