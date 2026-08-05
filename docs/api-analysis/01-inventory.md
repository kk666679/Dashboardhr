# 01 — Full API Inventory

Complete catalogue of every tRPC procedure and REST endpoint in the AIFWMS codebase.

---

## tRPC Procedures

All tRPC calls go to: `POST /api/trpc/[procedureName]`  
Batching: `POST /api/trpc/[p1],[p2],[p3]`

Legend: **Q** = query · **M** = mutation · **pub** = publicProcedure · **prot** = protectedProcedure · **guard** = guardedProcedure · **abac** = abacProcedure(module,action)

### `auth` — Authentication State

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `auth.me` | Q | pub | Returns current user identity (userId, role, tenantId) or null |

---

### `employee` — Employee Management

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `employee.list` | Q | prot | List all employees for tenant, optional filters |
| `employee.byId` | Q | prot | Get single employee by ID |
| `employee.getProfile` | Q | prot | ESS-compatible profile view |
| `employee.updateProfile` | M | prot | Update employee profile fields |
| `employee.create` | M | prot | Create new employee record |
| `employee.update` | M | prot | Partial update of employee |
| `employee.delete` | M | prot | Soft/hard delete employee |

---

### `payroll` — Payroll Processing

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `payroll.list` | Q | prot | List payroll records, optional status filter |
| `payroll.byEmployee` | Q | prot | Get payroll history for an employee (max 24 months) |
| `payroll.create` | M | prot | Create new payroll record |
| `payroll.process` | M | prot | Process a pending payroll |
| `payroll.payslip` | Q | prot | Generate payslip for a payroll record |

---

### `leave` — Leave Management

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `leave.listPolicies` | Q | guard | List leave policies, optional type filter |
| `leave.upsertPolicy` | M | guard | Create or update leave policy |
| `leave.balance` | Q | guard | Get all leave balances for an employee/year |
| `leave.getBalance` | Q | guard | Get or create a specific leave type balance |
| `leave.list` | Q | guard | List leave applications with filters |
| `leave.listRequests` | Q | guard | List requests for a specific employee |
| `leave.request` | M | guard | Submit a leave application |
| `leave.approve` | M | guard | Approve a pending leave application |
| `leave.reject` | M | guard | Reject a pending leave application |
| `leave.cancel` | M | guard | Cancel a pending or approved application |
| `leave.getCalendar` | Q | guard | Calendar view of approved/pending leaves |
| `leave.checkStatutoryFloor` | Q | guard | Check if entitlement meets statutory minimum |

---

### `attendance` — Attendance & Overtime

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `attendance.clockIn` | M | guard | Clock in with optional GPS coordinates |
| `attendance.clockOut` | M | guard | Clock out, calculates hours worked & overtime |
| `attendance.getDailySummary` | Q | guard | Daily attendance summary for whole tenant |
| `attendance.list` | Q | guard | List attendance records with filters |
| `attendance.getOvertimeReport` | Q | guard | Overtime report by employee and date range |
| `attendance.getExceptions` | Q | guard | Exception flags (LATE, ABSENT, HALF_DAY) |
| `attendance.manualEntry` | M | guard | HR override: manual attendance entry |

---

### `compliance` — Compliance Management

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `compliance.check` | Q | prot | Check compliance status for an employee |
| `compliance.policy.getAll` | Q | prot | List all compliance policies |
| `compliance.policy.getById` | Q | prot | Get single policy |
| `compliance.policy.save` | M | prot | Create or update compliance policy |
| `compliance.regulation.getAll` | Q | prot | List all regulations |
| `compliance.regulation.getById` | Q | prot | Get single regulation |
| `compliance.regulation.save` | M | prot | Create or update regulation |
| `compliance.checklist.getAll` | Q | prot | List all compliance checklists |
| `compliance.checklist.getById` | Q | prot | Get single checklist |
| `compliance.checklist.save` | M | prot | Create or update checklist with items |

---

### `onboarding` — Employee Onboarding

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `onboarding.getChecklistByEmployee` | Q | guard | Get or auto-create onboarding checklist |
| `onboarding.completeTask` | M | guard | Mark a task complete |
| `onboarding.createChecklist` | M | guard | Manually create a checklist |
| `onboarding.listChecklists` | Q | guard | List all checklists with completion % |
| `onboarding.listOverdue` | Q | guard | List overdue in-progress checklists |

---

