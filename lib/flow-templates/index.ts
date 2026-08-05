/**
 * Flow Template Registry
 *
 * Full React Flow node + edge graphs for every HR/compliance template.
 * Every template has:
 *  - id           — matches the `?template=` query param
 *  - name, description, category, steps count, estimated duration
 *  - nodes[]      — proper React Flow nodes with typed AutomationNodeData
 *  - edges[]      — typed React Flow edges with smoothstep routing
 *
 * Used by:
 *  - WorkflowStore.loadTemplate()   — loads graph into the designer canvas
 *  - Templates page                 — browse/filter/preview
 *  - LibraryData                    — node palette library templates
 */

import { MarkerType, type Node, type Edge } from "@xyflow/react";
import type { AutomationNodeData } from "@/components/features/automation/node/types";

export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  category: FlowTemplateCategory;
  tags: string[];
  steps: number;
  estimatedMinutes: number;
  standard?: string;
  nodes: Node<AutomationNodeData>[];
  edges: Edge[];
}

export type FlowTemplateCategory =
  | "HR"
  | "Onboarding"
  | "Offboarding"
  | "Payroll"
  | "Compliance"
  | "Performance"
  | "Recruitment"
  | "QMS"
  | "Immigration"
  | "Finance"
  | "IT";

// ─── Shared edge factory ──────────────────────────────────────────────────────

const E = (
  id: string,
  source: string,
  target: string,
  label?: string
): Edge => ({
  id,
  source,
  target,
  type: "smoothstep",
  label,
  markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
  style: { strokeWidth: 1.5 },
});

