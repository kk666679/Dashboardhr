# 11 — Refactoring Recommendations

Prioritised refactoring guide for the AIFWMS API layer. Changes are ordered by risk-adjusted impact.

---

## Priority 1 — Security Fixes (Do Immediately)

### R1 — Hash passwords with bcrypt

**Effort:** 2 hours  
**Risk:** Low (additive change)

```typescript
// 1. Add bcrypt
// pnpm add bcryptjs
// pnpm add -D @types/bcryptjs

// 2. lib/auth-utils.ts (new file)
import bcrypt from "bcryptjs";

export const hashPassword  = (p: string)           => bcrypt.hash(p, 12);
export const verifyPassword = (p: string, h: string) => bcrypt.compare(p, h);

// 3. app/api/auth/[...nextauth]/route.ts
import { verifyPassword } from "@/lib/auth-utils";
const valid = await verifyPassword(password, user.password);
// Remove: || password === "dev-password"

// 4. server/routers/security.ts — changePassword
import { hashPassword, verifyPassword } from "@/lib/auth-utils";
const valid = await verifyPassword(input.currentPassword, user.password);
await prisma.user.update({ data: { password: await hashPassword(input.newPassword) } });

// 5. Migration: hash all existing plain-text passwords
// prisma/migrations/xxxx_hash_passwords.ts — one-time script
```

---

### R2 — Add authentication to `automation` router

**Effort:** 1 hour  
**Risk:** Low

```typescript
// server/routers/automation.ts
// Replace all publicProcedure with guardedProcedure

// 1. Change imports
import { guardedProcedure, router } from "../trpc";

// 2. Add Prisma model (prisma/schema.prisma)
model AutomationRule {
  id          String   @id @default(cuid())
  tenantId    String
  name        String
  description String?
  trigger     String
  action      String
  config      Json
  status      String   @default("draft")
  schedule    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  @@index([tenantId])
}

// 3. Update procedures to use ctx.tenantId
getAll: guardedProcedure.query(async ({ ctx, input }) => {
  return prisma.automationRule.findMany({
    where: {
      tenantId: ctx.tenantId,
      ...(input?.status ? { status: input.status } : {}),
    }
  });
}),
```

---

### R3 — Add session authentication to unauthenticated REST endpoints

**Effort:** 2 hours  
**Files:** `geolocation/route.ts`, `embeddings/ingest/route.ts`, `ai/chat/route.ts`, `regulatory/changes/route.ts`

```typescript
// Shared auth guard utility
// lib/server/require-session.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "./auth";

export async function requireSession(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, response: null };
}

// Apply in each route:
export async function GET(request: NextRequest) {
  const { session, response } = await requireSession(request);
  if (response) return response;
  // ... existing logic using session.tenantId
}
```

---

## Priority 2 — Schema Compliance Migrations

### R4 — Migrate raw SQL tables to Prisma schema

**Effort:** 1 day  
**Affected tables:** `compliance_policies`, `compliance_regulations`, `compliance_checklists`, `leave_applications`, `credit_notes`, `debit_notes`, `delivery_orders`, `invoices`

```prisma
// prisma/schema.prisma additions

model CompliancePolicy {
  id            String   @id @default(cuid())
  tenantId      String
  name          String
  category      String
  version       String
  description   String?
  owner         String
  effectiveDate String
  status        String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  tenant        Tenant   @relation(fields: [tenantId], references: [id])
  @@index([tenantId, createdAt(sort: Desc)])
}

// Then update compliance.ts:
policy.getAll: async ({ ctx }) => {
  return prisma.compliancePolicy.findMany({
    where: { tenantId: ctx.tenantId },
    orderBy: { createdAt: "desc" },
  });
},
```

Benefits: type safety, proper indexes, no `$queryRawUnsafe`, works with RLS.

---

### R5 — Fix `accounting` procedures using `z.any()`

**Effort:** 2 hours  
**Files:** `server/routers/accounting.ts`

```typescript
// Before
createCreditNote: protectedProcedure.input(z.any()).mutation(...)

// After — define proper schemas
const CreditNoteSchema = z.object({
  invoiceRef:   z.string().min(1),
  amount:       z.number().positive(),
  reason:       z.string().min(1),
  customerId:   z.string().optional(),
  lineItems:    z.array(z.object({
    description: z.string(),
    amount:      z.number(),
  })).optional(),
});

createCreditNote: protectedProcedure
  .input(CreditNoteSchema)
  .mutation(async ({ ctx, input }) => { ... }),
```

---

## Priority 3 — Performance Improvements

### R6 — Add pagination to unbounded list endpoints

**Effort:** 3 hours

Standardise all list procedures to use:

```typescript
// Shared pagination schema
// lib/schemas.ts (add to existing file)
export const PaginationSchema = z.object({
  take: z.number().int().min(1).max(200).default(50),
  skip: z.number().int().min(0).default(0),
});

// Apply to employee.list, foreignWorker.getAll, organisation.list, etc.
list: guardedProcedure
  .input(PaginationSchema.merge(EmployeeFiltersSchema).optional())
  .query(async ({ ctx, input }) => {
    const [items, total] = await Promise.all([
      prisma.employee.findMany({
        where: { tenantId: ctx.tenantId },
        take: input?.take ?? 50,
        skip: input?.skip ?? 0,
      }),
      prisma.employee.count({ where: { tenantId: ctx.tenantId } }),
    ]);
    return { items, total, take: input?.take ?? 50, skip: input?.skip ?? 0 };
  }),
```

---

### R7 — Move analytics aggregations to the database

**Effort:** 2 hours

