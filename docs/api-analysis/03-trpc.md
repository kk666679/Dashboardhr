# 03 — tRPC Router Analysis

Deep dive into the tRPC layer: architecture, procedure tiers, per-router breakdown, and input schema patterns.

---

## Architecture Overview

```
Client
  │
  ├─ @trpc/react-query  →  POST /api/trpc/[procedure]
  │
Server: app/api/trpc/[trpc]/route.ts
  └─ createContext() → appRouter (server/root.ts)
        └─ 70+ routers merged into AppRouter
```

### Procedure Tiers

```
publicProcedure
  └─ protectedProcedure     (requires ctx.userId)
        └─ guardedProcedure  (requires ctx.userId + ctx.tenantId + applies RLS)
              └─ abacProcedure(module, action)  (ABAC policy evaluation)
```

| Tier | When to use | What it does |
|------|-------------|-------------|
| `publicProcedure` | Unauthenticated reads | No checks |
| `protectedProcedure` | Any authenticated operation | Checks `ctx.userId` |
| `guardedProcedure` | Tenant-scoped operations | Checks userId + tenantId + applies PostgreSQL RLS |
| `abacProcedure(m,a)` | Role-controlled operations | Full ABAC policy evaluation via `evaluatePolicy()` |

### Context Shape

```typescript
interface Context {
  tenantId: string;         // from Redis session
  userId: string;           // from Redis session
  userRole: string;         // "ADMIN" | "HR" | "EMPLOYEE" | custom roles
  session?: {
    employeeId?: string;
    legalEntityId?: string;
    departments?: string[];
    legalEntities?: string[];
    mfaVerified?: boolean;
  };
}
```

### Transformer

SuperJSON is used as the transformer, enabling:
- `Date` objects serialized without manual `.toISOString()`
- `Decimal` (decimal.js) preserved through the wire
- `undefined` vs `null` distinction

### Error Shape

```typescript
{
  message: string;
  code: TRPCErrorCode;
  data: {
    zodError: ZodError | null;   // populated on BAD_REQUEST from Zod
    httpStatus: number;
    path: string;
    stack?: string;              // dev only
  }
}
```

---

## Row-Level Security

`guardedProcedure` calls `applyRlsContext()` before every procedure body runs:

```sql
SET LOCAL app.tenant_id = '<tenantId>';
SET LOCAL app.user_id   = '<userId>';
SET LOCAL app.user_role = '<userRole>';
```

In production, failing to apply RLS throws `INTERNAL_SERVER_ERROR`. In development it logs a warning and continues.

---

## ABAC Policy Logic

`abacProcedure("module", "action")` evaluates:

1. Tenant isolation — hard reject on mismatch
2. `Super_Admin` / `ADMIN` bypass
3. Role → scope lookup in `ROLE_PERMISSIONS` map
4. Scope evaluation: `FULL` | `READ` | `APPROVE` | `MASKED` | `DEPT` | `TEAM` | `SELF` | `NONE`
5. Attribute-based narrowing for DEPT/TEAM/SELF scopes

---

## Router Catalogue

### Core HR Domain

#### `auth` — `/server/routers/auth.ts`
Simple identity endpoint. Intentionally minimal — no sensitive data.

```typescript
auth.me // query, publicProcedure
// Returns: { userId, role, tenantId } | null
```

---

#### `employee` — `/server/routers/employee.ts`

```typescript
// Input schemas
EmployeeFiltersSchema   // optional filters for list
CreateEmployeeSchema    // required for create

employee.list           // query,    protectedProcedure, input: EmployeeFiltersSchema?
employee.byId           // query,    protectedProcedure, input: { id: string }
employee.getProfile     // query,    protectedProcedure, input: { id: string }
employee.updateProfile  // mutation, protectedProcedure, input: { id, data: Record<string, any> }
employee.create         // mutation, protectedProcedure, input: CreateEmployeeSchema
employee.update         // mutation, protectedProcedure, input: { id, data: CreateEmployeeSchema.partial() }
employee.delete         // mutation, protectedProcedure, input: { id: string }
```

