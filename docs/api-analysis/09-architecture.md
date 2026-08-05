# 09 — Architecture & Dependency Graphs

System architecture overview, request flow diagrams, dependency maps, and key sequence diagrams for the AIFWMS API layer.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AIFWMS Platform                                    │
│                                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │  Web Client  │    │  Mobile App  │    │ SIEM / ERP   │                   │
│  │  (Next.js)   │    │  (future)    │    │ Integration  │                   │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                   │
│         │                  │                    │                            │
│         │ tRPC + REST       │ REST               │ API Key                   │
│         ▼                  ▼                    ▼                            │
│  ┌──────────────────────────────────────────────────────────┐               │
│  │                  Next.js 16 App Router                     │               │
│  │                                                            │               │
│  │  app/api/trpc/[trpc]/route.ts  ←──── appRouter (tRPC)    │               │
│  │  app/api/auth/[...nextauth]/   ←──── Auth handler        │               │
│  │  app/api/ai/chat/              ←──── AI streaming         │               │
│  │  app/api/webhooks/biometric/   ←──── HMAC-signed webhook  │               │
│  │  app/api/siem/                 ←──── SIEM stream          │               │
│  │  ... 25+ route groups          │                          │               │
│  └────────────┬───────────────────┘                          │               │
│               │                                              │               │
│  ┌────────────▼────────────┐   ┌──────────────────────────┐ │               │
│  │   PostgreSQL (Prisma 7) │   │   Redis (ioredis)        │ │               │
│  │                         │   │                          │ │               │
│  │   • Multi-tenant RLS    │   │   • Session store        │ │               │
│  │   • 40+ Prisma models   │   │   • Chat sessions (mem)  │ │               │
│  │   • pgvector extension  │   │   • Rate limiting (TBD)  │ │               │
│  └─────────────────────────┘   └──────────────────────────┘ │               │
│                                                               │               │
│  ┌─────────────────────────┐   ┌──────────────────────────┐ │               │
│  │   BullMQ (Valkey/Redis) │   │   Vercel Blob            │ │               │
│  │                         │   │                          │ │               │
│  │   • attendance queue    │   │   • Document storage     │ │               │
│  │   • workflow queue      │   │   • Avatar images        │ │               │
│  │   • notification queue  │   └──────────────────────────┘ │               │
│  └─────────────────────────┘                                 │               │
│                                                               │               │
│  ┌─────────────────────────────────────────────────────────┐ │               │
│  │                  AI / LLM Layer                          │ │               │
│  │                                                          │ │               │
│  │   Anthropic Claude ◄──┐                                 │ │               │
│  │   OpenAI GPT-4o-mini◄─┤── /api/ai/chat (streaming)     │ │               │
│  │   Ollama (local) ◄────┘                                 │ │               │
│  │   pgvector (RAG)  ◄──── Embeddings + knowledge base     │ │               │
│  └─────────────────────────────────────────────────────────┘ │               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## tRPC Request Flow

```
Client (React)
    │
    │  useQuery / useMutation
    │
    ▼
@trpc/react-query
    │
    │  POST /api/trpc/{procedure}
    │  (SuperJSON serialized body)
    │
    ▼
app/api/trpc/[trpc]/route.ts
    │
    │  fetchRequestHandler()
    │
    ▼
createContext()
    │
    ├─ getCurrentSession() → Redis GET session:{id}
    ├─ Build Context: { tenantId, userId, userRole, session }
    │
    ▼
Procedure middleware chain:
    │
    ├─ publicProcedure → no checks
    │
    ├─ protectedProcedure
    │   └─ if (!ctx.userId) throw UNAUTHORIZED
    │
    ├─ guardedProcedure
    │   ├─ if (!ctx.tenantId) throw UNAUTHORIZED
    │   └─ applyRlsContext(tenantId, userId, role) → PostgreSQL SET LOCAL
    │
    └─ abacProcedure(module, action)
        ├─ evaluatePolicy({ user, resource, action })
        ├─ ROLE_PERMISSIONS[role][module] → scope
        └─ if (!allowed) throw FORBIDDEN
    │
    ▼
Procedure handler
    │
    ├─ Prisma queries (with RLS active)
    ├─ writeAuditEntry() (fire-and-forget)
    ├─ dispatchNotification() (async)
    └─ Return SuperJSON-serialized result
```