```typescript
// analytics.getDepartmentBreakdown — use groupBy
getDepartmentBreakdown: protectedProcedure.query(async ({ ctx }) => {
  const rows = await prisma.employee.groupBy({
    by: ["department"],
    where: { tenantId: ctx.tenantId },
    _count: { id: true },
    // Note: boolean sum requires raw SQL or computed field
  });
  return rows.map(r => ({
    department: r.department ?? "UNASSIGNED",
    total: r._count.id,
  }));
}),
```

---

### R8 — Add database indexes via Prisma migration

**Effort:** 1 hour

```prisma
// Add to schema.prisma:

model Attendance {
  // ... existing fields ...
  @@index([tenantId, date, employeeId])
  @@index([tenantId, employeeId, date(sort: Desc)])
}

model AuditTrail {
  // ... existing fields ...
  @@index([tenantId, createdAt(sort: Desc)])
  @@index([tenantId, entityType, entityId])
  @@index([tenantId, module, action])
}

model WorkflowInstance {
  // ... existing fields ...
  @@index([tenantId, status, isDeleted])
}

model Employee {
  // ... existing fields ...
  @@index([tenantId, department])
}
```

Then run: `pnpm prisma migrate dev --name add-performance-indexes`

---

## Priority 4 — Code Quality

### R9 — Migrate in-memory chat sessions to Redis

**Effort:** 3 hours  
**File:** `lib/chat-sessions.ts`

```typescript
// lib/chat-sessions.ts — replace Map with Redis
import { getRedis } from "@/lib/session"; // reuse existing Redis client

const SESSION_TTL = 60 * 60; // 1 hour

export async function getChatSession(sessionId: string): Promise<Message[]> {
  const redis = await getRedis();
  const raw = await redis.get(`chat:${sessionId}`);
  return raw ? JSON.parse(raw) : [];
}

export async function setChatSession(sessionId: string, messages: Message[]): Promise<void> {
  const redis = await getRedis();
  await redis.setex(`chat:${sessionId}`, SESSION_TTL, JSON.stringify(messages));
}
```

---

### R10 — Consolidate duplicate `performance` stubs

**Effort:** 1 day  
**Files:** `server/routers/performance.ts`

Replace all stubs with real Prisma-backed implementations. The minimum needed:

1. Add `PerformanceCycle`, `PerformanceReview` to Prisma schema
2. Replace `console.log` save with actual `prisma.performanceReview.create()`
3. Replace empty array returns with `prisma.performanceCycle.findMany()`
4. Switch `getCycles` and `getEmployees` from `publicProcedure` to `guardedProcedure`

---

### R11 — Consolidate recruitment stub

**Effort:** 1 day  
**File:** `server/routers/recruitment.ts`

```typescript
// Minimum viable implementation
export const recruitmentRouter = router({
  pipeline: guardedProcedure
    .input(PaginationSchema.optional())
    .query(async ({ ctx, input }) => {
      return prisma.jobApplication.findMany({
        where: { tenantId: ctx.tenantId },
        orderBy: { appliedAt: "desc" },
        take: input?.take ?? 50,
        skip: input?.skip ?? 0,
      });
    }),

  jdCreate: guardedProcedure
    .input(z.object({ title: z.string(), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.jobDescription.create({
        data: { tenantId: ctx.tenantId, ...input },
      });
    }),
});
```

---

### R12 — Standardise error handling in compliance raw SQL

**Effort:** 2 hours

Replace silent `catch { /* table may not exist */ }` blocks with explicit table existence checks and proper error propagation:

```typescript
// Instead of silent catches:
async function ensureComplianceTable(tableName: string): Promise<boolean> {
  try {
    await prisma.$queryRawUnsafe(
      `SELECT 1 FROM information_schema.tables WHERE table_name = $1 LIMIT 1`,
      tableName
    );
    return true;
  } catch {
    return false;
  }
}

// Then in procedures:
const tableExists = await ensureComplianceTable("compliance_policies");
if (!tableExists) {
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Compliance tables not yet migrated. Run prisma migrate deploy.",
  });
}
```

Better: just add the tables to the Prisma schema (see R4).

---

## Refactoring Roadmap

### Sprint 1 (Security — 1 week)
- R1: bcrypt password hashing
- R2: automation router auth
- R3: session auth on REST endpoints

### Sprint 2 (Schema — 1 week)
- R4: migrate raw SQL tables to Prisma
- R5: fix z.any() inputs in accounting

### Sprint 3 (Performance — 1 week)
- R6: pagination on list endpoints
- R7: DB-side analytics aggregations
- R8: add database indexes

### Sprint 4 (Quality — 1 week)
- R9: Redis chat sessions
- R10: performance review persistence
- R11: recruitment stub → real implementation
- R12: compliance error handling

---

## Impact Matrix

| Refactoring | Security | Performance | Reliability | Effort |
|------------|----------|-------------|-------------|--------|
| R1 — bcrypt | 🔴 Critical | — | — | Low |
| R2 — automation auth | 🔴 Critical | — | — | Low |
| R3 — REST auth | 🔴 Critical | — | — | Low |
| R4 — Prisma migration | — | High | High | High |
| R5 — fix z.any() | Medium | — | Medium | Low |
| R6 — pagination | — | High | Medium | Low |
| R7 — DB analytics | — | High | — | Low |
| R8 — DB indexes | — | High | — | Low |
| R9 — Redis sessions | — | — | High | Medium |
| R10 — performance | — | — | Medium | High |
| R11 — recruitment | — | — | Medium | High |
| R12 — error handling | — | — | Medium | Low |
