# 05 — Performance Review

Analysis of performance bottlenecks, missing database indexes, N+1 query patterns, caching opportunities, and pagination gaps across the API layer.

---

## Summary

| Category | Issues Found | Priority |
|----------|-------------|----------|
| N+1 queries | 3 | High |
| Missing pagination | 8 | High |
| Raw SQL without indexes | 4 | High |
| Missing DB indexes | 6 | Medium |
| Caching opportunities | 5 | Medium |
| Unbounded queries | 4 | Medium |
| In-memory state (lost on restart) | 2 | High |

---

## N+1 Query Patterns

### N1 — `getDepartmentBreakdown` loads all employees into memory

**File:** `server/routers/analytics.ts`  
**Issue:** Fetches every employee record just to group by department in JavaScript:

```typescript
const employees = await prisma.employee.findMany({
  where: { tenantId: ctx.tenantId },
  select: { id: true, department: true, isForeign: true },
});
// then: JavaScript Map to group by department
```

With 10,000 employees, this pulls 10,000 rows when a `GROUP BY` would return a dozen.

**Fix:**
```typescript
const breakdown = await prisma.employee.groupBy({
  by: ["department"],
  where: { tenantId: ctx.tenantId },
  _count: { id: true },
  _sum: { isForeign: true },  // if isForeign is numeric; else use count with filter
});
```

---

### N2 — `getMonitoringDashboard` runs 4 serial COUNT queries

**File:** `server/routers/workflowEngine.ts`  
**Issue:**
```typescript
const [active, completed, rejected, slaBreached] = await Promise.all([
  prisma.workflowInstance.count({ where: { ...where, status: "ACTIVE" } }),
  prisma.workflowInstance.count({ where: { ...where, status: "COMPLETED" } }),
  prisma.workflowInstance.count({ where: { ...where, status: "REJECTED" } }),
  prisma.workflowInstanceStep.count({ ... }),
]);
```

`Promise.all` runs concurrently, but each is still a separate DB round trip. A single query with `groupBy` on `status` would be more efficient.

**Fix:**
```typescript
const counts = await prisma.workflowInstance.groupBy({
  by: ["status"],
  where: { tenantId: ctx.tenantId, isDeleted: false },
  _count: { status: true },
});
```

---

### N3 — Attendance `clockOut` does two sequential queries for shift lookup

**File:** `server/routers/attendance.ts`  
**Issue:**
```typescript
// First: find open attendance record
const record = await prisma.attendance.findFirst({ ... });

// Second: lookup shift assignment (sequential)
const shiftAssignment = await prisma.shiftAssignment?.findFirst?.({
  include: { shift: { select: ... } },
});
```

These could be parallelized since they don't depend on each other:
```typescript
const [record, shiftAssignment] = await Promise.all([
  prisma.attendance.findFirst({ ... }),
  prisma.shiftAssignment.findFirst({ ... }),
]);
```

---

## Missing Pagination

### P1 — `employee.list` — no default page size

**File:** `server/routers/employee.ts`  
The `list` procedure delegates to `getEmployeesByTenant()` with optional filters, but there's no enforced `take`/`skip`. On large tenants, this returns all employees in one query.

**Fix:** Add `take` (max 200) and `skip` parameters with defaults.

---

### P2 — `compliance.policy.getAll`, `regulation.getAll`, `checklist.getAll`

All three use `SELECT * FROM ... ORDER BY created_at DESC` with no LIMIT beyond the raw SQL default.

**Fix:** Add `LIMIT $2 OFFSET $3` to each raw SQL query.

---

### P3 — `foreignWorker.getAll`

Uses `findMany` with no `take` or pagination — unbounded for large tenants.

---

### P4 — `accounting.*` list procedures

`listCreditNotes`, `listDebitNotes`, `listDeliveryOrders` all use `SELECT * FROM "table" WHERE tenant_id = $1` with no LIMIT.

---

### P5 — `organisation.list` and `getHierarchy`

`getHierarchy` loads all org nodes including all children — could be large for complex org structures.

---

### P6 — `benefits.listEnrolments`

No pagination parameters. A plan with thousands of enrolments returns all at once.

---

### P7 — `siem` endpoint: hardcoded `take: 1000`

High-volume audit trail tenants will always receive the same 1000 latest events with no way to paginate.

---

### P8 — `auditTrail.list` — max 500 per page is sufficient, but default 100

Good: pagination exists. However the double COUNT query (one for records, one for total) runs on every page request. Cache the total for 30 seconds or return a `hasMore` flag instead.

---

## Raw SQL Without Index Guarantees

### R1 — compliance tables lack known indexes

