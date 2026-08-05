# Technical Debt Reduction — TODO List

> **Source:** `docs/tech-debt/REDUCTION_PLAN.md`
> **Generated:** 2026-07-29 · **Last Verified:** 2026-08-06
> **Status:** ✅ Complete — All 24 tracked debt items resolved. Remaining work tracked in [`PATH_TO_100.md`](./PATH_TO_100.md).

---

## Priority Legend

| Icon | Priority | Meaning |
|------|----------|---------|
| 🔴 P0 | Critical | Security/compliance risk — immediate action required |
| 🟠 P1 | High | Operational risk — address within current sprint |
| 🟡 P2 | Medium | Quality/performance debt — address within next sprint |
| 🟢 P3 | Low | Code cleanup — address when convenient |

---

## 🔴 P0 — Critical (Security & Compliance)

### Sprint 1: Security & Compliance (Days 1-3)

- [x] **CD-1: Fix cross-tenant data leakage in 4 AI agents** *(Effort: 1 day)*
  - [x] `server/agents/fomema.ts` — Added `tenantId` param and filter all Prisma queries with `where: { tenantId }`
  - [x] `server/agents/employee-relations.ts` — Added `tenantId` param and filter all Prisma queries with `where: { tenantId }`
  - [x] `server/agents/industrial-relations.ts` — Added `tenantId` param and filter all Prisma queries with `where: { tenantId }`
  - [x] `server/agents/learning-development.ts` — Added `tenantId` param and filter all Prisma queries with `where: { tenantId }`

- [x] **CD-2: Fix duplicate Prisma $use middleware** *(Effort: 0.5 day)*
  - [x] Remove the first `$use` call (dead no-op comment block) in `lib/prisma.ts` — Already resolved
  - [x] Implement proper AsyncLocalStorage-based tenant context for the second `$use` middleware — Already implemented
  - [x] Verify tenantId propagation through tRPC context — Implemented via `withTenant()` and `server/trpc.ts`

- [x] **CD-3: Make audit log immutable** *(Effort: 1 day)*
  - [x] Option B: Prisma middleware rejects UPDATE/DELETE on `AuditTrail` via `APPEND_ONLY_MODELS` — Already implemented in `lib/prisma.ts`

- [x] **HD-5: Populate empty SOFT_DELETE_MODELS set** *(Effort: 0.5 day)*
  - [x] `lib/prisma.ts` — Identify models that need soft-delete and populate `SOFT_DELETE_MODELS`

- [x] **HD-1: Replace hardcoded AUDITOR_EMAIL placeholder** *(Effort: 0.1 day)*
  - [x] `lib/constants/levy-rates.ts` — Replaced `AUDITOR_EMAIL = "AUDITOR_EMAIL"` with `process.env.AUDITOR_EMAIL ?? ""`

---

## 🟠 P1 — High (Operational Risk)

### Sprint 2: Foundation & Quality (Days 4-7)

- [ ] **HD-4: Create `.env.example`** *(Effort: 0.5 day)*
  - [x] Create project root `.env.example` with all required environment variables documented
  - [x] Include placeholders for: DB URL, Redis URL, session secret, API keys, auditor email, etc.

- [x] **HD-7: Implement admin router queries** *(Effort: 1 day)*
  - [x] `server/api/routers/admin.ts` — Replaced all hardcoded stub handlers with actual DB queries (0 stubs remain)

- [x] **HD-2: Add per-tenant rate limiting with tokenlens** *(Effort: 1-2 days)*
  - [x] `lib/security/rate-limit.ts` — Implemented `checkTenantBudget()` with per-tenant token budget tracking via tokenlens
  - [x] Redis-backed storage with in-memory LRU fallback

- [x] **MD-1: Remove duplicate `motion` package** *(Effort: 0.5 day)*
  - [x] Removed `motion` from `package.json` — only `framer-motion` remains
  - [x] Consolidated imports across the codebase to `framer-motion`

- [x] **HD-3: Write test suite for critical paths** *(Effort: 2 days initial)*
  - [x] Agent functions (compensation-benefits, fomema, employee-relations, industrial-relations, learning-development) — 5 test files, 70+ tests, all passing
  - [x] Payroll calculations — `lib/payroll-service.extended.test.ts`: createPayroll, processPayroll, generatePayslip, getPayrollById, getPayrollsByTenant, getPayrollsByEmployee (16 tests)
  - [x] Tenant isolation middleware — `lib/prisma-middleware.test.ts`: auditTrailImmutability (9 tests), softDeleteFilter (9 tests), tenantIsolation (11 tests), withTenant/AsyncLocalStorage (5 tests) = 34 tests total
  - [x] Security/rate limiting utilities — `lib/security/rate-limit.test.ts`: resolveTokenBudgetCost, checkRateLimit, resetRateLimit, checkTenantBudget, resetTenantBudget, getRateLimitHeaders (14 tests)

- [x] **MD-5: Consolidate all levy rate imports** *(Effort: 1 day)*
  - [x] Identified all locations with hardcoded levy rates
  - [x] All imports now reference canonical `lib/constants/levy-rates.ts` — catch-block examples in `server/agents/levy.ts` and `server/agents/hr-quality-management.ts` updated

