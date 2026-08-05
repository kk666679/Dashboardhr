# 10 — Missing APIs

Recommended API additions — functionality that is expected in an HCM/FWMS platform of this scope but is absent or only stubbed.

Priority: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Nice-to-have

---

## 🔴 Critical Missing APIs

### M1 — Real-time Notifications Push

**Gap:** The platform has `notifications` and `notificationCenter` tRPC routers, but there is no WebSocket or SSE endpoint for real-time delivery to clients. Users must poll.

**Recommended:** `GET /api/notifications/stream` — Server-Sent Events endpoint:

```typescript
// Pseudo-implementation
export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const stream = new ReadableStream({
    start(controller) {
      const unsub = subscribeToNotifications(session.userId, (notification) => {
        controller.enqueue(`data: ${JSON.stringify(notification)}\n\n`);
      });
      request.signal.addEventListener("abort", unsub);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
```

---

### M2 — Bulk Employee Import / Export

**Gap:** There is no API for importing employees from CSV/Excel or exporting workforce data. Enterprise HCM systems universally need this.

**Recommended tRPC procedures:**

```typescript
employee.bulkImport  // mutation, guard
// input: { rows: CreateEmployeeSchema[], dryRun?: boolean }
// output: { created: number, skipped: number, errors: { row: number, message: string }[] }

employee.export  // query, guard
// input: { format: "csv" | "xlsx", filters?: EmployeeFiltersSchema }
// output: URL to download file from Vercel Blob
```

---

### M3 — Password Reset Flow

**Gap:** No password reset endpoint. Users who forget their password have no self-service recovery path.

**Recommended REST endpoints:**

```
POST /api/auth/reset-password/request
  body: { email: string }
  → Sends one-time reset link via email

POST /api/auth/reset-password/confirm
  body: { token: string, newPassword: string }
  → Validates token, updates password, invalidates sessions
```

---

### M4 — Employee Documents — Download Authenticated

**Gap:** `GET /api/documents/[id]/download` exists in the route structure but requires investigation. The upload endpoint uses spoofable headers rather than session auth. A properly authenticated download endpoint is needed.

**Recommended:**
```
GET /api/documents/[id]/download
  auth: __session cookie
  → Validates document belongs to tenant, returns signed URL or stream
```

---

## 🟠 High Priority Missing APIs

### M5 — EPF / SOCSO / LHDN Statutory Submissions

**Gap:** The `statutory` router exists but details are unclear. For a Malaysian payroll platform, official electronic submission to EPF (i-Akaun), SOCSO (mySOCSO), and LHDN (PCB/e-PCB) is mandatory.

**Recommended tRPC procedures:**

```typescript
statutory.generateEpfFile    // mutation — generate EPF TXT/CSV file
statutory.generateSocsoFile  // mutation — generate SOCSO submission
statutory.generatePcbFile    // mutation — generate LHDN PCB2 file
statutory.submitToLhdn       // mutation — POST to LHDN myTax API
```

---

### M6 — Payroll Run / Pay Period Management

**Gap:** The payroll router handles individual records, but there is no "run payroll for all employees in period X" batch procedure. Enterprise payroll needs a controlled batch run with lock/unlock.

**Recommended:**

```typescript
payroll.runBatch  // mutation, guard
// input: { periodStart, periodEnd, legalEntityId?, dryRun?: boolean }
// output: { processed: number, errors: PayrollError[], totalNetSalary: number }

payroll.lockPeriod    // mutation, guard — prevent edits after approval
payroll.unlockPeriod  // mutation, abac("payroll","approve") — re-open for corrections
```

---

### M7 — Leave Accrual / Year-End Carry Forward

**Gap:** Leave policies define `carryForwardMax`, but there is no procedure to run end-of-year accrual/carry-forward for all employees. Currently balances must be set manually.

**Recommended:**

```typescript
leave.runYearEndAccrual  // mutation, guard
// input: { year: number, legalEntityId?: string }
// output: { updated: number, carryForwardApplied: number, expired: number }
```

---

### M8 — Recruitment Full Pipeline

**Gap:** The `recruitment` router returns empty arrays for `pipeline` and `jdCreate` only creates an in-memory object. Full ATS functionality is absent.

**Recommended:**

```typescript
recruitment.createApplication   // mutation — candidate applies
recruitment.getApplications     // query — list with stage/status filters
recruitment.advanceStage        // mutation — move candidate to next stage
recruitment.makeOffer           // mutation — trigger offer letter generation
recruitment.generateJd          // mutation — AI-powered JD generation from role template
```

---

### M9 — Performance Review Full Cycle

**Gap:** `performance.createReview` only logs to console. Full performance management needs persistence, 360° reviews, calibration, and goal tracking.

**Recommended:**

```typescript
performance.createCycle          // mutation — define review period
performance.submitSelfAssessment // mutation — employee self-review
performance.submitPeerReview     // mutation — peer review submission
performance.submitManagerReview  // mutation — manager review
performance.calibrate            // mutation — HR calibration adjustment
performance.getGoals             // query — goal tracking
performance.setGoals             // mutation — set goals for next period
```