---

#### `payroll` — `/server/routers/payroll.ts`

```typescript
payroll.list        // query,    prot, input: { status?: "PENDING"|"PROCESSED"|"PAID" }?
payroll.byEmployee  // query,    prot, input: { employeeId: string, limit: 1-24 }
payroll.create      // mutation, prot, input: {
                    //   employeeId, periodStart, periodEnd,
                    //   basicSalary: positive, allowances?: ≥0, deductions?: ≥0
                    // }
payroll.process     // mutation, prot, input: { id: string }
payroll.payslip     // query,    prot, input: { id: string }
```

---

#### `leave` — `/server/routers/leave.ts`

The most complete router — full lifecycle with balance conservation (Property 2).

```typescript
// Leave types: ANNUAL|MEDICAL|HOSPITALIZATION|EMERGENCY|COMPASSIONATE|
//              MARRIAGE|MATERNITY|PATERNITY|UNPAID|REPLACEMENT|CUSTOM|SICK|PERSONAL
// Leave statuses: PENDING|APPROVED|REJECTED|CANCELLED

leave.listPolicies          // query,    guard, input: { leaveType? }?
leave.upsertPolicy          // mutation, guard, input: { leaveType, annualEntitlement, carryForwardMax, ... }
leave.balance               // query,    guard, input: { employeeId, year? }
leave.getBalance            // query,    guard, input: { employeeId, leaveType, year? }
leave.list                  // query,    guard, input: { employeeId?, status?, leaveType?, from?, to?, take?, skip? }?
leave.listRequests          // query,    guard, input: { employeeId, status? }
leave.request               // mutation, guard, input: { employeeId, leaveType, startDate, endDate, reason? }
leave.approve               // mutation, guard, input: { leaveId, comment? }
leave.reject                // mutation, guard, input: { leaveId, reason }
leave.cancel                // mutation, guard, input: { leaveId }
leave.getCalendar           // query,    guard, input: { from, to, employeeId? }
leave.checkStatutoryFloor   // query,    guard, input: { leaveType, proposedEntitlement: number }
```

Key invariant: `request` checks available balance = entitlement + carryForward − used − pending before inserting.

---

#### `attendance` — `/server/routers/attendance.ts`

Property 10: Overtime = max(0, hoursWorked − standardHours). Never negative.

```typescript
attendance.clockIn           // mutation, guard, input: { employeeId, latitude?, longitude?, method? }
attendance.clockOut          // mutation, guard, input: { employeeId, latitude?, longitude? }
attendance.getDailySummary   // query,    guard, input: { date }
attendance.list              // query,    guard, input: { employeeId?, from?, to?, status?, take?, skip? }?
attendance.getOvertimeReport // query,    guard, input: { employeeId?, from, to }
attendance.getExceptions     // query,    guard, input: { from, to, type: "LATE"|"ABSENT"|"HALF_DAY"|"ALL" }
attendance.manualEntry       // mutation, guard, input: { employeeId, date, checkIn?, checkOut?, status?, hoursWorked? }
```

Clock-in prevents double clock-in on the same day (checks for existing open record).  
Clock-in performs geofence check (Haversine distance), but violations are non-blocking (dispatches notification).

---

#### `compliance` — `/server/routers/compliance.ts`

Uses raw SQL for three sub-tables not yet in Prisma schema.

```typescript
compliance.check                  // query,    prot, input: { employeeId }
compliance.policy.getAll          // query,    prot
compliance.policy.getById         // query,    prot, input: { id }
compliance.policy.save            // mutation, prot, input: PolicySaveSchema
// PolicySaveSchema: { id?, name, category, version, description?, owner, effectiveDate, status }

compliance.regulation.getAll      // query,    prot
compliance.regulation.getById     // query,    prot, input: { id }
compliance.regulation.save        // mutation, prot, input: RegulationSaveSchema

compliance.checklist.getAll       // query,    prot
compliance.checklist.getById      // query,    prot, input: { id }
compliance.checklist.save         // mutation, prot, input: ChecklistSaveSchema
// ChecklistSaveSchema: { id?, name, description?, regulationId?, items: ChecklistItemSchema[] }
```

