/**
 * ISO Workflow Integration
 * 
 * Shared utilities and types for integrating ISO compliance workflows
 * with the flow process designer.
 */

export type ComplianceWorkflowType = 
  | 'capa'
  | 'audit'
  | 'risk-assessment'
  | 'compliance-check'
  | 'gap-analysis';

export interface ComplianceWorkflowTemplate {
  id: string;
  type: ComplianceWorkflowType;
  name: string;
  description: string;
  isoStandard: string;
  defaultNodes: any[];
  defaultEdges: any[];
}

export interface ISOComplianceFlow {
  isoStandard: string;
  flowType: ComplianceWorkflowType;
  status: 'draft' | 'ready' | 'executed' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get default workflow template for compliance type
 */
export function getComplianceWorkflowTemplate(
  type: ComplianceWorkflowType,
  standard: string
): ComplianceWorkflowTemplate {
  const templates: Record<ComplianceWorkflowType, Omit<ComplianceWorkflowTemplate, 'isoStandard'>> = {
    'capa': {
      id: 'capa-template',
      type: 'capa',
      name: 'Corrective Action Workflow',
      description: 'Create and track corrective and preventive actions',
      defaultNodes: [
        {
          id: 'trigger-issue',
          type: 'trigger',
          position: { x: 100, y: 200 },
          data: { event: 'Non-Conformance Detected', source: 'Audit' },
        },
        {
          id: 'analyze-root-cause',
          type: 'task',
          position: { x: 350, y: 180 },
          data: { title: 'Root Cause Analysis (5-Whys)', status: 'pending' },
        },
        {
          id: 'design-action',
          type: 'task',
          position: { x: 600, y: 180 },
          data: { title: 'Design Corrective Action', status: 'pending' },
        },
        {
          id: 'implement',
          type: 'action',
          position: { x: 850, y: 100 },
          data: { action: 'Implement Action', status: 'idle' },
        },
        {
          id: 'verify-effectiveness',
          type: 'condition',
          position: { x: 1100, y: 180 },
          data: { condition: 'Action Effective?' },
        },
        {
          id: 'close',
          type: 'end',
          position: { x: 1350, y: 180 },
          data: { result: 'CAPA Closed', summary: 'Action verified effective' },
        },
      ],
      defaultEdges: [
        { id: 'e1', source: 'trigger-issue', target: 'analyze-root-cause' },
        { id: 'e2', source: 'analyze-root-cause', target: 'design-action' },
        { id: 'e3', source: 'design-action', target: 'implement' },
        { id: 'e4', source: 'implement', target: 'verify-effectiveness' },
        { id: 'e5', source: 'verify-effectiveness', target: 'close' },
      ],
    },
    'audit': {
      id: 'audit-template',
      type: 'audit',
      name: 'Audit Workflow',
      description: 'Plan, execute, and report audit findings',
      defaultNodes: [
        {
          id: 'trigger-audit',
          type: 'trigger',
          position: { x: 100, y: 200 },
          data: { event: 'Audit Scheduled', source: 'Calendar' },
        },
        {
          id: 'prepare-checklist',
          type: 'task',
          position: { x: 350, y: 180 },
          data: { title: 'Prepare Audit Checklist', status: 'pending' },
        },
        {
          id: 'conduct-audit',
          type: 'action',
          position: { x: 600, y: 180 },
          data: { action: 'Conduct Audit', status: 'idle' },
        },
        {
          id: 'report-findings',
          type: 'task',
          position: { x: 850, y: 180 },
          data: { title: 'Report Findings', status: 'pending' },
        },
        {
          id: 'followup',
          type: 'end',
          position: { x: 1100, y: 180 },
          data: { result: 'Audit Complete', summary: 'Findings documented' },
        },
      ],
      defaultEdges: [
        { id: 'e1', source: 'trigger-audit', target: 'prepare-checklist' },
        { id: 'e2', source: 'prepare-checklist', target: 'conduct-audit' },
        { id: 'e3', source: 'conduct-audit', target: 'report-findings' },
        { id: 'e4', source: 'report-findings', target: 'followup' },
      ],
    },
    'risk-assessment': {
      id: 'risk-template',
      type: 'risk-assessment',
      name: 'Risk Assessment Workflow',
      description: 'Identify, assess, and mitigate risks',
      defaultNodes: [
        {
          id: 'trigger-risk',
          type: 'trigger',
          position: { x: 100, y: 200 },
          data: { event: 'Risk Assessment Initiated', source: 'Manual' },
        },
        {
          id: 'identify-risks',
          type: 'task',
          position: { x: 350, y: 180 },
          data: { title: 'Identify Risks', status: 'pending' },
        },
        {
          id: 'assess-matrix',
          type: 'action',
          position: { x: 600, y: 180 },
          data: { action: 'Risk Matrix Assessment', status: 'idle' },
        },
        {
          id: 'high-risk',
          type: 'condition',
          position: { x: 850, y: 180 },
          data: { condition: 'High Risk?', trueLabel: 'Yes', falseLabel: 'No' },
        },
        {
          id: 'mitigate',
          type: 'task',
          position: { x: 1100, y: 80 },
          data: { title: 'Develop Mitigation Plan', status: 'pending' },
        },
        {
          id: 'monitor',
          type: 'task',
          position: { x: 1100, y: 280 },
          data: { title: 'Monitor Risk', status: 'pending' },
        },
        {
          id: 'close',
          type: 'end',
          position: { x: 1350, y: 180 },
          data: { result: 'Risk Assessment Complete' },
        },
      ],
      defaultEdges: [
        { id: 'e1', source: 'trigger-risk', target: 'identify-risks' },
        { id: 'e2', source: 'identify-risks', target: 'assess-matrix' },
        { id: 'e3', source: 'assess-matrix', target: 'high-risk' },
        { id: 'e4', source: 'high-risk', target: 'mitigate' },
        { id: 'e5', source: 'high-risk', target: 'monitor' },
        { id: 'e6', source: 'mitigate', target: 'close' },
        { id: 'e7', source: 'monitor', target: 'close' },
      ],
    },
    'compliance-check': {
      id: 'compliance-template',
      type: 'compliance-check',
      name: 'Compliance Check Workflow',
      description: 'Verify compliance against ISO standards',
      defaultNodes: [
        {
          id: 'trigger-check',
          type: 'trigger',
          position: { x: 100, y: 200 },
          data: { event: 'Compliance Check Started', source: 'Manual' },
        },
        {
          id: 'review-docs',
          type: 'task',
          position: { x: 350, y: 180 },
          data: { title: 'Review Documentation', status: 'pending' },
        },
        {
          id: 'verify-compliance',
          type: 'condition',
          position: { x: 600, y: 180 },
          data: { condition: 'Compliant?' },
        },
        {
          id: 'compliant-path',
          type: 'end',
          position: { x: 850, y: 80 },
          data: { result: 'Compliant', summary: 'All requirements met' },
        },
        {
          id: 'gap-path',
          type: 'task',
          position: { x: 850, y: 280 },
          data: { title: 'Document Gaps', status: 'pending' },
        },
      ],
      defaultEdges: [
        { id: 'e1', source: 'trigger-check', target: 'review-docs' },
        { id: 'e2', source: 'review-docs', target: 'verify-compliance' },
        { id: 'e3', source: 'verify-compliance', target: 'compliant-path' },
        { id: 'e4', source: 'verify-compliance', target: 'gap-path' },
      ],
    },
    'gap-analysis': {
      id: 'gap-template',
      type: 'gap-analysis',
      name: 'Gap Analysis Workflow',
      description: 'Identify and plan closure of compliance gaps',
      defaultNodes: [
        {
          id: 'trigger-gap',
          type: 'trigger',
          position: { x: 100, y: 200 },
          data: { event: 'Gap Analysis Initiated', source: 'Audit Result' },
        },
        {
          id: 'list-gaps',
          type: 'task',
          position: { x: 350, y: 180 },
          data: { title: 'List Identified Gaps', status: 'pending' },
        },
        {
          id: 'prioritize',
          type: 'action',
          position: { x: 600, y: 180 },
          data: { action: 'Prioritize Gaps', status: 'idle' },
        },
        {
          id: 'plan-closure',
          type: 'task',
          position: { x: 850, y: 180 },
          data: { title: 'Plan Gap Closure', status: 'pending' },
        },
        {
          id: 'execute',
          type: 'action',
          position: { x: 1100, y: 180 },
          data: { action: 'Execute Action Plans', status: 'idle' },
        },
        {
          id: 'close',
          type: 'end',
          position: { x: 1350, y: 180 },
          data: { result: 'Gap Closure Complete' },
        },
      ],
      defaultEdges: [
        { id: 'e1', source: 'trigger-gap', target: 'list-gaps' },
        { id: 'e2', source: 'list-gaps', target: 'prioritize' },
        { id: 'e3', source: 'prioritize', target: 'plan-closure' },
        { id: 'e4', source: 'plan-closure', target: 'execute' },
        { id: 'e5', source: 'execute', target: 'close' },
      ],
    },
  };

  return {
    ...templates[type],
    isoStandard: standard,
  };
}

/**
 * Create default workflow state from template
 */
export function createWorkflowFromTemplate(
  template: ComplianceWorkflowTemplate
): { nodes: any[]; edges: any[] } {
  return {
    nodes: template.defaultNodes,
    edges: template.defaultEdges,
  };
}

/**
 * Get compliance links for navigation
 */
export function getComplianceIntegrationLinks() {
  return [
    { label: 'ISO Compliance', href: '/iso' },
    { label: 'Flow Designer', href: '/flow-process' },
    { label: 'Enhanced Designer', href: '/flow-process/enhanced' },
  ];
}