---

### M10 — FOMEMA Medical Screening Workflow

**Gap:** The `fomema` router exists but foreign worker FOMEMA medical screening requires integration with the official FOMEMA API for result retrieval.

**Recommended:**

```typescript
fomema.registerWorker    // mutation — register FW for FOMEMA examination
fomema.getResult         // query — fetch result from FOMEMA API
fomema.listPending       // query — workers with pending/overdue FOMEMA
```

---

## 🟡 Medium Priority Missing APIs

### M11 — Payslip Generation as PDF

**Gap:** `payroll.payslip` returns data but there is no endpoint to generate and download a PDF payslip. `@react-pdf/renderer` is installed — this is ready to implement.

```
GET /api/payroll/[id]/payslip.pdf
  auth: __session (employee can access own payslips only)
  → Returns PDF binary or redirect to Blob URL
```

---

### M12 — Geofence CRUD via API

**Gap:** The `geolocation/route.ts` returns hardcoded geofence data. Real geofence management (create, update, delete work zones) should be persisted in the DB.

```typescript
geolocation.createGeofence   // mutation — create work zone polygon
geolocation.updateGeofence   // mutation — edit boundaries/name
geolocation.deleteGeofence   // mutation — remove zone
geolocation.listGeofences    // query — list tenant zones with violation counts
```

---

### M13 — Audit Trail Export

**Gap:** The SIEM endpoint provides a raw stream but there is no formatted export for compliance reporting (e.g., LHDN audit, ISO 9001 audit).

```typescript
auditTrail.exportCsv   // mutation — generate CSV export to Blob storage
auditTrail.exportPdf   // mutation — generate PDF audit report
```

---

### M14 — Employee Offboarding Initiation

**Gap:** The offboarding routers handle clearance/settlement/exit interviews, but there is no procedure to formally initiate offboarding (link it to a termination record, trigger the checklists, and notify stakeholders).

```typescript
offboarding.initiate  // mutation, guard
// input: { terminationId }
// → creates ClearanceInstance, sends notifications to IT/HR/Finance
// → triggers workflow if enabled
```

---

### M15 — Tenant Provisioning API

**Gap:** There is no documented API for creating new tenants. The `admin` router may have this, but Super_Admin tenant management needs explicit endpoints.

```typescript
admin.createTenant   // mutation, abac("tenant","write")
admin.listTenants    // query, abac("tenant","read")
admin.updateTenant   // mutation, abac("tenant","write")
admin.suspendTenant  // mutation, abac("tenant","write")
```

---

## 🟢 Nice-to-Have

### M16 — Webhook Outbound (Event Subscriptions)

Allow tenants to register outbound webhook URLs to receive events (employee created, leave approved, payroll processed, etc.):

```typescript
webhooks.subscribe    // mutation — register webhook URL + events
webhooks.list         // query — list active subscriptions
webhooks.unsubscribe  // mutation — remove webhook
webhooks.testDelivery // mutation — send test event
```

---

### M17 — Rate Limiting Information Headers

All API responses should include rate limit headers for client awareness:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1722729600
```

---

### M18 — API Key Management for Integrations

Allow tenant admins to create and rotate API keys for SIEM and external integrations (currently `SIEM_API_KEY` is a single environment variable):

```typescript
apiKeys.create    // mutation — generate API key with scope
apiKeys.list      // query — list active keys (names only, no secrets)
apiKeys.revoke    // mutation — invalidate a key
```

---

## Summary Table

| # | API | Priority | Effort | Business Value |
|---|-----|----------|--------|---------------|
| M1 | Real-time notifications | 🔴 | Medium | High |
| M2 | Bulk employee import/export | 🔴 | High | High |
| M3 | Password reset flow | 🔴 | Low | High |
| M4 | Authenticated document download | 🔴 | Low | High |
| M5 | EPF/SOCSO/LHDN statutory | 🟠 | High | Critical (compliance) |
| M6 | Payroll batch run | 🟠 | High | High |
| M7 | Leave year-end accrual | 🟠 | Medium | High |
| M8 | Full recruitment pipeline | 🟠 | High | Medium |
| M9 | Performance review persistence | 🟠 | High | Medium |
| M10 | FOMEMA integration | 🟠 | Medium | High (FW compliance) |
| M11 | PDF payslip download | 🟡 | Low | Medium |
| M12 | Geofence CRUD | 🟡 | Medium | Medium |
| M13 | Audit trail export | 🟡 | Low | Medium |
| M14 | Offboarding initiation | 🟡 | Low | High |
| M15 | Tenant provisioning | 🟡 | Medium | Medium |
| M16 | Outbound webhooks | 🟢 | High | Low |
| M17 | Rate limit headers | 🟢 | Low | Low |
| M18 | API key management | 🟢 | Medium | Medium |