### `termination` — Termination Management

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `termination.getTerminations` | Q | prot | List all terminations with filters |
| `termination.getById` | Q | prot | Get single termination with employee |
| `termination.createTermination` | M | prot | Create termination record |

---

### Offboarding Group

| Router | Procedure | Type | Auth | Description |
|--------|-----------|------|------|-------------|
| `clearance` | `getByTermination` | Q | guard | Get clearance instance |
| `clearance` | `getTasks` | Q | guard | Get clearance tasks |
| `clearance` | `updateTask` | M | guard | Update task status |
| `assetReturn` | `getByTermination` | Q | guard | Get asset return record |
| `assetReturn` | `save` | M | guard | Create/update asset return |
| `exitInterview` | `getByTermination` | Q | guard | Get exit interview |
| `exitInterview` | `create` | M | guard | Create exit interview |
| `exitInterview` | `update` | M | guard | Update exit interview |
| `knowledgeTransfer` | `getByTermination` | Q | guard | Get knowledge transfer plan |
| `knowledgeTransfer` | `save` | M | guard | Create/update knowledge transfer |
| `settlement` | `getByTermination` | Q | guard | Get final settlement |
| `settlement` | `save` | M | guard | Create/update settlement with line items |
| `revocation` | `getByTermination` | Q | guard | List access revocations |
| `revocation` | `create` | M | guard | Create revocation record |
| `revocation` | `markRevoked` | M | guard | Mark system access as revoked |

---

### `recruitment` — Recruitment Pipeline

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `recruitment.pipeline` | Q | prot | Get candidate pipeline (stub — returns []) |
| `recruitment.jdCreate` | M | prot | Create job description |

---

### `performance` — Performance Reviews

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `performance.getCycles` | Q | pub | Get review cycles (stub — returns []) |
| `performance.getEmployees` | Q | pub | List employees for review |
| `performance.getApprovers` | Q | pub | List HR/Admin users as approvers |
| `performance.createReview` | M | prot | Create performance review (mock save) |
| `performance.getReviews` | Q | prot | List reviews (stub — returns []) |

---

### `benefits` — Benefits Administration

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `benefits.listPlans` | Q | guard | List benefit plans |
| `benefits.getPlan` | Q | guard | Get single plan with enrolments |
| `benefits.createPlan` | M | guard | Create benefit plan |
| `benefits.updatePlan` | M | guard | Update plan details |
| `benefits.enrol` | M | guard | Enrol employee in plan |
| `benefits.waive` | M | guard | Waive employee enrolment |
| `benefits.listEnrolments` | Q | guard | List enrolments with filters |

---

### `succession` — Succession Planning

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `succession.listPlans` | Q | guard | List succession plans |
| `succession.getPlan` | Q | guard | Get plan by positionId |
| `succession.upsertPlan` | M | guard | Create or update succession plan |
| `succession.addCandidate` | M | guard | Add candidate with 9-Box coords |
| `succession.removeCandidate` | M | guard | Remove candidate |
| `succession.getNineBoxGrid` | Q | guard | Get full 9-Box grid |

---

### `workflowEngine` — Approval Workflow Engine

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `workflowEngine.saveDefinition` | M | guard | Save workflow definition with graph validation |
| `workflowEngine.activateDefinition` | M | guard | Activate a workflow version |
| `workflowEngine.listDefinitions` | Q | guard | List workflow definitions |
| `workflowEngine.getDefinition` | Q | guard | Get definition with recent instances |
| `workflowEngine.triggerWorkflow` | M | guard | Start a workflow instance |
| `workflowEngine.getActiveWorkflows` | Q | guard | Get active workflows (optional: by assignee) |
| `workflowEngine.submitDecision` | M | guard | Approve or reject a workflow step |
| `workflowEngine.getMonitoringDashboard` | Q | guard | Workflow health metrics |
| `workflowEngine.getInstance` | Q | guard | Get workflow instance with steps |
| `workflowEngine.listInstances` | Q | guard | List instances with filters |

---

### `security` — Security Administration

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `security.listUsers` | Q | abac(config,read) | List users with role filter |
| `security.getUser` | Q | abac(config,read) | Get single user |
| `security.updateRole` | M | abac(config,write) | Update user role + invalidate sessions |
| `security.revokeAllSessions` | M | abac(config,write) | Force logout all sessions for user |
| `security.revokeMyOtherSessions` | M | guard | Self-service logout all other devices |
| `security.getDashboard` | Q | abac(config,read) | Security dashboard metrics |
| `security.changePassword` | M | guard | Change own password |

