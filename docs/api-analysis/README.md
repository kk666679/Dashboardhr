# API Analysis — Executive Summary & Index

**Project:** AIFWMS — AI-powered Foreign Worker Management System  
**Framework:** Next.js 16 (App Router) · tRPC v11 · Prisma 7 · PostgreSQL · Redis  
**Analysis Date:** August 2026  

---

## What This Codebase Is

AIFWMS is a multi-tenant SaaS HCM (Human Capital Management) platform focused on Malaysian labour law compliance and foreign worker lifecycle management. It exposes two API layers:

1. **tRPC** — the primary RPC layer (~70 routers, ~400+ procedures) mounted at `POST /api/trpc/[trpc]`
2. **REST / Next.js Route Handlers** — ~50 REST endpoints across `app/api/` for streaming, webhooks, file uploads, and integrations

---

## API Surface at a Glance

| Layer | Routers / Groups | Estimated Procedures / Endpoints |
|-------|-----------------|----------------------------------|
| tRPC | 70 routers | ~420 procedures |
| REST | 25 directories | ~52 route handlers |
| **Total** | | **~470+ API surface points** |

### Top-Level tRPC Namespaces

| Namespace | Domain |
|-----------|--------|
| `auth` | Session identity |
| `employee` | Core employee CRUD |
| `payroll` / `payrollHcm` | Salary processing |
| `leave` | Leave lifecycle |
| `attendance` | Clock-in/out, overtime |
| `compliance` | Policies, regulations, checklists |
| `onboarding` | Preboarding checklists |
| `termination` / offboarding group | Exit lifecycle |
| `recruitment` | Pipeline & JD creation |
| `performance` | Review cycles |
| `benefits` | Plan enrolment |
| `succession` | 9-Box, critical roles |
| `workflowEngine` | BullMQ-backed approval flows |
| `security` | Users, roles, sessions |
| `auditTrail` | Immutable audit log |
| `analytics` | Headcount, turnover |
| `visa` / `permits` | Visa lifecycle |
| `foreignWorker` | FW profiles |
| `fomema` | Medical screening |
| `geolocation` | GPS tracking |
| `accommodation` | Worker housing |
| `iso` | ISO quality management |
| `sop` | Standard operating procedures |
| `ai` | Workforce forecasting |
| `automation` | Workflow automation rules |
| `organisation` | Org hierarchy |
| `accounting` | Invoices, payroll records |
| + 45 more | See `01-inventory.md` |

### REST API Groups

| Path Prefix | Purpose |
|-------------|---------|
| `/api/auth/[...nextauth]` | Login, OIDC, logout, session |
| `/api/auth/mfa` | TOTP, SMS, WebAuthn MFA |
| `/api/ai/chat` | Streaming AI chat (Claude/OpenAI/Ollama) |
| `/api/ai/rag` | RAG document query |
| `/api/documents/upload` | Multipart document upload |
| `/api/embeddings/ingest` | Document text ingestion |
| `/api/blob` | Vercel Blob storage proxy |
| `/api/webhooks/biometric` | HMAC-signed biometric terminal events |
| `/api/webhooks/background-check` | Background check callbacks |
| `/api/siem` | CEF/JSON audit event stream |
| `/api/regulatory/changes` | Regulatory change pipeline |
| `/api/sops` | SOP search |
| `/api/geolocation` | Worker GPS data |
| `/api/health` | Readiness probe |
| `/api/iso/*` | ISO audits, risk, CAPA |
| See `02-rest-endpoints.md` for full list | |

---

## Security Model

- **Session auth**: Redis-backed sessions, 8-hour absolute TTL, 30-min idle for HR roles
- **MFA**: TOTP + SMS enforced for privileged roles (Super_Admin, HR_Director, Payroll_Manager, etc.)
- **ABAC**: Attribute-Based Access Control via `abacProcedure(module, action)` — tenant isolation + role/dept/entity scoping
- **Row-Level Security**: PostgreSQL RLS context applied on every guarded procedure
- **Three procedure tiers**: `publicProcedure` → `protectedProcedure` → `guardedProcedure` / `abacProcedure`

---

## Key Findings Summary

| Category | Finding |
|----------|---------|
| ✅ Fixed | `automation` router — was `publicProcedure` + in-memory, now `guardedProcedure` + Prisma |
| ✅ Fixed | Rate limiting added to `/api/auth/login` and `/api/auth/mfa` |
| ✅ Implemented | All 18 missing APIs from the gap analysis |
| 🔴 Critical | Plain-text password storage in development paths leaking to production |
| 🔴 Critical | `app/api/ai/chat/route.ts` unauthenticated — unbounded LLM costs |
| 🔴 Critical | `app/api/geolocation/route.ts` unauthenticated — exposes worker locations |
| 🔴 Critical | `app/api/embeddings/ingest/route.ts` unauthenticated |
| 🟠 High | `$queryRawUnsafe` used extensively in compliance/accounting |
| 🟠 High | WebAuthn MFA stub always returns `verified = false` |
| 🟡 Medium | Missing DB indexes on Attendance, AuditTrail, WorkflowInstance |
| 🟡 Medium | Recruitment / performance / automation models not yet in Prisma schema |
| 🟢 Good | Audit trail on all write operations |
| 🟢 Good | Tenant isolation enforced at context level |
| 🟢 Good | HMAC signature verification on biometric webhook |

---

## Document Index

| # | Document | Contents |
|---|----------|---------|
| [01](01-inventory.md) | Full API Inventory | Complete table of all tRPC procedures + REST routes |
| [02](02-rest-endpoints.md) | REST Endpoints Deep Dive | Per-endpoint: method, path, auth, request/response |
| [03](03-trpc.md) | tRPC Router Analysis | Per-router: procedures, input schemas, auth tier |
| [04](04-security.md) | Security Review | Vulnerabilities, ABAC, session model, fixes |
| [05](05-performance.md) | Performance Review | N+1 queries, missing indexes, caching gaps |
| [06](06-examples.md) | Client SDK Examples | tRPC + REST usage patterns in TypeScript |
| [07](07-openapi.md) | OpenAPI 3.1 Spec | Machine-readable spec for REST endpoints |
| [08](08-testing.md) | Test Generation | Unit + integration test templates |
| [09](09-architecture.md) | Architecture & Diagrams | Dependency graphs, sequence diagrams |
| [10](10-missing-apis.md) | Missing APIs | Recommended additions |
| [11](11-refactoring.md) | Refactoring Guide | Prioritised improvements |
| [12](12-final-report.md) | Final Report | Coverage metrics, priorities, roadmap |
