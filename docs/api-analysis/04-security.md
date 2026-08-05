# 04 — Security Review

Comprehensive security analysis of the AIFWMS API layer, covering vulnerabilities, the authentication model, ABAC enforcement, and recommended fixes.

---

## Summary

| Severity | Count | Examples |
|----------|-------|---------|
| 🔴 Critical | 4 | Plain-text passwords, unauthenticated write endpoints |
| 🟠 High | 5 | Raw SQL misuse, MFA stub, dev bypass in production |
| 🟡 Medium | 6 | Missing rate limiting, no pagination guards, weak document auth |
| 🟢 Positive | 5 | HMAC webhooks, ABAC enforcement, RLS, audit trail, session invalidation |

---

## 🔴 Critical Findings

### C1 — Plain-text password storage

**File:** `app/api/auth/[...nextauth]/route.ts`, `server/routers/security.ts`  
**Issue:** Passwords are stored and compared as plain text:

```typescript
// auth route
const valid = user.password === password || password === "dev-password";

// security router — changePassword
await prisma.user.update({ data: { password: input.newPassword } });
```

The `password === "dev-password"` bypass is hardcoded without a `NODE_ENV === "development"` guard, meaning any user can login with this password in production if it reaches the live environment.

**Fix:**
```typescript
import bcrypt from "bcrypt";

// On login:
const valid = await bcrypt.compare(password, user.password);

// On changePassword:
const hashed = await bcrypt.hash(input.newPassword, 12);
await prisma.user.update({ data: { password: hashed } });

// Remove the "dev-password" bypass entirely.
```

---

### C2 — Automation router uses no authentication

**File:** `server/routers/automation.ts`  
**Issue:** All 7 procedures use `publicProcedure`, meaning anyone—including unauthenticated users and external actors—can list, create, modify, delete, and execute automations.

```typescript
export const automationRouter = router({
  getAll:       publicProcedure.query(...),
  create:       publicProcedure.mutation(...),
  run:          publicProcedure.mutation(...),  // executes arbitrary actions
  delete:       publicProcedure.mutation(...),
  ...
});
```

Additionally, automations are stored in-memory (`let automations: Automation[] = []`) — all data is lost on restart.

**Fix:**
```typescript
// Replace publicProcedure with guardedProcedure throughout
// Replace in-memory store with Prisma model (AutomationRule table)
export const automationRouter = router({
  getAll: guardedProcedure.query(async ({ ctx }) => {
    return prisma.automationRule.findMany({ where: { tenantId: ctx.tenantId } });
  }),
  // ...
});
```

---

### C3 — Geolocation endpoint has no authentication

**File:** `app/api/geolocation/route.ts`  
**Issue:** The `GET /api/geolocation` endpoint returns worker locations, GPS coordinates, and geofence data without any authentication. This exposes real worker tracking data (including names and coordinates in Malaysia).

**Fix:**
```typescript
export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... existing logic
}
```

---

### C4 — No authentication on embeddings ingest endpoint

**File:** `app/api/embeddings/ingest/route.ts`  
**Issue:** `POST /api/embeddings/ingest` accepts a `documentId` and `text` and updates the document's `contentText`. No authentication means any actor can overwrite any document's indexed content (including injecting prompt-injection payloads into the RAG system).

**Fix:** Add session check and tenant ownership verification:
```typescript
export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = IngestSchema.parse(await req.json());

  // Verify document belongs to this tenant
  const doc = await prisma.document.findFirst({
    where: { id: body.documentId, tenantId: session.tenantId }
  });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // ...
}
```

---

## 🟠 High Findings

### H1 — `$queryRawUnsafe` throughout compliance and accounting

**Files:** `compliance.ts`, `accounting.ts`, `leave.ts`  
**Issue:** Raw SQL via `$queryRawUnsafe` is used in many places. While the current code parameterizes correctly (`$1`, `$2`, etc.), this pattern is fragile — any future developer editing these queries may accidentally introduce SQL injection. Table names are also hardcoded strings.

**Example (compliance.ts):**
```typescript
await prisma.$queryRawUnsafe(`SELECT * FROM compliance_policies WHERE tenant_id = $1 ORDER BY created_at DESC`, ctx.tenantId)
```

**Fix:** Migrate these tables to the Prisma schema and use typed Prisma queries. If tables must stay as raw SQL, wrap them in helper functions with clearly typed parameters and document the pattern.

---

### H2 — WebAuthn MFA always fails

**File:** `app/api/auth/mfa/route.ts`  
**Issue:** The `webauthn` method in MFA verification always sets `verified = false` with a TODO comment:
```typescript
} else if (method === "webauthn") {
  // TODO: implement @simplewebauthn/server verification flow
  verified = false;
}
```

If WebAuthn is advertised as an option in the UI, users will be blocked from completing MFA.

**Fix:** Either implement `@simplewebauthn/server` or remove `webauthn` from the accepted enum until implemented.

---

### H3 — Dev-only password bypass without NODE_ENV guard

**File:** `app/api/auth/[...nextauth]/route.ts`  
**Issue:** Already covered in C1, but specifically: the `|| password === "dev-password"` shortcut has no environment check. It will work in production if the code is deployed as-is.

**Fix:** Wrap with `process.env.NODE_ENV !== "production"`.

---

### H4 — TOTP secret exposure in non-production

**File:** `app/api/auth/mfa/route.ts`  
**Issue:**
```typescript
return NextResponse.json({
  secret: process.env.NODE_ENV === "production" ? "[STORED_SECURELY]" : secret,
  ...
});
```