---

## 🟡 P2 — Medium (Quality & Performance)

### Sprint 3: Architecture & Performance (Week 2-3)

- [x] **MD-2: Fix `require()` in ESM context** *(Effort: 0.5 day)*
  - [x] `i18n/config.ts` — Replaced `require()` with async `import()` via new `getI18nResources()` function

- [x] **MD-3: Migrate to Redis-backed rate limiting** *(Effort: 1-2 days)*
  - [x] `lib/security/rate-limit.ts` — Replaced in-memory LRU cache with Redis (ioredis) + LRU fallback

- [x] **MD-4: Fix `<div>` instead of `<html>` in layout** *(Effort: 0.1 day)*
  - [x] `app/[locale]/layout.tsx` — Replaced `<div>` with `<html>` element for locale wrapper

- [x] **MD-6: Remove duplicate `server/context.ts`** *(Effort: 0.5 day)*
  - [x] Verified `server/trpc.ts` fully covers context creation
  - [x] Deprecated `server/context.ts` — replaced with placeholder comment

- [x] **MD-7: Configure image optimization** *(Effort: 0.5 day)*
  - [x] `next.config.js` — Replaced `images.unoptimized: true` with `remotePatterns` configuration

- [x] **MD-8: Add @db.Text annotations to schema** *(Effort: 1 day)*
  - [x] `prisma/schema.prisma` — Added `@db.Text` to 12 long-text fields: `ai_agents.systemPrompt`, `ai_agents.description`, `ai_approvals.recommendation`, `ai_approvals.notes`, `ai_recommendations.recommendation`, `ai_recommendations.reasoning`, `ai_decisions.reasoning`, `compliance_versions.changes`, `compliance_versions.content`, `contract_templates.content`, `data_policies.content`, `notification_logs.body`, `sop_versions.changes`, `regulatory_requirements.description`

- [x] **Remove neon-auth.ts stub** *(Effort: 0.1 day)*
  - [x] `lib/neon-auth.ts` — Removed from the codebase (no longer exists)

---

## 🟢 P3 — Low (Code Cleanup)

### Sprint 4+: Long-Term Improvements (Month 2+)

- [x] **LD-1: Migrate deprecated `useFlowOperations` hook** *(Effort: 1 day)*
  - [x] `hooks/useFlowOperations.ts` — Already migrated, now a re-export shim wrapping `useWorkflowStore`

- [x] **LD-2: Remove manual vitest type shim** *(Effort: 0.1 day)*
  - [x] `types/vitest.d.ts` — Removed manual type declarations (replaced with comment)

- [x] **LD-3: Fix non-deterministic `findFirst()` calls** *(Effort: 0.5 day)*
  - [x] Added `orderBy` to most `findFirst()` queries (fomema, industrial-relations, employee-relations contracts)
  - [x] Verified remaining 3 in `server/agents/` — all already have `orderBy: { createdAt: "desc" }` ✅

- [x] **LD-4: Fix useAI closure recreating function on every render** *(Effort: 0.5 day)*
  - [x] `hooks/useAI.ts` — Uses `messagesRef` (`useRef`) so `sendMessage` callback is stable and reads fresh message history without being in the dependency array

- [x] **Add `@next/bundle-analyzer`** *(Effort: 0.5 day)*
  - [x] Install and configure bundle analyzer — added to `devDependencies`; `withBundleAnalyzer()` wrapper in `next.config.js`; `npm run analyze` script added

- [x] **Add dynamic imports for heavy pages** *(Effort: 1 day)*
  - [x] `components/features/ai/ai-chat-hub.tsx` — 5 agent tab-panel components converted to `next/dynamic` with loading skeleton; reduces initial bundle for AI Hub page

---

## Progress Tracking

| Category | Total | Not Started | In Progress | Done |
|----------|-------|-------------|-------------|------|
| 🔴 P0 — Critical | 5 | 0 | 0 | 5 |
| 🟠 P1 — High | 6 | 0 | 0 | 6 |
| 🟡 P2 — Medium | 7 | 0 | 0 | 7 |
| 🟢 P3 — Low | 6 | 0 | 0 | 6 |
| **Total** | **24** | **0** | **0** | **24** |

---

## Sprint Planning Reference

| Sprint | Focus | Items | Est. Effort | Status |
|--------|-------|-------|-------------|--------|
| Sprint 1 | Security & Compliance | 5 items (5 P0) | ~3 days | ✅ Complete |
| Sprint 2 | Foundation & Quality | 6 items | ~5-7 days | ✅ Complete |
| Sprint 3 | Architecture & Performance | 7 items | ~5-7 days | ✅ Complete |
| Sprint 4+ | Long-Term Improvements | 6 items (6 P3) | Ongoing | ✅ Complete |

---

*Generated from REDUCTION_PLAN.md — Comprehensive audit of 22 (24 sub-items) verified technical debt items. Last verified against source on 2026-08-03.*