`compliance_policies`, `compliance_regulations`, `compliance_checklists` are queried via raw SQL but are not in the Prisma schema, so no index migrations exist for them:

```sql
SELECT * FROM compliance_policies WHERE tenant_id = $1 ORDER BY created_at DESC
```

Missing index: `(tenant_id, created_at DESC)` on each table.

---

### R2 — `leave_applications` table (raw SQL bridge)

The leave router queries `leave_applications` via raw SQL with multiple column filters but no guaranteed compound indexes:

```sql
WHERE tenant_id = $1 AND employee_id = $2 AND status = $3 AND start_date >= $4
```

Missing indexes:
- `(tenant_id, employee_id, status)`
- `(tenant_id, start_date, end_date)` for calendar queries

---

### R3 — `credit_notes`, `debit_notes`, `delivery_orders`, `invoices`

Same pattern — raw SQL tables not in Prisma schema, missing `(tenant_id, created_at)` indexes.

---

## Missing Database Indexes

Prisma-managed tables likely missing performance indexes:

| Table | Suggested Index | Query Pattern |
|-------|----------------|---------------|
| `Attendance` | `(tenantId, date, employeeId)` | clockIn/clockOut/list |
| `Attendance` | `(tenantId, employeeId, date DESC)` | employee attendance history |
| `LeaveBalance` | already has unique constraint | ✓ |
| `AuditTrail` | `(tenantId, createdAt DESC)` | list + SIEM |
| `AuditTrail` | `(tenantId, entityType, entityId)` | getByEntity |
| `WorkflowInstance` | `(tenantId, status, isDeleted)` | getActiveWorkflows |
| `WorkflowInstanceStep` | `(instanceId, status, isDeleted)` | submitDecision |
| `Employee` | `(tenantId, department)` | getDepartmentBreakdown |
| `OnboardingChecklist` | `(tenantId, status, dueDate)` | listOverdue |

---

## Caching Opportunities

### CA1 — `dashboard.getData` — high read, low change

Dashboard data aggregates many queries. Cache result per tenant for 60 seconds in Redis:
```typescript
const cacheKey = `dashboard:${ctx.tenantId}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
const data = await getDashboardData(ctx.tenantId);
await redis.setex(cacheKey, 60, JSON.stringify(data));
return data;
```

---

### CA2 — `leave.listPolicies` — rarely changes

Leave policies change infrequently. Cache per tenant for 5 minutes with invalidation on `upsertPolicy`.

---

### CA3 — `analytics.*` — expensive aggregations

Turnover rate and headcount summary run aggregate queries on large employee tables. Cache for 5 minutes.

---

### CA4 — `organisation.getHierarchy` — structural data

Org hierarchy is rarely updated. Cache for 10 minutes.

---

### CA5 — AI chat sessions stored in process memory

**File:** `lib/chat-sessions.ts`  
Chat history is stored in a Node.js `Map` in process memory. In a multi-instance deployment (k8s), different requests from the same session go to different instances and lose history.

**Fix:** Move session storage to Redis:
```typescript
async function getChatSession(sessionId: string): Promise<Message[]> {
  const raw = await redis.get(`chat:${sessionId}`);
  return raw ? JSON.parse(raw) : [];
}
```

---

## Unbounded Queries

| Router | Procedure | Issue |
|--------|-----------|-------|
| `employee` | `list` | No take/skip |
| `foreignWorker` | `getAll` | No take/skip |
| `organisation` | `getHierarchy` | Loads all + children |
| `compliance` | `policy.getAll` | No LIMIT in SQL |

---

## In-Memory State (Lost on Restart / Multi-Instance)

| Location | Data at risk |
|----------|-------------|
| `server/routers/automation.ts` | All automation rules |
| `lib/chat-sessions.ts` | All chat session history |

Both must be migrated to Redis or PostgreSQL for production reliability.

---

## Query Optimization Quick Wins

These improvements can be made without schema changes:

1. **`getDepartmentBreakdown`** → use `groupBy` — eliminates JS aggregation
2. **`clockOut`** → parallelize `findFirst` + `shiftAssignment` lookup
3. **`auditTrail.getSummary`** → use `groupBy` instead of counting per action
4. **`accounting.accountingSummary`** → already uses `Promise.all` ✓

## Priority Matrix

| Fix | Impact | Effort |
|-----|--------|--------|
| Add pagination to `employee.list` | High | Low |
| Add indexes to `Attendance`, `AuditTrail` | High | Low (migration) |
| Migrate chat sessions to Redis | High | Medium |
| Migrate automation to DB | High | High |
| Fix `getDepartmentBreakdown` groupBy | Medium | Low |
| Cache `dashboard.getData` | Medium | Low |
| Add indexes to raw SQL tables | High | Medium |