**Concern:** All SQL uses `$queryRawUnsafe` — parameterized correctly but fragile if queries evolve.

---

#### `recruitment` — `/server/routers/recruitment.ts`

⚠️ Stub implementation — no persistence.

```typescript
recruitment.pipeline   // query,    prot — always returns []
recruitment.jdCreate   // mutation, prot, input: { title, description? } — returns ephemeral ID
```

---

#### `performance` — `/server/routers/performance.ts`

⚠️ Partially stub — review creation uses `console.log`, not DB.

```typescript
performance.getCycles     // query, publicProcedure — always returns []
performance.getEmployees  // query, publicProcedure — reads from DB
performance.getApprovers  // query, publicProcedure — reads from DB
performance.createReview  // mutation, prot — logs to console, returns fake ID
performance.getReviews    // query,    prot — always returns []
```

---

#### `analytics` — `/server/routers/analytics.ts`

```typescript
analytics.getHeadcountSummary    // query, prot — COUNT employees
analytics.getTurnoverRate        // query, prot, input: { months?: 1-120 }? — placeholder, always 0%
analytics.getDepartmentBreakdown // query, prot — groupBy department
```

---

### Offboarding Routers (6 separate exports from `offboarding.ts`)

```typescript
clearance.getByTermination  // query,    guard, input: { terminationId }
clearance.getTasks          // query,    guard, input: { terminationId }
clearance.updateTask        // mutation, guard, input: { taskId, status, notes? }

assetReturn.getByTermination // query,   guard, input: { terminationId }
assetReturn.save             // mutation, guard, input: { terminationId, expectedReturnDate, items[] }

exitInterview.getByTermination // query,   guard, input: { terminationId }
exitInterview.create           // mutation, guard, input: { terminationId, interviewDate, interviewerId, exitReason, reasonTags?, ratings?, notes? }
exitInterview.update           // mutation, guard, input: { id, terminationId, ...partial }

knowledgeTransfer.getByTermination // query,   guard, input: { terminationId }
knowledgeTransfer.save             // mutation, guard, input: { terminationId, plan?, summary?, owners[], attachments[], documentLinks[] }

settlement.getByTermination // query,    guard, input: { terminationId }
settlement.save             // mutation, guard, input: { terminationId, finalSalary, pendingLeave, additionalPayments, totalAmount, status, notes?, lineItems[] }

revocation.getByTermination // query,    guard, input: { terminationId }
revocation.create           // mutation, guard, input: { terminationId, system, accessType, revokedAt?, revokedById?, notes? }
revocation.markRevoked      // mutation, guard, input: { id }
```

---

### Scheduling Group (3 exports from `scheduling.ts`)

```typescript
shiftPattern.* // shift pattern definitions
rotation.*     // rotation schedule management
swap.*         // shift swap requests
```

---

### Compensation Plans Group (7 exports from `compensationPlans.ts`)

```typescript
bonusPlan.*, compensationCycle.*, equityDefinition.*,
equityGrant.*, incentivePlan.*, merit.*, variablePay.*
```

---

### Succession Planning Group (5 exports from `successionPlanning.ts`)

```typescript
criticalPosition.*, devPlan.*, nineBox.*, readiness.*, successor.*
```

---

### `workflowEngine` — `/server/routers/workflowEngine.ts`

The most sophisticated router. Graph-validated DAG workflows backed by BullMQ.

```typescript
workflowEngine.saveDefinition       // mutation, guard
// GraphJsonSchema: { nodes: WorkflowNodeSchema[], edges: WorkflowEdgeSchema[] }
// Validates: 1 start, 1 end, no cycles, condition nodes have true/false edges

workflowEngine.activateDefinition   // mutation, guard, input: { id }
workflowEngine.listDefinitions      // query,    guard, input: { module?, isActive? }?
workflowEngine.getDefinition        // query,    guard, input: { id }
workflowEngine.triggerWorkflow      // mutation, guard, input: { definitionId, entityType, entityId, context? }
workflowEngine.getActiveWorkflows   // query,    guard, input: { assigneeId?, entityType? }?
workflowEngine.submitDecision       // mutation, guard, input: { instanceId, stepId, decision, comment? }
workflowEngine.getMonitoringDashboard // query,  guard
workflowEngine.getInstance          // query,    guard, input: { id }
workflowEngine.listInstances        // query,    guard, input: { entityType?, entityId?, status?, take?, skip? }?
```

