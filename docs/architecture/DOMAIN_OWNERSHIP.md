# Domain Ownership Matrix — AHROS

## Purpose

Every file in the codebase has exactly one domain owner. This matrix maps all files to their owning domain for the restructuring.

---

## Ownership Assignment Rules

1. **Business components** → belong to their Business Domain
2. **Generic primitives** → belong to the Design System (`components/ui/`)
3. **AI capabilities** → belong to the AI Platform (`ai/`)
4. **Infrastructure** → belongs to the Platform layer (`domains/platform/`)
5. **Cross-cutting** → belongs to Shared Platform (automation, compliance, knowledge)

---

## Component Ownership

### `components/ui/` — Design System (OWNER: Platform)

| File | Owner | Notes |
|------|-------|-------|
| `accordion.tsx` | Platform/Design | shadcn primitives |
| `alert-dialog.tsx` | Platform/Design | |
| `alert.tsx` | Platform/Design | |
| `avatar.tsx` | Platform/Design | |
| `badge.tsx` | Platform/Design | |
| `breadcrumb.tsx` | Platform/Design | |
| `button.tsx` | Platform/Design | |
| `calendar.tsx` | Platform/Design | |
| `card.tsx` | Platform/Design | |
| `checkbox.tsx` | Platform/Design | |
| `command.tsx` | Platform/Design | |
| `dialog.tsx` | Platform/Design | |
| `dropdown-menu.tsx` | Platform/Design | |
| `form.tsx` | Platform/Design | |
| `input.tsx` | Platform/Design | |
| `label.tsx` | Platform/Design | |
| `popover.tsx` | Platform/Design | |
| `select.tsx` | Platform/Design | |
| `separator.tsx` | Platform/Design | |
| `sheet.tsx` | Platform/Design | |
| `sidebar.tsx` | Platform/Design | shadcn sidebar |
| `skeleton.tsx` | Platform/Design | |
| `switch.tsx` | Platform/Design | |
| `table.tsx` | Platform/Design | |
| `tabs.tsx` | Platform/Design | |
| `toast.tsx` | Platform/Design | |
| `tooltip.tsx` | Platform/Design | |
| `Logo.tsx` | Platform/Design | |

### `components/ai-elements/` — AI Platform (OWNER: AI Platform)

| File | Owner | Notes |
|------|-------|-------|
| `agent.tsx` | AI Platform | Agent card component |
| `artifact.tsx` | AI Platform | Artifact display |
| `attachments.tsx` | AI Platform | |
| `canvas.tsx` | AI Platform | |
| `chain-of-thought.tsx` | AI Platform | |
| `checkpoint.tsx` | AI Platform | |
| `code-block.tsx` | AI Platform | |
| `confirmation.tsx` | AI Platform | |
| `connection.tsx` | AI Platform | |
| `context.tsx` | AI Platform | |
| `conversation.tsx` | AI Platform | |
| `message.tsx` | AI Platform | |
| `model-selector.tsx` | AI Platform | |
| `plan.tsx` | AI Platform | |
| `reasoning.tsx` | AI Platform | |
| `sources.tsx` | AI Platform | |
| `timeline.tsx` | AI Platform | |
| `tool.tsx` | AI Platform | |
| `toolbar.tsx` | AI Platform | |

### `components/ahros/` — AI Workspace (OWNER: AI Platform)

| File | Owner | Notes |
|------|-------|-------|
| `workspace/ahros-workspace.tsx` | AI Platform | Main workspace layout |
| `workspace/ahros-panel.tsx` | AI Platform | Resizable panel wrapper |
| `workspace/ahros-dock.tsx` | AI Platform | Floating artifact dock |
| `panels/conversation-panel.tsx` | AI Platform | |
| `panels/planning-panel.tsx` | AI Platform | |
| `panels/workflow-panel.tsx` | AI Platform | |
| `panels/reasoning-panel.tsx` | AI Platform | |
| `panels/timeline-panel.tsx` | AI Platform | |
| `panels/compliance-panel.tsx` | AI Platform | |
| `panels/knowledge-panel.tsx` | AI Platform | |
| `panels/sandbox-panel.tsx` | AI Platform | |
| `panels/memory-panel.tsx` | AI Platform | |