---

### `auditTrail` — Audit Log

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `auditTrail.list` | Q | abac(compliance,read) | Paginated audit trail with filters |
| `auditTrail.getByEntity` | Q | abac(compliance,read) | All events for a specific entity |
| `auditTrail.getSummary` | Q | abac(analytics,read) | Aggregate stats by action type |

---

### `analytics` — Workforce Analytics

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `analytics.getHeadcountSummary` | Q | prot | Total active employee count |
| `analytics.getTurnoverRate` | Q | prot | Turnover rate over N months |
| `analytics.getDepartmentBreakdown` | Q | prot | Employee distribution by department |

---

### `visa` / `permits` — Visa & Work Permits (aliased)

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `visa.expiring` | Q | prot | Visas expiring within N days |
| `visa.byEmployee` | Q | prot | All visas for an employee |
| `visa.create` | M | prot | Create visa record |
| `visa.renew` | M | prot | Renew visa with new expiry |

---

### `foreignWorker` — Foreign Worker Profiles

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `foreignWorker.getAll` | Q | guard | List all FW profiles |
| `foreignWorker.getById` | Q | guard | Get single FW profile |
| `foreignWorker.save` | M | guard | Create or update FW profile |
| `foreignWorker.delete` | M | guard | Delete FW profile |

---

### `organisation` — Org Hierarchy

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `organisation.list` | Q | prot | List active org nodes |
| `organisation.createNode` | M | prot | Create org node (group/entity/dept/branch) |
| `organisation.deactivateNode` | M | prot | Deactivate an org node |
| `organisation.getHierarchy` | Q | prot | Full hierarchy with children |

---

### `accounting` — Accounting & Finance

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `accounting.payrollRecords` | Q | prot | Payroll records by status |
| `accounting.payrollByEmployee` | Q | prot | Payroll records for one employee |
| `accounting.calculatePayroll` | M | prot | Calculate and create payroll entry |
| `accounting.listCreditNotes` | Q | prot | List credit notes |
| `accounting.createCreditNote` | M | prot | Create credit note |
| `accounting.listDebitNotes` | Q | prot | List debit notes |
| `accounting.createDebitNote` | M | prot | Create debit note |
| `accounting.listDeliveryOrders` | Q | prot | List delivery orders |
| `accounting.createDeliveryOrder` | M | prot | Create delivery order |
| `accounting.getDeliveryOrder` | Q | prot | Get single delivery order |
| `accounting.listInvoices` | Q | prot | List invoices |
| `accounting.createInvoice` | M | prot | Create invoice |
| `accounting.accountingSummary` | Q | prot | Summary stats |
| `accounting.calculateTax` | M | prot | Calculate PCB or SST tax |

---

### `automation` — Workflow Automation

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `automation.getAll` | Q | **pub** ⚠️ | List automations with optional filters |
| `automation.getById` | Q | **pub** ⚠️ | Get single automation |
| `automation.create` | M | **pub** ⚠️ | Create automation |
| `automation.update` | M | **pub** ⚠️ | Update automation |
| `automation.delete` | M | **pub** ⚠️ | Delete automation |
| `automation.run` | M | **pub** ⚠️ | Manually execute automation |
| `automation.toggleStatus` | M | **pub** ⚠️ | Change automation status |

> ⚠️ All `automation` procedures use `publicProcedure` — no authentication required.

---

### `dashboard` — Dashboard

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `dashboard.getData` | Q | prot | Tenant dashboard data |

---

### `ai` — AI Features

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `ai.getWorkforceForecast` | Q | prot | 12-month workforce projection |

---

### `search` · `document` · `iso` · `sop` · `lms` · `assets` · `payrollHcm` · `statutory` · `zakat` · `lifecycle` · `notificationCenter` · `notifications` · `ess` · `mss` · `travel` · `healthSafety` · `dataGovernance` · `workforcePlanning` · `integrations` · `shifts` · `positions` · `qms` · `scheduling` group · `er` · `fomema` · `industrialRelations` · compensation group · succession planning group · `learning` · `handbook` · `company` · `accommodation` · `medical` · `admin` · `geolocation` (tRPC) · `opex` · `capex` · `featureFlags` · `ms`

> These routers exist in the root but their individual procedures are defined in their respective files. See `03-trpc.md` for details on each.

---