Node types: `start` | `approval` | `parallel` | `condition` | `action` | `end`  
Decision values: `APPROVED` | `REJECTED`  
Authorization: `submitDecision` checks `assigneeId === userId` OR `assigneeRole === userRole`

---

### `security` — `/server/routers/security.ts`

```typescript
security.listUsers            // query,    abac("config","read"), input: { role?, take?, skip? }?
security.getUser              // query,    abac("config","read"), input: { id }
security.updateRole           // mutation, abac("config","write"), input: { userId, role }
security.revokeAllSessions    // mutation, abac("config","write"), input: { userId }
security.revokeMyOtherSessions // mutation, guard
security.getDashboard         // query,    abac("config","read")
security.changePassword       // mutation, guard, input: { currentPassword, newPassword (min 8) }
```

`updateRole` and `changePassword` both call `invalidateAllSessions()` — immediate effect.

---

### `auditTrail` — `/server/routers/auditTrail.ts`

Read-only. All writes happen via `writeAuditEntry()` from `lib/shared-kernel/audit/audit-middleware.ts`.

```typescript
auditTrail.list        // query, abac("compliance","read"), input: { entityType?, entityId?, actorId?, module?, action?, from?, to?, take? (max 500), skip? }
auditTrail.getByEntity // query, abac("compliance","read"), input: { entityType, entityId }
auditTrail.getSummary  // query, abac("analytics","read"),  input: { days?: 1-365 }?
```

---

### `automation` — `/server/routers/automation.ts`

⚠️ **Critical**: Uses in-memory store + `publicProcedure`.

```typescript
automation.getAll      // query,    publicProcedure — no auth, filters: { status?, search? }?
automation.getById     // query,    publicProcedure — no auth
automation.create      // mutation, publicProcedure — no auth, in-memory store
automation.update      // mutation, publicProcedure — no auth
automation.delete      // mutation, publicProcedure — no auth
automation.run         // mutation, publicProcedure — no auth, only console.log
automation.toggleStatus // mutation, publicProcedure — no auth
```

Entire router needs auth + real DB persistence.

---

### `benefits` — `/server/routers/benefits.ts`

```typescript
benefits.listPlans      // query,    guard, input: { planType?, isActive? }?
benefits.getPlan        // query,    guard, input: { id }
benefits.createPlan     // mutation, guard, input: { name, planType, description?, isActive?, enrolmentDeadline?, effectiveDate? }
benefits.updatePlan     // mutation, guard, input: { id, name?, description?, isActive? }
benefits.enrol          // mutation, guard, input: { employeeId, planId, effectiveDate? }
benefits.waive          // mutation, guard, input: { employeeId, planId }
benefits.listEnrolments // query,    guard, input: { employeeId?, planId?, status? }?
```

---

### `succession` — `/server/routers/succession.ts`

```typescript
succession.listPlans      // query,    guard, input: { criticalOnly? }?
succession.getPlan        // query,    guard, input: { positionId }
succession.upsertPlan     // mutation, guard, input: { positionId, criticalRole? }
succession.addCandidate   // mutation, guard, input: { positionId, employeeId, readiness, nineBoxX?, nineBoxY?, notes? }
// readiness: "READY_NOW"|"READY_IN_1Y"|"READY_IN_3Y"
succession.removeCandidate // mutation, guard, input: { candidateId }
succession.getNineBoxGrid  // query,    guard
```

---

### `foreignWorker` — `/server/routers/foreignWorkerRouter.ts`