// Conditional (decision) edge — approved path
const EA = (id: string, source: string, target: string): Edge => ({
  ...E(id, source, target, "Approved"),
  style: { stroke: "#22c55e", strokeWidth: 1.5 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
});

// Conditional (decision) edge — rejected path
const ER = (id: string, source: string, target: string): Edge => ({
  ...E(id, source, target, "Rejected"),
  style: { stroke: "#ef4444", strokeWidth: 1.5 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
});

// ─── Node factory helpers ──────────────────────────────────────────────────────

const N = (
  id: string,
  type: string,
  x: number,
  y: number,
  data: AutomationNodeData
): Node<AutomationNodeData> => ({
  id,
  type,
  position: { x, y },
  data,
});

const START  = (id: string, x: number, y: number, label = "Start") =>
  N(id, "start",    x, y, { label, trigger: "manual" });
const END    = (id: string, x: number, y: number, label = "Complete") =>
  N(id, "end",      x, y, { label, result: "success" });
const ACTION = (id: string, x: number, y: number, label: string, description = "") =>
  N(id, "action",   x, y, { label, description, actionType: "execute" });
const APPROVAL = (id: string, x: number, y: number, label: string, assigneeRole: string) =>
  N(id, "approval", x, y, { label, assigneeRole, description: `${assigneeRole} review` });
const DECISION = (id: string, x: number, y: number, label: string, condition = "") =>
  N(id, "decision", x, y, { label, condition, yes: "Approve", no: "Reject" });
const EMAIL  = (id: string, x: number, y: number, subject: string, to = "") =>
  N(id, "email",    x, y, { label: "Send Email", subject, to, body: "" });
const NOTIFY = (id: string, x: number, y: number, title: string, message: string) =>
  N(id, "notification", x, y, { label: "Notify", title, message });
const CONDITION = (id: string, x: number, y: number, label: string, condition: string) =>
  N(id, "condition", x, y, { label, condition });
const TRIGGER = (id: string, x: number, y: number, label: string, event: string) =>
  N(id, "trigger", x, y, { label, event });
const PARALLEL = (id: string, x: number, y: number, label: string) =>
  N(id, "parallel", x, y, { label, groupType: "parallel" });

// X spacing constant for horizontal layouts
const DX = 220;
const DY = 140;

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 1: Leave Approval
// ─────────────────────────────────────────────────────────────────────────────
const leaveApproval: FlowTemplate = {
  id: "leave-approval",
  name: "Leave Approval",
  description: "Multi-level leave approval with auto-escalation and SLA tracking",
  category: "HR",
  tags: ["leave", "approval", "hr", "sla"],
  steps: 6,
  estimatedMinutes: 60,
  nodes: [
    START("s1",   80, 200, "Employee Submits Request"),
    ACTION("a1", 300, 200, "Validate Leave Balance", "Check available leave days"),
    APPROVAL("ap1", 520, 200, "Line Manager Approval", "Line_Manager"),
    DECISION("d1", 740, 200, "Approved?", "manager_decision === APPROVED"),
    APPROVAL("ap2", 960, 80,  "HR Verification", "HR_Manager"),
    ACTION("a2",  960, 320, "Reject & Notify", "Send rejection email"),
    EMAIL("em1", 1180, 80,  "Leave Approved Notification", "employee@company.com"),
    ACTION("a3", 1180, 320, "Update Leave Balance", "Deduct approved days"),
    END("e1", 1400, 200, "Leave Processed"),
  ],
  edges: [
    E("e-s1-a1",   "s1",  "a1"),
    E("e-a1-ap1",  "a1",  "ap1"),
    E("e-ap1-d1",  "ap1", "d1"),
    EA("e-d1-ap2", "d1",  "ap2"),
    ER("e-d1-a2",  "d1",  "a2"),
    E("e-ap2-em1", "ap2", "em1"),
    E("e-em1-a3",  "em1", "a3"),
    E("e-a3-e1",   "a3",  "e1"),
    E("e-a2-e1",   "a2",  "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 2: Employee Onboarding
// ─────────────────────────────────────────────────────────────────────────────
const employeeOnboarding: FlowTemplate = {
  id: "onboarding",
  name: "Employee Onboarding",
  description: "Full onboarding from offer acceptance to day-one orientation",
  category: "Onboarding",
  tags: ["onboarding", "hr", "new-hire", "it"],
  steps: 9,
  estimatedMinutes: 2880,
  nodes: [
    START("s1",   80, 200, "Offer Accepted"),
    ACTION("a1", 300, 200, "Send Welcome Email & Docs Checklist"),
    ACTION("a2", 520, 200, "IT Account Setup", "Create email, Slack, system access"),
    ACTION("a3", 740, 200, "Collect Documents", "Passport, IC, bank details"),
    APPROVAL("ap1", 960, 200, "HR Document Review", "HR_Manager"),
    DECISION("d1", 1180, 200, "Docs Complete?"),
    ACTION("a4", 1400, 80, "Generate Employment Contract"),
    ACTION("a5", 1400, 320, "Request Missing Docs"),
    APPROVAL("ap2", 1620, 80, "Contract E-Signature", "Employee"),
    ACTION("a6", 1840, 80, "Setup Payroll & Benefits"),
    ACTION("a7", 2060, 80, "Day-One Orientation Schedule"),
    END("e1", 2280, 80, "Onboarding Complete"),
  ],
  edges: [
    E("e-s1-a1",   "s1",  "a1"),
    E("e-a1-a2",   "a1",  "a2"),
    E("e-a2-a3",   "a2",  "a3"),
    E("e-a3-ap1",  "a3",  "ap1"),
    E("e-ap1-d1",  "ap1", "d1"),
    EA("e-d1-a4",  "d1",  "a4"),
    ER("e-d1-a5",  "d1",  "a5"),
    E("e-a5-a3",   "a5",  "a3"),
    E("e-a4-ap2",  "a4",  "ap2"),
    E("e-ap2-a6",  "ap2", "a6"),
    E("e-a6-a7",   "a6",  "a7"),
    E("e-a7-e1",   "a7",  "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 3: Payroll Run
// ─────────────────────────────────────────────────────────────────────────────
const payrollRun: FlowTemplate = {
  id: "payroll-run",
  name: "Payroll Run",
  description: "Automated payroll calculation, statutory deductions, approval and disbursement",
  category: "Payroll",
  tags: ["payroll", "epf", "socso", "pcb", "finance"],
  steps: 8,
  estimatedMinutes: 90,
  nodes: [
    TRIGGER("t1", 80, 200, "Monthly Payroll Trigger", "schedule.monthly"),
    ACTION("a1", 300, 200, "Fetch Attendance & OT Records"),
    ACTION("a2", 520, 200, "Calculate Gross Pay", "Basic + allowances + OT"),
    ACTION("a3", 740, 200, "Compute EPF / SOCSO / EIS / PCB"),
    ACTION("a4", 960, 200, "Generate Payslips"),
    APPROVAL("ap1", 1180, 200, "CFO Approval", "CFO"),
    DECISION("d1", 1400, 200, "Approved?"),
    ACTION("a5", 1620, 80, "Submit to Bank", "Upload bank payment file"),
    ACTION("a6", 1620, 320, "Hold & Notify CFO"),
    ACTION("a7", 1840, 80, "Submit EPF/SOCSO/PCB to Gov Portals"),
    EMAIL("em1", 2060, 80, "Payslip Distribution", "all-employees@company.com"),
    END("e1", 2280, 80, "Payroll Complete"),
  ],
  edges: [
    E("e-t1-a1",   "t1",  "a1"),
    E("e-a1-a2",   "a1",  "a2"),
    E("e-a2-a3",   "a2",  "a3"),
    E("e-a3-a4",   "a3",  "a4"),
    E("e-a4-ap1",  "a4",  "ap1"),
    E("e-ap1-d1",  "ap1", "d1"),
    EA("e-d1-a5",  "d1",  "a5"),
    ER("e-d1-a6",  "d1",  "a6"),
    E("e-a5-a7",   "a5",  "a7"),
    E("e-a7-em1",  "a7",  "em1"),
    E("e-em1-e1",  "em1", "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 4: Permit / Visa Renewal
// ─────────────────────────────────────────────────────────────────────────────
const permitRenewal: FlowTemplate = {
  id: "permit-renewal",
  name: "Permit Renewal",
  description: "Expiry-triggered work permit and visa renewal workflow for foreign workers",
  category: "Immigration",
  tags: ["permit", "visa", "plks", "fwcms", "immigration", "compliance"],
  steps: 8,
  estimatedMinutes: 10080,
  nodes: [
    TRIGGER("t1", 80, 200, "60-Day Expiry Alert", "cron.permit-expiry-check"),
    ACTION("a1", 300, 200, "Check FOMEMA Fitness Status"),
    DECISION("d1", 520, 200, "FOMEMA Valid?"),
    ACTION("a2", 740, 80, "Submit FWCMS Renewal Application"),
    ACTION("a3", 740, 320, "Schedule FOMEMA Appointment"),
    APPROVAL("ap1", 960, 80, "HR Compliance Review", "Compliance_Officer"),
    ACTION("a4", 1180, 80, "Pay Levy via MYEG"),
    ACTION("a5", 1400, 80, "JTK / JIM Approval Tracking"),
    ACTION("a6", 1620, 80, "Collect New Permit"),
    EMAIL("em1", 1840, 80, "Permit Renewed Notification"),
    END("e1", 2060, 80, "Renewal Complete"),
    END("e2", 960, 320, "Pending FOMEMA"),
  ],
  edges: [
    E("e-t1-a1",   "t1",  "a1"),
    E("e-a1-d1",   "a1",  "d1"),
    EA("e-d1-a2",  "d1",  "a2"),
    ER("e-d1-a3",  "d1",  "a3"),
    E("e-a3-e2",   "a3",  "e2"),
    E("e-a2-ap1",  "a2",  "ap1"),
    E("e-ap1-a4",  "ap1", "a4"),
    E("e-a4-a5",   "a4",  "a5"),
    E("e-a5-a6",   "a5",  "a6"),
    E("e-a6-em1",  "a6",  "em1"),
    E("e-em1-e1",  "em1", "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 5: Performance Review
// ─────────────────────────────────────────────────────────────────────────────
const performanceReview: FlowTemplate = {
  id: "performance-review",
  name: "Performance Review",
  description: "Annual review cycle with self-assessment, manager review, calibration and IDP",
  category: "Performance",
  tags: ["performance", "review", "appraisal", "hr"],
  steps: 8,
  estimatedMinutes: 10080,
  nodes: [
    TRIGGER("t1", 80, 200, "Review Cycle Opened", "event.review-cycle-start"),
    ACTION("a1", 300, 200, "Send Self-Assessment Form", "Email link to employee"),
    APPROVAL("ap1", 520, 200, "Employee Self-Assessment", "Employee"),
    APPROVAL("ap2", 740, 200, "Manager Assessment", "Line_Manager"),
    APPROVAL("ap3", 960, 200, "HR Calibration", "HR_Manager"),
    APPROVAL("ap4", 1180, 200, "Final Rating Sign-Off", "HR_Director"),
    ACTION("a2", 1400, 200, "Publish Ratings & Notify"),
    ACTION("a3", 1620, 200, "Generate IDP for Low Performers"),
    END("e1", 1840, 200, "Review Cycle Closed"),
  ],
  edges: [
    E("e-t1-a1",   "t1",  "a1"),
    E("e-a1-ap1",  "a1",  "ap1"),
    E("e-ap1-ap2", "ap1", "ap2"),
    E("e-ap2-ap3", "ap2", "ap3"),
    E("e-ap3-ap4", "ap3", "ap4"),
    E("e-ap4-a2",  "ap4", "a2"),
    E("e-a2-a3",   "a2",  "a3"),
    E("e-a3-e1",   "a3",  "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 6: Termination / Offboarding
// ─────────────────────────────────────────────────────────────────────────────
const terminationClearance: FlowTemplate = {
  id: "termination",
  name: "Termination Clearance",
  description: "Off-boarding checklist, asset return, access revocation and final pay",
  category: "Offboarding",
  tags: ["offboarding", "termination", "exit", "clearance"],
  steps: 8,
  estimatedMinutes: 2880,
  nodes: [
    START("s1",   80, 200, "Termination Initiated"),
    ACTION("a1", 300, 200, "Send Exit Notice & Checklist"),
    PARALLEL("p1", 520, 200, "Parallel Clearance"),
    ACTION("a2", 740, 80,  "IT Access Revocation"),
    ACTION("a3", 740, 200, "Asset Return Collection"),
    ACTION("a4", 740, 320, "Knowledge Transfer Handover"),
    ACTION("a5", 960, 200, "Calculate Final Pay & Benefits"),
    APPROVAL("ap1", 1180, 200, "Finance Approval", "Finance_Manager"),
    ACTION("a6", 1400, 200, "Process Final Bank Payment"),
    ACTION("a7", 1620, 200, "Issue Experience Letter"),
    EMAIL("em1", 1840, 200, "Exit Confirmation Email"),
    END("e1", 2060, 200, "Offboarding Complete"),
  ],
  edges: [
    E("e-s1-a1",   "s1",  "a1"),
    E("e-a1-p1",   "a1",  "p1"),
    E("e-p1-a2",   "p1",  "a2"),
    E("e-p1-a3",   "p1",  "a3"),
    E("e-p1-a4",   "p1",  "a4"),
    E("e-a2-a5",   "a2",  "a5"),
    E("e-a3-a5",   "a3",  "a5"),
    E("e-a4-a5",   "a4",  "a5"),
    E("e-a5-ap1",  "a5",  "ap1"),
    E("e-ap1-a6",  "ap1", "a6"),
    E("e-a6-a7",   "a6",  "a7"),
    E("e-a7-em1",  "a7",  "em1"),
    E("e-em1-e1",  "em1", "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 7: Recruitment Pipeline
// ─────────────────────────────────────────────────────────────────────────────
const recruitmentPipeline: FlowTemplate = {
  id: "recruitment",
  name: "Recruitment Pipeline",
  description: "End-to-end hiring from JD approval to offer letter and onboarding hand-off",
  category: "Recruitment",
  tags: ["recruitment", "hiring", "jd", "offer", "interview"],
  steps: 10,
  estimatedMinutes: 14400,
  nodes: [
    START("s1",   80, 200, "Vacancy Raised"),
    APPROVAL("ap1", 300, 200, "JD Approval", "HR_Director"),
    ACTION("a1", 520, 200, "Post to Job Boards", "JobStreet, LinkedIn, MyFutureJobs"),
    ACTION("a2", 740, 200, "Screen Resumes & Shortlist"),
    ACTION("a3", 960, 200, "Send Interview Invitations"),
    ACTION("a4", 1180, 200, "Conduct Interviews"),
    DECISION("d1", 1400, 200, "Candidate Selected?"),
    ACTION("a5", 1620, 80, "Generate Offer Letter"),
    ACTION("a6", 1620, 320, "Re-open Search"),
    APPROVAL("ap2", 1840, 80, "Candidate Accepts Offer", "Candidate"),
    ACTION("a7", 2060, 80, "Trigger Onboarding Flow"),
    END("e1", 2280, 80, "Hired"),
    END("e2", 1840, 320, "Search Continues"),
  ],
  edges: [
    E("e-s1-ap1",  "s1",  "ap1"),
    E("e-ap1-a1",  "ap1", "a1"),
    E("e-a1-a2",   "a1",  "a2"),
    E("e-a2-a3",   "a2",  "a3"),
    E("e-a3-a4",   "a3",  "a4"),
    E("e-a4-d1",   "a4",  "d1"),
    EA("e-d1-a5",  "d1",  "a5"),
    ER("e-d1-a6",  "d1",  "a6"),
    E("e-a6-e2",   "a6",  "e2"),
    E("e-a5-ap2",  "a5",  "ap2"),
    E("e-ap2-a7",  "ap2", "a7"),
    E("e-a7-e1",   "a7",  "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 8: ISO 9001 Internal Audit
// ─────────────────────────────────────────────────────────────────────────────
const isoAudit: FlowTemplate = {
  id: "iso-audit",
  name: "ISO 9001 Internal Audit",
  description: "Quality management system internal audit — schedule, conduct, findings, and closure",
  category: "QMS",
  tags: ["iso", "iso9001", "audit", "qms", "compliance"],
  steps: 7,
  estimatedMinutes: 4320,
  standard: "ISO9001",
  nodes: [
    START("s1",   80, 200, "Audit Scheduled"),
    ACTION("a1", 300, 200, "Generate Audit Checklist", "Select clauses 4–10"),
    ACTION("a2", 520, 200, "Notify Auditees & Send Pre-Audit Questionnaire"),
    ACTION("a3", 740, 200, "Conduct Audit & Record Findings"),
    DECISION("d1", 960, 200, "Non-Conformances Found?"),
    ACTION("a4", 1180, 80, "Raise CAPA Items"),
    ACTION("a5", 1180, 320, "Issue Conformance Certificate"),
    APPROVAL("ap1", 1400, 80, "CAPA Review & Closure", "Quality_Manager"),
    ACTION("a6", 1620, 80, "Update QMS Documentation"),
    ACTION("a7", 1840, 160, "Publish Audit Report"),
    END("e1", 2060, 160, "Audit Closed"),
  ],
  edges: [
    E("e-s1-a1",   "s1",  "a1"),
    E("e-a1-a2",   "a1",  "a2"),
    E("e-a2-a3",   "a2",  "a3"),
    E("e-a3-d1",   "a3",  "d1"),
    EA("e-d1-a4",  "d1",  "a4"),
    ER("e-d1-a5",  "d1",  "a5"),
    E("e-a4-ap1",  "a4",  "ap1"),
    E("e-ap1-a6",  "ap1", "a6"),
    E("e-a5-a7",   "a5",  "a7"),
    E("e-a6-a7",   "a6",  "a7"),
    E("e-a7-e1",   "a7",  "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 9: CAPA Resolution
// ─────────────────────────────────────────────────────────────────────────────
const capaResolution: FlowTemplate = {
  id: "capa",
  name: "CAPA Resolution",
  description: "Corrective and preventive action lifecycle — root cause analysis to verified closure",
  category: "QMS",
  tags: ["capa", "corrective", "preventive", "qms", "iso"],
  steps: 6,
  estimatedMinutes: 2880,
  nodes: [
    START("s1",   80, 200, "Non-Conformance Raised"),
    ACTION("a1", 300, 200, "5-Whys Root Cause Analysis"),
    ACTION("a2", 520, 200, "Define Corrective Action Plan"),
    APPROVAL("ap1", 740, 200, "Quality Manager Approval", "Quality_Manager"),
    ACTION("a3", 960, 200, "Implement Corrective Actions"),
    ACTION("a4", 1180, 200, "Verify Effectiveness (30-day check)"),
    DECISION("d1", 1400, 200, "Effective?"),
    ACTION("a5", 1620, 80, "Close CAPA"),
    ACTION("a6", 1620, 320, "Re-open & Escalate"),
    END("e1", 1840, 80, "CAPA Closed"),
    END("e2", 1840, 320, "Escalated"),
  ],
  edges: [
    E("e-s1-a1",   "s1",  "a1"),
    E("e-a1-a2",   "a1",  "a2"),
    E("e-a2-ap1",  "a2",  "ap1"),
    E("e-ap1-a3",  "ap1", "a3"),
    E("e-a3-a4",   "a3",  "a4"),
    E("e-a4-d1",   "a4",  "d1"),
    EA("e-d1-a5",  "d1",  "a5"),
    ER("e-d1-a6",  "d1",  "a6"),
    E("e-a5-e1",   "a5",  "e1"),
    E("e-a6-e2",   "a6",  "e2"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 10: Foreign Worker Onboarding
// ─────────────────────────────────────────────────────────────────────────────
const foreignWorkerOnboarding: FlowTemplate = {
  id: "fw-onboarding",
  name: "Foreign Worker Onboarding",
  description: "10-stage foreign worker lifecycle: quota → permit → FOMEMA → accommodation → deployment",
  category: "Immigration",
  tags: ["foreign-worker", "plks", "fomema", "levy", "accommodation", "immigration"],
  steps: 10,
  estimatedMinutes: 43200,
  nodes: [
    START("s1",   80, 200, "Quota Approved"),
    ACTION("a1", 300, 200, "Overseas Recruitment & Medical Pre-departure"),
    ACTION("a2", 520, 200, "Visa Call-Up Letter via FWCMS"),
    ACTION("a3", 740, 200, "Arrival & Immigration Clearance"),
    ACTION("a4", 960, 200, "FOMEMA Medical Examination (Malaysia)"),
    DECISION("d1", 1180, 200, "FOMEMA Fit?"),
    ACTION("a5", 1400, 80,  "PLKS Registration & eKad"),
    ACTION("a6", 1400, 320, "Unfit — Arrange Repatriation"),
    ACTION("a7", 1620, 80,  "Pay Levy via MYEG"),
    ACTION("a8", 1840, 80,  "Assign Accommodation (EMA Act 446)"),
    ACTION("a9", 2060, 80,  "Deploy to Worksite"),
    NOTIFY("n1", 2280, 80,  "Deployment Confirmed", "Worker deployed to site"),
    END("e1", 2500, 80,  "Worker Onboarded"),
    END("e2", 1620, 320, "Repatriation Initiated"),
  ],
  edges: [
    E("e-s1-a1",   "s1",  "a1"),
    E("e-a1-a2",   "a1",  "a2"),
    E("e-a2-a3",   "a2",  "a3"),
    E("e-a3-a4",   "a3",  "a4"),
    E("e-a4-d1",   "a4",  "d1"),
    EA("e-d1-a5",  "d1",  "a5"),
    ER("e-d1-a6",  "d1",  "a6"),
    E("e-a6-e2",   "a6",  "e2"),
    E("e-a5-a7",   "a5",  "a7"),
    E("e-a7-a8",   "a7",  "a8"),
    E("e-a8-a9",   "a8",  "a9"),
    E("e-a9-n1",   "a9",  "n1"),
    E("e-n1-e1",   "n1",  "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 11: Expatriate Employment Pass
// ─────────────────────────────────────────────────────────────────────────────
const expatriateEP: FlowTemplate = {
  id: "expat-ep",
  name: "Expatriate Employment Pass",
  description: "Employment Pass application through ESD portal — Cat I, II or III",
  category: "Immigration",
  tags: ["expat", "employment-pass", "esd", "ep", "immigration"],
  steps: 7,
  estimatedMinutes: 21600,
  nodes: [
    START("s1",   80, 200, "EP Application Initiated"),
    ACTION("a1", 300, 200, "Verify Employment Contract & Salary Threshold"),
    ACTION("a2", 520, 200, "Prepare ESD Application Package"),
    ACTION("a3", 740, 200, "Submit via ESD Portal (esd.gov.my)"),
    ACTION("a4", 960, 200, "Track Application Status"),
    DECISION("d1", 1180, 200, "EP Approved?"),
    ACTION("a5", 1400, 80,  "Collect EP & Issue eKad"),
    ACTION("a6", 1400, 320, "Appeal or Resubmit"),
    ACTION("a7", 1620, 80,  "Register with LHDN (CP22B setup)"),
    EMAIL("em1", 1840, 80,  "EP Issuance Notification"),
    END("e1", 2060, 80,  "EP Active"),
    END("e2", 1620, 320, "Under Review"),
  ],
  edges: [
    E("e-s1-a1",   "s1",  "a1"),
    E("e-a1-a2",   "a1",  "a2"),
    E("e-a2-a3",   "a2",  "a3"),
    E("e-a3-a4",   "a3",  "a4"),
    E("e-a4-d1",   "a4",  "d1"),
    EA("e-d1-a5",  "d1",  "a5"),
    ER("e-d1-a6",  "d1",  "a6"),
    E("e-a6-e2",   "a6",  "e2"),
    E("e-a5-a7",   "a5",  "a7"),
    E("e-a7-em1",  "a7",  "em1"),
    E("e-em1-e1",  "em1", "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 12: Disciplinary / Domestic Inquiry
// ─────────────────────────────────────────────────────────────────────────────
const domesticInquiry: FlowTemplate = {
  id: "domestic-inquiry",
  name: "Domestic Inquiry (DI)",
  description: "Show cause, domestic inquiry panel, and disciplinary outcome per EA 1955 s.14",
  category: "HR",
  tags: ["disciplinary", "domestic-inquiry", "show-cause", "ir", "employment-act"],
  steps: 8,
  estimatedMinutes: 7200,
  nodes: [
    START("s1",   80, 200, "Misconduct Report Filed"),
    ACTION("a1", 300, 200, "Issue Show Cause Letter (SCL)"),
    APPROVAL("ap1", 520, 200, "Employee Response", "Employee"),
    DECISION("d1", 740, 200, "Response Satisfactory?"),
    ACTION("a2", 960, 80,  "Close Case — Warning Issued"),
    ACTION("a3", 960, 320, "Convene DI Panel"),
    APPROVAL("ap2", 1180, 320, "DI Panel Hearing", "HR_Director"),
    DECISION("d2", 1400, 320, "Outcome?"),
    ACTION("a4", 1620, 200, "Dismissal Letter"),
    ACTION("a5", 1620, 400, "Suspension / Warning Letter"),
    EMAIL("em1", 1840, 280, "Outcome Notification"),
    END("e1", 960, 80,  "Case Closed"),
    END("e2", 2060, 280, "Case Concluded"),
  ],
  edges: [
    E("e-s1-a1",   "s1",  "a1"),
    E("e-a1-ap1",  "a1",  "ap1"),
    E("e-ap1-d1",  "ap1", "d1"),
    EA("e-d1-a2",  "d1",  "a2"),
    ER("e-d1-a3",  "d1",  "a3"),
    E("e-a2-e1",   "a2",  "e1"),
    E("e-a3-ap2",  "a3",  "ap2"),
    E("e-ap2-d2",  "ap2", "d2"),
    EA("e-d2-a4",  "d2",  "a4"),
    ER("e-d2-a5",  "d2",  "a5"),
    E("e-a4-em1",  "a4",  "em1"),
    E("e-a5-em1",  "a5",  "em1"),
    E("e-em1-e2",  "em1", "e2"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 13: Repatriation
// ─────────────────────────────────────────────────────────────────────────────
const repatriation: FlowTemplate = {
  id: "repatriation",
  name: "Foreign Worker Repatriation",
  description: "End-of-contract repatriation — final pay, permit cancellation, and departure clearance",
  category: "Immigration",
  tags: ["repatriation", "foreign-worker", "offboarding", "permit-cancellation"],
  steps: 7,
  estimatedMinutes: 2880,
  nodes: [
    START("s1",   80, 200, "Repatriation Initiated"),
    ACTION("a1", 300, 200, "Issue Exit Notice (30-day)"),
    PARALLEL("p1", 520, 200, "Parallel Clearance"),
    ACTION("a2", 740, 80,  "Calculate Final Pay & Deductions"),
    ACTION("a3", 740, 200, "Cancel PLKS via FWCMS"),
    ACTION("a4", 740, 320, "Vacate Accommodation & Return Assets"),
    APPROVAL("ap1", 960, 200, "Finance Approval — Final Pay", "Finance_Manager"),
    ACTION("a5", 1180, 200, "Process Bank Transfer"),
    ACTION("a6", 1400, 200, "Book Return Flight"),
    ACTION("a7", 1620, 200, "Immigration Departure Clearance"),
    END("e1", 1840, 200, "Worker Repatriated"),
  ],
  edges: [
    E("e-s1-a1",   "s1",  "a1"),
    E("e-a1-p1",   "a1",  "p1"),
    E("e-p1-a2",   "p1",  "a2"),
    E("e-p1-a3",   "p1",  "a3"),
    E("e-p1-a4",   "p1",  "a4"),
    E("e-a2-ap1",  "a2",  "ap1"),
    E("e-a3-ap1",  "a3",  "ap1"),
    E("e-a4-ap1",  "a4",  "ap1"),
    E("e-ap1-a5",  "ap1", "a5"),
    E("e-a5-a6",   "a5",  "a6"),
    E("e-a6-a7",   "a6",  "a7"),
    E("e-a7-e1",   "a7",  "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 14: Contract Renewal
// ─────────────────────────────────────────────────────────────────────────────
const contractRenewal: FlowTemplate = {
  id: "contract-renewal",
  name: "Contract Renewal",
  description: "Employment contract renewal — negotiation, preparation, e-signature and filing",
  category: "HR",
  tags: ["contract", "renewal", "e-signature", "hr"],
  steps: 6,
  estimatedMinutes: 2880,
  nodes: [
    TRIGGER("t1", 80, 200, "90-Day Contract Expiry Alert", "cron.contract-expiry"),
    ACTION("a1", 300, 200, "Send Renewal Intention Letter"),
    APPROVAL("ap1", 520, 200, "Employee Response", "Employee"),
    DECISION("d1", 740, 200, "Renewing?"),
    ACTION("a2", 960, 80,  "Prepare Renewal Contract"),
    ACTION("a3", 960, 320, "Issue Non-Renewal Notice"),
    APPROVAL("ap2", 1180, 80, "Employee E-Signature", "Employee"),
    ACTION("a4", 1400, 80,  "File Contract & Update HR Records"),
    EMAIL("em1", 1620, 80,  "Renewal Confirmation Email"),
    END("e1", 1840, 80,  "Contract Renewed"),
    END("e2", 1180, 320, "Non-Renewal Processed"),
  ],
  edges: [
    E("e-t1-a1",   "t1",  "a1"),
    E("e-a1-ap1",  "a1",  "ap1"),
    E("e-ap1-d1",  "ap1", "d1"),
    EA("e-d1-a2",  "d1",  "a2"),
    ER("e-d1-a3",  "d1",  "a3"),
    E("e-a3-e2",   "a3",  "e2"),
    E("e-a2-ap2",  "a2",  "ap2"),
    E("e-ap2-a4",  "ap2", "a4"),
    E("e-a4-em1",  "a4",  "em1"),
    E("e-em1-e1",  "em1", "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 15: Claims Approval
// ─────────────────────────────────────────────────────────────────────────────
const claimsApproval: FlowTemplate = {
  id: "claims-approval",
  name: "Claims & Expense Approval",
  description: "Employee expense and reimbursement claim workflow with receipt verification",
  category: "Finance",
  tags: ["claims", "expense", "reimbursement", "finance", "approval"],
  steps: 6,
  estimatedMinutes: 1440,
  nodes: [
    START("s1",   80, 200, "Claim Submitted"),
    ACTION("a1", 300, 200, "Validate Receipts & Policy Limits"),
    DECISION("d1", 520, 200, "Within Policy?"),
    APPROVAL("ap1", 740, 80,  "Manager Approval", "Line_Manager"),
    ACTION("a2", 740, 320, "Reject — Return to Employee"),
    DECISION("d2", 960, 80,  "Approved?"),
    ACTION("a3", 1180, 80,  "Finance Processing & Payment"),
    ACTION("a4", 1180, 240, "Partial Approve — Adjust Amount"),
    EMAIL("em1", 1400, 160, "Reimbursement Notification"),
    END("e1", 1620, 160, "Claim Settled"),
    END("e2", 960, 320, "Claim Rejected"),
  ],
  edges: [
    E("e-s1-a1",   "s1",  "a1"),
    E("e-a1-d1",   "a1",  "d1"),
    EA("e-d1-ap1", "d1",  "ap1"),
    ER("e-d1-a2",  "d1",  "a2"),
    E("e-a2-e2",   "a2",  "e2"),
    E("e-ap1-d2",  "ap1", "d2"),
    EA("e-d2-a3",  "d2",  "a3"),
    ER("e-d2-a4",  "d2",  "a4"),
    E("e-a3-em1",  "a3",  "em1"),
    E("e-a4-em1",  "a4",  "em1"),
    E("e-em1-e1",  "em1", "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 16: Training Enrolment & HRDC Claim
// ─────────────────────────────────────────────────────────────────────────────
const trainingHrdc: FlowTemplate = {
  id: "training-hrdc",
  name: "Training Enrolment & HRDC Claim",
  description: "Training needs identification, approval, HRDC levy claim and post-training evaluation",
  category: "HR",
  tags: ["training", "hrdc", "learning", "development", "claim"],
  steps: 7,
  estimatedMinutes: 14400,
  nodes: [
    START("s1",   80, 200, "Training Need Identified"),
    ACTION("a1", 300, 200, "Identify Approved Training Provider"),
    APPROVAL("ap1", 520, 200, "Manager Approval", "Line_Manager"),
    ACTION("a2", 740, 200, "Register Employee & Submit to HRDC"),
    ACTION("a3", 960, 200, "Attend Training"),
    ACTION("a4", 1180, 200, "Submit HRDC Claim & Certificate"),
    ACTION("a5", 1400, 200, "Post-Training Assessment"),
    DECISION("d1", 1620, 200, "Competency Achieved?"),
    ACTION("a6", 1840, 80,  "Update Skills Matrix"),
    ACTION("a7", 1840, 320, "Schedule Follow-up Training"),
    END("e1", 2060, 200, "Training Completed"),
  ],
  edges: [
    E("e-s1-a1",   "s1",  "a1"),
    E("e-a1-ap1",  "a1",  "ap1"),
    E("e-ap1-a2",  "ap1", "a2"),
    E("e-a2-a3",   "a2",  "a3"),
    E("e-a3-a4",   "a3",  "a4"),
    E("e-a4-a5",   "a4",  "a5"),
    E("e-a5-d1",   "a5",  "d1"),
    EA("e-d1-a6",  "d1",  "a6"),
    ER("e-d1-a7",  "d1",  "a7"),
    E("e-a6-e1",   "a6",  "e1"),
    E("e-a7-e1",   "a7",  "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 17: Regulatory Change Impact
// ─────────────────────────────────────────────────────────────────────────────
const regulatoryChange: FlowTemplate = {
  id: "regulatory-change",
  name: "Regulatory Change Response",
  description: "10-step regulatory change pipeline — detect, assess impact, update policies and notify teams",
  category: "Compliance",
  tags: ["regulatory", "compliance", "policy", "gazette", "impact-assessment"],
  steps: 10,
  estimatedMinutes: 1440,
  nodes: [
    TRIGGER("t1",  80, 200, "Gazette / Circular Detected", "event.regulatory-change"),
    ACTION("a1",  300, 200, "Compare Old vs New Requirements"),
    ACTION("a2",  520, 200, "Identify Affected Workflows & Policies"),
    ACTION("a3",  740, 200, "Update Internal Policies"),
    PARALLEL("p1", 960, 200, "Parallel Notifications"),
    ACTION("a4", 1180, 80,  "Notify HR Team"),
    ACTION("a5", 1180, 200, "Notify Legal / Compliance Team"),
    ACTION("a6", 1180, 320, "Notify Operations Team"),
    ACTION("a7", 1400, 200, "Recommend Process Changes"),
    ACTION("a8", 1620, 200, "Flag Implementation Deadlines"),
    ACTION("a9", 1840, 200, "Generate Executive Impact Assessment"),
    ACTION("a10",2060, 200, "Refresh AI Knowledge Base Index"),
    END("e1", 2280, 200, "Change Pipeline Complete"),
  ],
  edges: [
    E("e-t1-a1",   "t1",  "a1"),
    E("e-a1-a2",   "a1",  "a2"),
    E("e-a2-a3",   "a2",  "a3"),
    E("e-a3-p1",   "a3",  "p1"),
    E("e-p1-a4",   "p1",  "a4"),
    E("e-p1-a5",   "p1",  "a5"),
    E("e-p1-a6",   "p1",  "a6"),
    E("e-a4-a7",   "a4",  "a7"),
    E("e-a5-a7",   "a5",  "a7"),
    E("e-a6-a7",   "a6",  "a7"),
    E("e-a7-a8",   "a7",  "a8"),
    E("e-a8-a9",   "a8",  "a9"),
    E("e-a9-a10",  "a9",  "a10"),
    E("e-a10-e1",  "a10", "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 18: IT Onboarding (System Access)
// ─────────────────────────────────────────────────────────────────────────────
const itOnboarding: FlowTemplate = {
  id: "it-onboarding",
  name: "IT System Access Provisioning",
  description: "New employee IT access setup — accounts, devices, VPN and security training",
  category: "IT",
  tags: ["it", "access", "onboarding", "security", "provisioning"],
  steps: 7,
  estimatedMinutes: 480,
  nodes: [
    TRIGGER("t1",  80, 200, "New Employee HR Record Created", "event.employee-created"),
    ACTION("a1",  300, 200, "Create Corporate Email Account"),
    PARALLEL("p1", 520, 200, "Parallel Account Setup"),
    ACTION("a2",  740, 80,  "Create Slack / Teams Account"),
    ACTION("a3",  740, 200, "Setup MFA & Password Manager"),
    ACTION("a4",  740, 320, "Assign Laptop / Device"),
    ACTION("a5",  960, 200, "Configure VPN & System Access by Role"),
    ACTION("a6", 1180, 200, "Send IT Welcome Kit & Credentials"),
    ACTION("a7", 1400, 200, "Schedule Security Awareness Training"),
    END("e1", 1620, 200, "IT Provisioning Complete"),
  ],
  edges: [
    E("e-t1-a1",  "t1",  "a1"),
    E("e-a1-p1",  "a1",  "p1"),
    E("e-p1-a2",  "p1",  "a2"),
    E("e-p1-a3",  "p1",  "a3"),
    E("e-p1-a4",  "p1",  "a4"),
    E("e-a2-a5",  "a2",  "a5"),
    E("e-a3-a5",  "a3",  "a5"),
    E("e-a4-a5",  "a4",  "a5"),
    E("e-a5-a6",  "a5",  "a6"),
    E("e-a6-a7",  "a6",  "a7"),
    E("e-a7-e1",  "a7",  "e1"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry — all 18 templates
// ─────────────────────────────────────────────────────────────────────────────

export const FLOW_TEMPLATES: FlowTemplate[] = [
  leaveApproval,
  employeeOnboarding,
  payrollRun,
  permitRenewal,
  performanceReview,
  terminationClearance,
  recruitmentPipeline,
  isoAudit,
  capaResolution,
  foreignWorkerOnboarding,
  expatriateEP,
  domesticInquiry,
  repatriation,
  contractRenewal,
  claimsApproval,
  trainingHrdc,
  regulatoryChange,
  itOnboarding,
];

/** Look up a template by ID. Returns undefined if not found. */
export function getFlowTemplate(id: string): FlowTemplate | undefined {
  return FLOW_TEMPLATES.find((t) => t.id === id);
}

/** Filter templates by category. */
export function getTemplatesByCategory(category: FlowTemplateCategory): FlowTemplate[] {
  return FLOW_TEMPLATES.filter((t) => t.category === category);
}

/** Filter templates by tag. */
export function searchTemplates(query: string): FlowTemplate[] {
  const q = query.toLowerCase();
  return FLOW_TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q)) ||
      t.category.toLowerCase().includes(q)
  );
}

/** All distinct categories in the registry. */
export const TEMPLATE_CATEGORIES: FlowTemplateCategory[] = [
  ...new Set(FLOW_TEMPLATES.map((t) => t.category)),
] as FlowTemplateCategory[];