The TOTP secret is returned to the client in non-production environments. Staging environments accessible externally would expose the secret.

**Fix:** Store the secret server-side (encrypted in a secrets manager) before responding. Never return the raw secret to the client.

---

### H5 — AI chat endpoint unauthenticated with external LLM calls

**File:** `app/api/ai/chat/route.ts`  
**Issue:** `POST /api/ai/chat` requires no authentication and makes real API calls to Anthropic Claude or OpenAI, potentially incurring unbounded costs from unauthenticated users.

**Fix:**
```typescript
export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  // ...
}
```

---

## 🟡 Medium Findings

### M1 — No rate limiting on authentication endpoints

**Affected:** `POST /api/auth/[...nextauth]/login`, `POST /api/auth/mfa`  
**Issue:** No rate limiting means unlimited brute-force attempts.  
**Fix:** Add Redis-based rate limiting:
```typescript
const key = `rate:login:${email}`;
const attempts = await redis.incr(key);
if (attempts === 1) await redis.expire(key, 900); // 15-min window
if (attempts > 5) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
```

---

### M2 — Document upload auth via spoofable headers

**File:** `app/api/documents/upload/route.ts`  
**Issue:** Uses `X-Employee-ID` and `X-Tenant-ID` headers instead of the session cookie. These headers can be set to any value by any caller.  
**Fix:** Use the Redis session to determine the current user's employee ID and tenant ID.

---

### M3 — No pagination on SIEM endpoint

**File:** `app/api/siem/route.ts`  
**Issue:** Hardcoded `take: 1000` with no cursor-based pagination. A tenant with millions of audit events will receive a truncated result with no way to retrieve older events.  
**Fix:** Add `cursor` or `offset` pagination.

---

### M4 — Regulatory change pipeline has no auth

**File:** `app/api/regulatory/changes/route.ts`  
**Issue:** Both `POST` (trigger pipeline) and `GET` (list changes) require no authentication. The pipeline can be triggered for any tenant by any external actor.  
**Fix:** Add session authentication + tenant ownership verification.

---

### M5 — Missing CSRF protection on state-changing REST endpoints

**Issue:** REST mutation endpoints (upload, blob, regulatory) rely solely on `httpOnly` cookies, but do not enforce same-site origin checks beyond `sameSite: strict` on the cookie itself. For `POST /api/documents/upload` (which uses headers rather than cookies), no CSRF protection exists at all.  
**Fix:** Add `Origin` header validation for non-cookie-authenticated endpoints.

---

### M6 — `performance` router uses `publicProcedure` for queries

**File:** `server/routers/performance.ts`  
**Issue:** `getCycles`, `getEmployees`, and `getApprovers` use `publicProcedure`, exposing employee names and approver email addresses to unauthenticated callers.  
**Fix:** Change to `protectedProcedure` minimum, `guardedProcedure` for tenant isolation.

---

## 🟢 Positive Security Patterns

### P1 — HMAC-SHA256 on biometric webhook

`POST /api/webhooks/biometric` correctly verifies the `x-biometric-signature` header using HMAC-SHA256 before processing any event. This prevents forged clock-in/out events.

### P2 — Multi-tier procedure protection

The `publicProcedure` → `protectedProcedure` → `guardedProcedure` → `abacProcedure` chain is clean and consistent. The RLS context application in `guardedProcedure` ensures database-level tenant isolation.

### P3 — Session invalidation on security events

`updateRole`, `changePassword`, and `revokeAllSessions` all call `invalidateAllSessions(userId)`, ensuring immediate effect of security changes across all devices.

### P4 — Immutable audit trail on all writes

`writeAuditEntry()` is called consistently across leave, attendance, onboarding, offboarding, benefits, succession, and security mutations, providing a tamper-evident log.

### P5 — MFA enforcement for privileged roles

`requiresMfa(role)` is checked at login for roles in `MFA_REQUIRED_ROLES` (Super_Admin, HR_Director, HR_Manager, Payroll_Manager, Compliance_Officer, etc.), redirecting them to a time-limited MFA challenge rather than issuing a full session.

---

## Authentication Flow Diagram

```
Client
  │
  ├─ POST /api/auth/login
  │     ├─ Validate credentials (DB lookup)
  │     ├─ requiresMfa(role)?
  │     │   ├─ YES → { mfaRequired: true, tempToken (10m JWT) }
  │     │   │         └─ POST /api/auth/mfa → verify TOTP/SMS
  │     │   │               └─ createSession() → __session cookie (8h)
  │     │   └─ NO  → createSession() → __session cookie (8h)
  │     │
  │     └─ Redis: SET session:{userId}:{ts} JSON 8h
  │
  └─ GET/POST /api/trpc/*
        └─ createContext() → getSession(__session)
              ├─ idle check (30m HR / 60m Employee)
              └─ applyRlsContext(tenantId, userId, role)
```

---

## ABAC Permission Matrix (abbreviated)

| Role | employee | payroll | compliance | config |
|------|----------|---------|------------|--------|
| Super_Admin | FULL | FULL | FULL | FULL |
| HR_Director | FULL | FULL | FULL | READ |
| HR_Manager | FULL | READ | APPROVE | NONE |
| Payroll_Manager | READ | FULL | READ | NONE |
| Compliance_Officer | READ | MASKED | FULL | NONE |
| Manager | DEPT | NONE | READ | NONE |
| EMPLOYEE | SELF | SELF | NONE | NONE |

Scope meaning: `FULL` > `APPROVE` > `DEPT/TEAM` > `READ` > `MASKED` > `SELF` > `NONE`