```typescript
foreignWorker.getAll   // query,    guard
foreignWorker.getById  // query,    guard, input: { id }
foreignWorker.save     // mutation, guard, input: {
                       //   id?, name, passportNumber, nationality, permitType,
                       //   permitExpiry, employer, phone?, address?,
                       //   status: "Active"|"Pending"|"Expired"|"Renewal"
                       // }
foreignWorker.delete   // mutation, guard, input: { id }
```

---

### `accounting` — `/server/routers/accounting.ts`

```typescript
accounting.payrollRecords      // query,    prot, input: { status?: "PENDING"|"PROCESSED"|"PAID" }
accounting.payrollByEmployee   // query,    prot, input: { employeeId }
accounting.calculatePayroll    // mutation, prot, input: { employeeId, periodStart, periodEnd }
accounting.listCreditNotes     // query,    prot
accounting.createCreditNote    // mutation, prot, input: z.any() ⚠️
accounting.listDebitNotes      // query,    prot
accounting.createDebitNote     // mutation, prot, input: z.any() ⚠️
accounting.listDeliveryOrders  // query,    prot
accounting.createDeliveryOrder // mutation, prot, input: z.any() ⚠️
accounting.getDeliveryOrder    // query,    prot, input: { id }
accounting.listInvoices        // query,    prot, input: { limit?: number }
accounting.createInvoice       // mutation, prot, input: { customerName, amount: positive }
accounting.accountingSummary   // query,    prot
accounting.calculateTax        // mutation, prot, input: { grossIncome: positive, type: "PCB"|"SST" }
```

⚠️ `createCreditNote`, `createDebitNote`, `createDeliveryOrder` use `z.any()` — no schema validation.

---

### `visa` / `permits` — `/server/routers/visa.ts`

Both `visa` and `permits` keys in appRouter point to the same `visaRouter`.

```typescript
visa.expiring     // query,    prot, input: { days: 1-365, default 30 }
visa.byEmployee   // query,    prot, input: { employeeId }
visa.create       // mutation, prot, input: { employeeId, type, number, issueDate, expiryDate }
visa.renew        // mutation, prot, input: { visaId, newExpiryDate }
```

---

### Remaining Routers (stubs or delegated to services)

| Router | Status | Notes |
|--------|--------|-------|
| `search` | Operational | Delegates to search service |
| `document` | Operational | Document lifecycle |
| `iso` | Operational | ISO quality management |
| `sop` | Operational | Standard operating procedures |
| `lms` | Partial | Learning management |
| `assets` | Partial | Fixed assets |
| `payrollHcm` | Partial | Extended HCM payroll |
| `statutory` | Partial | EPF/SOCSO/LHDN |
| `zakat` | Stub | Zakat calculation |
| `lifecycle` | Partial | Employee lifecycle events |
| `notificationCenter` | Partial | In-app notifications |
| `notifications` | Partial | Notification dispatch |
| `ess` | Partial | Employee self-service |
| `mss` | Partial | Manager self-service |
| `travel` | Partial | Travel management |
| `healthSafety` | Partial | OSHA compliance |
| `dataGovernance` | Partial | Data governance |
| `workforcePlanning` | Partial | Headcount planning |
| `integrations` | Partial | Third-party integrations |
| `shifts` | Partial | Shift management |
| `positions` | Partial | Job positions |
| `qms` | Partial | Quality management |
| `er` (employeeRelations) | Partial | ER cases |
| `fomema` | Partial | FOMEMA medical screening |
| `industrialRelations` | Partial | IR cases |
| `learning` | Partial | L&D modules |
| `handbook` | Partial | Employee handbook |
| `company` | Partial | Company settings |
| `accommodation` | Partial | Worker accommodation |
| `medical` | Partial | Medical records |
| `admin` | Partial | Admin operations |
| `geolocation` (tRPC) | Partial | GPS management |
| `opex` | Partial | Operating expenses |
| `capex` | Partial | Capital expenses |
| `featureFlags` | Partial | Feature flag management |
| `ms` | Unknown | Microsoft integration |
| `ai` | Operational (placeholder) | Workforce forecasting |
| `dashboard` | Operational | Dashboard data |