### `components/platform/` — Platform (OWNER: Platform)

| File | Owner | Notes |
|------|-------|-------|
| `Breadcrumb.tsx` | Platform | |
| `Header.tsx` | Platform | |
| `MegaMenu.tsx` | Platform | |
| `MobileMenu.tsx` | Platform | |
| `ProductLayout.tsx` | Platform | |
| `ProductSidebar.tsx` | Platform | |
| `ProductSwitcher.tsx` | Platform | |
| `Search.tsx` | Platform | |
| `UserMenu.tsx` | Platform | |

### `components/layout/` — Platform (OWNER: Platform)

| File | Owner | Notes |
|------|-------|-------|
| `DashboardShell.tsx` | Platform | |
| `GlassModal.tsx` | Platform | |
| `GlassNavbar.tsx` | Platform | |
| `page-shell.tsx` | Platform | |
| `providers.tsx` | Platform | |

### `components/dashboard-sidebar/` — Platform → People Domain (OWNER: People)

| File | Owner | Notes |
|------|-------|-------|
| `app-sidebar.tsx` | People | HR admin sidebar |
| `header.tsx` | People | |
| `navbar.tsx` | People | |
| `sidebar-data.ts` | People | |
| `sidebar-footer.tsx` | People | |
| `route-mapping.ts` | People | |

### `components/features/` — Business Domains (See below)

| Directory | Owner | Notes |
|-----------|-------|-------|
| `accounting/` | Finance | |
| `admin/` | Platform | |
| `ai/` | AI Platform | |
| `automation/` | Automation Platform | |
| `company/` | People | |
| `compensation/` | Payroll | |
| `compliance/` | Compliance | |
| `dashboard/` | Executive Dashboard | |
| `documents/` | Documents | |
| `employee/` | People | |
| `employee-relations/` | People | |
| `ess/` | People | ESS |
| `expatriates/` | Foreign Workers | |
| `fomema/` | Foreign Workers | |
| `foreign-worker/` | Foreign Workers | |
| `geolocation/` | Foreign Workers | |
| `handbook/` | Knowledge Platform | |
| `industrial-relations/` | People | |
| `integrations/` | Platform | |
| `iso/` | Compliance | |
| `learning-development/` | Learning | |
| `mss/` | People | MSS |
| `notifications/` | Platform | |
| `offboarding/` | Offboarding | |
| `pdf/` | Documents | |
| `performance/` | Performance | |
| `permits/` | Foreign Workers | |
| `scheduling/` | Attendance | |
| `sop/` | Knowledge Platform | |
| `succession/` | Performance | |
| `tabung-haji/` | Compliance | |
| `talent-acquisition/` | Recruitment | |
| `termination/` | Offboarding | |
| `zakat/` | Compliance | |

---

## Hook Ownership