---

## Authentication Sequence Diagram

### Local Login + MFA Flow

```
Client          Auth Route          Redis           Prisma
  │                  │                 │               │
  │  POST /login     │                 │               │
  │──────────────────►                 │               │
  │                  │  findUnique(email)              │
  │                  │────────────────────────────────►│
  │                  │◄────────────────────────────────│
  │                  │                 │               │
  │                  │ requiresMfa(role)?              │
  │                  │                 │               │
  │       [MFA=YES]  │                 │               │
  │                  │ SignJWT(10m)     │               │
  │◄─────────────────│                 │               │
  │  {mfaRequired,   │                 │               │
  │   tempToken}     │                 │               │
  │                  │                 │               │
  │  POST /mfa       │                 │               │
  │──────────────────►                 │               │
  │                  │ jwtVerify(tempToken)            │
  │                  │ verifyTotp(userId, code)        │
  │                  │                 │               │
  │                  │ createSession() │               │
  │                  │─────────────────►               │
  │                  │  SETEX session:{id} 8h          │
  │                  │─────────────────►               │
  │◄─────────────────│                 │               │
  │  Set-Cookie:     │                 │               │
  │  __session={id}  │                 │               │
```

---

## Leave Management Sequence

```
Employee         tRPC              Prisma           AuditLog
   │               │                  │                │
   │  leave.request│                  │                │
   │───────────────►                  │                │
   │               │ getOrCreateBalance               │
   │               │──────────────────►               │
   │               │◄──────────────────               │
   │               │ check: available >= days?        │
   │               │                  │                │
   │    [FAIL]     │                  │                │
   │◄──────────────│ TRPCError BAD_REQUEST             │
   │               │                  │                │
   │    [PASS]     │                  │                │
   │               │ INSERT leave_applications        │
   │               │──────────────────►               │
   │               │◄──────────────────               │
   │               │ UPDATE leaveBalance.pending++    │
   │               │──────────────────►               │
   │               │ writeAuditEntry()│               │
   │               │─────────────────────────────────►│
   │◄──────────────│                  │                │
   │  {id, status: │                  │                │
   │    PENDING}   │                  │                │

HR Manager
   │               │                  │                │
   │  leave.approve│                  │                │
   │───────────────►                  │                │
   │               │ findFirstLeaveApp(PENDING)        │
   │               │──────────────────►               │
   │               │ UPDATE status=APPROVED           │
   │               │ UPDATE pending--, used++         │
   │               │──────────────────►               │
   │◄──────────────│                  │                │
   │  {success:true}│                 │                │
```

---

## Workflow Engine Sequence

```
Submitter        WorkflowEngine     BullMQ          Assignee
    │                  │               │                │
    │ triggerWorkflow  │               │                │
    │──────────────────►               │                │
    │                  │ findDef(active)│               │
    │                  │ validateGraph()│               │
    │                  │               │                │
    │                  │ $transaction: │               │
    │                  │  createInstance               │
    │                  │  createStep(firstNode)        │
    │                  │               │                │
    │                  │ queue.add(advance)│           │
    │                  │───────────────►│               │
    │◄─────────────────│               │                │
    │  {instanceId}    │               │                │
    │                  │               │                │
    │            [BullMQ processes]    │                │
    │                  │               │─────────────────►
    │                  │               │   notify assignee
    │                  │               │                │
    │                  │               │  submitDecision│
    │◄────────────────────────────────────────────────│
    │                  │               │                │
    │                  │ verify auth   │                │
    │                  │  (assigneeId or role)          │
    │                  │               │                │
    │                  │ update step   │                │
    │                  │ queue.advance │                │
    │                  │───────────────►│               │
```