## REST Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/[...nextauth]/login` | None | Local credential login |
| GET | `/api/auth/[...nextauth]/session` | Cookie | Get current session |
| GET | `/api/auth/[...nextauth]/signin/[provider]` | None | OIDC redirect |
| POST | `/api/auth/[...nextauth]/callback/[provider]` | None | OIDC callback |
| POST | `/api/auth/[...nextauth]/logout` | Cookie | Logout |
| POST | `/api/auth/mfa` | None (tempToken) | Verify MFA code |
| PUT | `/api/auth/mfa` | Cookie | Setup TOTP (generate secret) |
| POST | `/api/ai/chat` | None ⚠️ | Streaming AI chat |
| GET | `/api/ai/chat/history` | ? | Chat history |
| POST | `/api/ai/documents` | ? | AI document analysis |
| POST | `/api/ai/rag` | ? | RAG query |
| POST | `/api/ai/reason` | ? | AI reasoning |
| POST | `/api/documents/upload` | Header (X-Tenant-ID, X-Employee-ID) | Upload employee document |
| GET | `/api/documents/upload` | Header | List employee documents |
| GET | `/api/documents/[id]/download` | ? | Download document |
| POST | `/api/embeddings/ingest` | None ⚠️ | Ingest document text |
| POST | `/api/blob` | Cookie | Upload to Vercel Blob |
| GET | `/api/blob` | Cookie | Download from Vercel Blob |
| GET | `/api/geolocation` | None ⚠️ | Worker locations + geofences |
| POST | `/api/geolocation` | None ⚠️ | Update worker location |
| GET | `/api/geolocation/attendance/[workerId]` | ? | Worker attendance via GPS |
| POST | `/api/geolocation/location` | ? | Submit location event |
| GET | `/api/health` | None | Readiness probe (DB ping) |
| GET | `/api/health/live` | None | Liveness probe |
| POST | `/api/webhooks/biometric` | HMAC sig | Biometric clock event |
| POST | `/api/webhooks/background-check` | ? | Background check result |
| GET | `/api/siem` | API Key | SIEM audit event stream |
| GET | `/api/sops` | None ⚠️ | SOP search |
| POST | `/api/sops/create` | ? | Create SOP |
| GET/POST | `/api/sops/[id]` | ? | Get/update SOP |
| GET | `/api/sops/search` | ? | Full-text SOP search |
| POST | `/api/sops/export` | ? | Export SOP |
| POST | `/api/regulatory/changes` | None ⚠️ | Trigger regulatory change pipeline |
| GET | `/api/regulatory/changes` | None ⚠️ | List regulatory changes |
| GET | `/api/regulatory/monitor` | ? | Monitor regulatory updates |
| POST | `/api/kb/ingest` | ? | Ingest knowledge base document |
| POST | `/api/kb/search` | ? | Search knowledge base |
| GET/POST | `/api/knowledge-base` | ? | Knowledge base CRUD |
| GET | `/api/knowledge-base/[standard]` | ? | Get standard content |
| GET | `/api/openapi` | None | OpenAPI spec (auto-generated) |
| GET | `/api/reports/lhdn-audit-template` | ? | LHDN audit report |
| POST | `/api/hr-orchestrator` | ? | HR AI orchestrator |
| POST | `/api/hr-integration/sync` | ? | HR data sync |
| POST | `/api/hr-integration/payroll/sync-attendance` | ? | Sync attendance to payroll |
| POST | `/api/integrations/gl-export` | ? | GL accounting export |
| POST | `/api/automation/workflows` | ? | Automation workflow trigger |
| POST | `/api/avatar/upload` | ? | Upload avatar |
| GET | `/api/iso/audit/checklist` | ? | ISO audit checklist |
| GET/POST | `/api/iso/audit/plan` | ? | ISO audit plan |
| POST | `/api/iso/capa/5whys` | ? | 5 Whys CAPA analysis |
| GET | `/api/iso/compliance/gap` | ? | ISO compliance gap |
| GET | `/api/iso/compliance/score` | ? | ISO compliance score |
| GET | `/api/iso/risk/climate` | ? | Climate risk |
| GET/POST | `/api/iso/risk/matrix` | ? | Risk matrix |
| POST | `/api/accounting-enhanced/einvoice` | ? | E-invoice generation |
| GET | `/api/svgs` | None | SVG asset serving |
| GET | `/api/types/schemas` | None | Zod schema export |
| POST | `/api/window-exe` | ? | Windows executable download |