| Hook | Owner | Notes |
|------|-------|-------|
| `useAdmin.ts` | Platform | |
| `useAI.ts` | AI Platform | |
| `useAiChat.ts` | AI Platform | |
| `useAnalytics.ts` | Executive Dashboard | |
| `useAuth.ts` | Platform/Auth | |
| `useAutomation.ts` | Automation Platform | |
| `useCanvas.ts` | AI Platform | |
| `useCompany.ts` | People | |
| `useCompensation.ts` | Payroll | |
| `useCompliance.ts` | Compliance | |
| `useDashboard.ts` | Executive Dashboard | |
| `useDocument.ts` | Documents | |
| `useEmployee.ts` | People | |
| `useExpat.ts` | Foreign Workers | |
| `useExpatriates.ts` | Foreign Workers | |
| `useFlow.ts` | Automation Platform | |
| `useFlowOperation.ts` | Automation Platform | |
| `useForeignWorker.ts` | Foreign Workers | |
| `useGeolocation.ts` | Foreign Workers | |
| `useHrOrchestrator.ts` | AI Platform | |
| `useIntegration.ts` | Platform | |
| `useKbChat.ts` | AI Platform | |
| `useLeave.ts` | Leave | |
| `useNotification.ts` | Platform | |
| `useOffboarding.ts` | Offboarding | |
| `usePayroll.ts` | Payroll | |
| `useRag.ts` | AI Platform | |
| `useRecruitment.ts` | Recruitment | |
| `useScheduling.ts` | Attendance | |
| `useSemanticSearch.ts` | AI Platform | |
| `useSession.ts` | Platform/Auth | |
| `useSettings.ts` | Platform | |
| `useSuccession.ts` | Performance | |
| `useTermination.ts` | Offboarding | |
| `useTheme.ts` | Platform/Design | |
| `useTranslation.ts` | Platform/i18n | |
| `useWorkflow.ts` | Automation Platform | |
| `useWorkflowEngine.ts` | Automation Platform | |
| `useZakat.ts` | Compliance | |

---

## Library Ownership

### `lib/ahros/` — AI Platform Core (OWNER: AI Platform)

| File | Description |
|------|-------------|
| `types.ts` | Core AHROS type definitions |
| `event-bus.ts` | Typed event-driven orchestration |
| `artifact-registry.ts` | Artifact lifecycle management |
| `orchestrator.ts` | Central AI orchestration engine |
| `execution-engine.ts` | Self-healing execution engine |
| `compliance-reporter.ts` | Compliance validation engine |
| `learning-engine.ts` | Continuous learning engine |
| `optimistic-bus.ts` | Optimistic update support |
| `wiring/` | React hooks for AHROS core |

### `lib/ai/` — AI Infrastructure (OWNER: AI Platform)

| File | Description |
|------|-------------|
| `agents/` | Domain-specific AI agents |
| `agents/attritionRiskAgent.ts` | |
| `agents/interviewSummaryAgent.ts` | |
| `agents/ocrReceiptAgent.ts` | |
| `agents/payrollExplainerAgent.ts` | |
| `agents/resumeScreeningAgent.ts` | |
| `agents/skillsGapAgent.ts` | |
| `agents/workforceForecastAgent.ts` | |

### Other Library Files

| File | Owner | Notes |
|------|-------|-------|
| `lib/automation.ts` | Automation Platform | |
| `lib/chat-sessions.ts` | AI Platform | |
| `lib/chunker.ts` | AI Platform | |
| `lib/compliance-engine.ts` | Compliance | |
| `lib/embeddings.ts` | AI Platform | |
| `lib/geolocation-utils.ts` | Foreign Workers | |
| `lib/kb-loader.ts` | Knowledge Platform | |
| `lib/notification-dispatch.ts` | Platform | |
| `lib/onboarding-service.ts` | Onboarding | |
| `lib/payroll-service.ts` | Payroll | |
| `lib/rag.ts` | AI Platform | |
| `lib/sop/` | Knowledge Platform | |
| `lib/termination-service.ts` | Offboarding | |
| `lib/workflow-engine.ts` | Automation Platform | |
| `lib/orchestrator/` | AI Platform | |
| `lib/security/` | Platform/Auth | |
| `lib/queues/` | Platform | |
| `lib/server/` | Platform | |
| `lib/session/` | Platform/Auth | |

---

## Zustand Store Ownership

| Store | Owner | Notes |
|-------|-------|-------|
| `lib/zustand/ahros-store.ts` | AI Platform | Workspace state |
| `lib/zustand/artifact-store.ts` | AI Platform | Artifact state |
| `lib/zustand/memory-store.ts` | AI Platform | Learning/memory |
| `lib/zustand/offline-sync.ts` | Platform | |
| `lib/zustand/ui-store.ts` | Platform | UI client state |
| `lib/zustand/workflow-store.ts` | Automation Platform | |