---

## Module Dependency Graph

```
server/root.ts (appRouter)
├── server/routers/*.ts  (70 routers)
│   ├── imports lib/prisma.ts
│   ├── imports lib/schemas.ts | lib/sop-schemas.ts
│   ├── imports lib/shared-kernel/audit/audit-middleware.ts
│   ├── imports lib/notification-dispatch.ts
│   └── imports domain services (lib/payroll-service.ts, lib/visa-service.ts, etc.)
│
├── server/trpc.ts (procedure builders)
│   ├── lib/server/auth.ts (getCurrentSession)
│   ├── lib/security/abac.ts (evaluatePolicy)
│   └── server/middleware/rls.ts (applyRlsContext)
│
└── server/context.ts (DEPRECATED — see server/trpc.ts)

app/api/trpc/[trpc]/route.ts
└── server/root.ts

app/api/auth/[...nextauth]/route.ts
├── lib/session.ts (createSession, deleteSession)
├── lib/prisma.ts
└── lib/shared-kernel/security/permission-types.ts

app/api/ai/chat/route.ts
├── server/agents/prompts.ts (AGENT_PROMPTS)
├── lib/chat-sessions.ts (in-memory)
├── server/agents/ollama.ts
└── lib/rag.ts

app/api/webhooks/biometric/route.ts
└── lib/queues/index.ts (attendanceQueue → BullMQ)

lib/prisma.ts
└── @prisma/client (generated from prisma/schema.prisma)
```

---

## Key Infrastructure Dependencies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| API Framework | Next.js | ^16.2.12 | App Router, route handlers |
| RPC Layer | tRPC | ^11.18.0 | Type-safe API procedures |
| ORM | Prisma | ^7.9.1 | DB access + migrations |
| Database | PostgreSQL | (via pg ^8.22) | Primary data store |
| Cache/Queue | Redis/Valkey | @valkey/valkey-glide ^2.5.0 | Sessions + BullMQ |
| Job Queue | BullMQ | ^6.0.5 | Async workflows + biometric |
| AI SDK | Vercel AI SDK | ai ^7.0.47 | Streaming LLM interface |
| LLM (cloud) | Anthropic + OpenAI | claude-3-5-sonnet / gpt-4o-mini | Chat + reasoning |
| LLM (local) | Ollama + LangChain | ^1.3.0 | Offline fallback |
| Vector DB | pgvector | ^0.3.0 | Semantic search (RAG) |
| Blob Storage | Vercel Blob | ^2.6.1 | File storage |
| Serialization | SuperJSON | ^2.2.6 | tRPC transformer |
| Validation | Zod | ^4.4.3 | Input schemas |
| UI State | Zustand | ^5.0.14 | Client state |
| Data Fetching | TanStack Query | ^5.101.4 | tRPC integration |

---

## Multi-Tenancy Architecture

```
PostgreSQL RLS:
  SET LOCAL app.tenant_id = '<id>';
  → All queries automatically filtered by tenant_id

Tenant isolation points:
  1. Session: tenantId in Redis payload
  2. Context: ctx.tenantId in every procedure
  3. RLS: PostgreSQL row-level security (guardedProcedure)
  4. ABAC: resource.tenantId === user.tenantId check

Tenant provisioning:
  1. Super_Admin creates Tenant record
  2. First user auto-linked to tenant on OIDC login
  3. All models have tenantId foreign key
```

---

## Queue Architecture

```
BullMQ Queues:
  ├── attendance
  │   ├── biometric clock events (from webhook)
  │   └── geofence violation processing
  │
  └── workflow
      ├── advance (move workflow to next step)
      ├── sla (SLA deadline enforcement)
      └── notify (step assignee notifications)

Workers (workers/ directory):
  └── workflow.worker.ts — exports workflowQueue
      Handles: type "advance" → advance workflow graph
               type "sla"     → escalate on deadline
```
