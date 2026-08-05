# 02 — REST Endpoints Deep Dive

Per-endpoint documentation for all Next.js Route Handlers under `app/api/`.

---

## Authentication Endpoints

### `POST /api/auth/[...nextauth]/login`

Local credential login. Returns a session cookie on success.

**Auth:** None  
**Request body:**
```json
{ "email": "user@example.com", "password": "secret" }
```
**Response 200 (no MFA):**
```json
{ "success": true, "userId": "usr_abc", "role": "HR_Manager" }
```
**Response 200 (MFA required):**
```json
{ "mfaRequired": true, "tempToken": "<signed-jwt-10m>" }
```
**Response 401:** `{ "error": "Invalid credentials" }`  
**Cookie set:** `__session` (httpOnly, secure, sameSite=strict, maxAge=8h)  
**Notes:** Plain-text password comparison in dev (`password === "dev-password"` bypass exists). MFA is enforced for roles in `MFA_REQUIRED_ROLES`.

---

### `POST /api/auth/[...nextauth]/logout`

Destroys the Redis session and clears the cookie.

**Auth:** Cookie `__session`  
**Response 200:** `{ "success": true }`

---

### `GET /api/auth/[...nextauth]/session`

Returns the authenticated user's identity.

**Auth:** Cookie `__session`  
**Response 200:** `{ "user": { "id": "...", "email": "...", "role": "...", "tenantId": "..." } }` or `{ "user": null }`

---

### `GET /api/auth/[...nextauth]/signin/[provider]`

Initiates OIDC flow. Supported providers: `entra` (Microsoft Entra ID), `google`, `okta`.

**Auth:** None  
**Redirect:** To provider authorization URL  
**Required env vars per provider:**

| Provider | Env vars |
|----------|----------|
| `entra` | `ENTRA_TENANT_ID`, `ENTRA_CLIENT_ID`, `ENTRA_CLIENT_SECRET` |
| `google` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| `okta` | `OKTA_ISSUER`, `OKTA_CLIENT_ID`, `OKTA_CLIENT_SECRET` |

---

### `POST /api/auth/[...nextauth]/callback/[provider]`

OIDC authorization code exchange. Auto-provisions users on first login.

**Auth:** None (carries `code` in query string)  
**Response:** Redirect to `/{locale}/dashboard` with session cookie

---

### `POST /api/auth/mfa`

Verify an MFA code after initial login returned `mfaRequired: true`.

**Auth:** None (carries `tempToken` in body)  
**Request body:**
```json
{
  "tempToken": "<10-min-jwt>",
  "method": "totp",
  "code": "123456"
}
```
**Methods:** `totp` | `sms` | `webauthn`  
**Response 200:** `{ "success": true, "userId": "..." }` + sets full session cookie  
**Response 401:** `{ "error": "Invalid MFA code" }`  
**⚠️ Issue:** `webauthn` method always returns `verified = false` (stub, never completes).

---

### `PUT /api/auth/mfa`

Enroll TOTP — generates a secret and OTP auth URL for authenticator apps.

**Auth:** Cookie `__session`  
**Response 200:**
```json
{
  "secret": "[STORED_SECURELY]",
  "otpauthUrl": "otpauth://totp/..."
}
```
**⚠️ Issue:** Returns raw secret in non-production environments.

---

## AI Endpoints

### `POST /api/ai/chat`

Streaming AI chat. Supports multiple LLM backends with automatic fallback.

**Auth:** ⚠️ None — no session check  
**Request body:**
```json
{
  "message": "What is the EPF rate for 2025?",
  "sessionId": "sess_123",
  "employeeId": "emp_456",
  "persona": "orchestrator",
  "provider": "claude"
}
```
**Parameters:**
- `message` (required): 1–8,000 characters
- `sessionId` (optional, default `"default"`): in-memory chat history key
- `persona` (optional, default `"orchestrator"`): agent system prompt
- `provider` (optional): `claude` | `openai` | `ollama` (auto-selected by key availability)

**Response (streaming):** `text/event-stream` with `UIMessageStream` chunks  
**Response (Ollama fallback):** `{ "answer": "..." }` (non-streaming)  
**Provider priority:** explicit → Claude → OpenAI → Ollama+RAG  
**⚠️ Issue:** No auth — anyone can query the AI.

---

## Document Management

### `POST /api/documents/upload`

Upload an employee document (multipart/form-data).

**Auth:** Headers `X-Employee-ID` and `X-Tenant-ID` (not session-based)  
**Request:** `multipart/form-data`
```
file: <File>
documentType: "PASSPORT" | "WORK_PERMIT" | "CONTRACT" | ...
expiryDate: "2026-12-31" (optional ISO string)
```
**Response 201:**
```json
{ "document": { "id": "...", "type": "PASSPORT", "status": "PENDING" } }
```
**⚠️ Issue:** Auth is header-based with no signature — trivially spoofable.

---

### `GET /api/documents/upload`

List documents for an employee.

**Auth:** Headers `X-Employee-ID` and `X-Tenant-ID`  
**Response 200:**
```json
{ "documents": [ { "id": "...", "type": "...", "status": "..." } ] }
```

---

### `GET /api/documents/[id]/download`

Download a document by ID.

**Auth:** Unknown (route file not read)  
**Response:** Binary file stream or signed URL redirect

---

## Blob Storage

### `POST /api/blob`

Upload content to Vercel Blob storage.

**Auth:** Cookie `__session`  
**Request body:**
```json
{ "content": "text content...", "filename": "articles/doc.txt" }
```
**Response 200:** Vercel Blob object (includes `url`, `downloadUrl`, `contentType`, `size`)  
**Env required:** `BLOB_READ_WRITE_TOKEN`

---

### `GET /api/blob?pathname=articles/doc.txt`

Download from Vercel Blob with session gate.

**Auth:** Cookie `__session`  
**Query param:** `pathname` (required)  
**Response:** Binary stream with `Content-Type` and `X-Content-Type-Options: nosniff`

---

## Embeddings

### `POST /api/embeddings/ingest`

Store document text content for semantic search.

**Auth:** ⚠️ None  
**Request body:**
```json
{ "documentId": "doc_abc", "text": "full text content up to 50k chars" }
```
**Response 200:**
```json
{ "ok": true, "document": { "id": "...", "type": "...", "status": "..." } }
```
**⚠️ Issue:** No authentication — anyone can overwrite document text.

---

## Geolocation

### `GET /api/geolocation`

Returns worker locations and geofence data.

**Auth:** ⚠️ None  
**Response 200:**
```json
{
  "workers": [{ "id": "W-2024-001", "name": "Ahmad Rahman", "status": "active", "coordinates": { "lat": 3.139, "lng": 101.6869 } }],
  "geofences": [...],
  "activeTrackers": 2378,
  "timestamp": "2026-08-03T..."
}
```
**⚠️ Issue:** No auth + mock data with real Malaysian coordinates.

---

### `POST /api/geolocation`

Accept location update (stub — logs body only).

**Auth:** ⚠️ None  
**Response 200:** `{ "success": true }`

---

## Health

### `GET /api/health`

Readiness probe: pings PostgreSQL.

**Auth:** None (intentional — for k8s/load balancer)  
**Response 200:** `{ "status": "ok", "db": "connected", "timestamp": "..." }`  
**Response 503:** `{ "status": "error", "db": "disconnected", "message": "..." }`

### `GET /api/health/live`

Liveness probe (simple 200 response).

---

## Webhooks

### `POST /api/webhooks/biometric`

Receives clock events from hardware biometric terminals.

**Auth:** HMAC-SHA256 signature verification  
**Header:** `x-biometric-signature: sha256=<hex>`  
**Request body:**
```json
{
  "deviceId": "term-001",
  "deviceEmployeeId": "EMP-123",
  "tenantId": "tenant_abc",
  "timestamp": "2026-08-03T08:00:00Z",
  "eventType": "CLOCK_IN",
  "confidenceScore": 95.5,
  "metadata": {}
}
```
**Response 202:** `{ "accepted": true }` — event queued to BullMQ `attendance` queue  
**Response 401:** Invalid HMAC signature  
**Response 422:** Confidence score below threshold (default 75%)  
**Env:** `BIOMETRIC_WEBHOOK_SECRET`, `BIOMETRIC_CONFIDENCE_THRESHOLD`  
**Queue options:** 3 attempts, exponential backoff 1s

---

### `POST /api/webhooks/background-check`

Receives background check results from external provider.

---

## SIEM Integration

### `GET /api/siem?tenantId=...&format=json&since=2026-01-01T00:00:00Z`

Streams audit events to a SIEM system.

**Auth:** API Key (`x-api-key` header, compared to `SIEM_API_KEY` env)  
**Query params:**
- `tenantId` (required)
- `format`: `json` (default) | `cef`
- `since`: ISO timestamp for incremental pulls

**Response (json):**
```json
{ "events": [...], "count": 150 }
```
**Response (cef):** `text/plain` in CEF 0.1 format:
```
CEF:0|HCM Platform|AuditTrail|1.0|UPDATE|User UPDATE|5|rt=... suser=... tenantId=...
```
**Max records:** 1000 per request  
**⚠️ Issue:** No pagination — only returns latest 1000 with no cursor.

---

## Regulatory

### `POST /api/regulatory/changes`

Trigger the 10-step regulatory change detection pipeline for a tenant.

**Auth:** ⚠️ None  
**Request body:**
```json
{
  "tenantId": "t_abc",
  "title": "Employment Act Amendment 2025",
  "description": "...",
  "referenceNo": "EA-2025-001",
  "oldContent": "...",
  "newContent": "...",
  "sourceUrl": "https://...",
  "effectiveDate": "2025-01-01",
  "implementationDeadline": "2025-06-01"
}
```
**Response 200:** `{ "success": true, ...pipelineResult }`

---

### `GET /api/regulatory/changes?tenantId=...&status=...&limit=50`

List regulatory changes.

**Auth:** ⚠️ None  
**Query params:** `tenantId`, `status`, `limit` (max 200)  
**Response:** `{ "success": true, "changes": [...], "total": N }`

---

## SOPs

### `GET /api/sops?q=safety&limit=10`

Search Standard Operating Procedures.

**Auth:** ⚠️ None  
**Query params:** `q` (search query), `limit` (default 10)  
**Response:** `{ "query": "safety", "results": [...] }`

---

## Accounting Enhanced

### `POST /api/accounting-enhanced/einvoice`

Generate an e-invoice (Malaysian MyInvois format).

---

## OpenAPI

### `GET /api/openapi`

Returns the OpenAPI 3.1 specification (auto-generated from route handlers).

---

## ISO Quality Management

### `GET/POST /api/iso/audit/checklist`
### `GET/POST /api/iso/audit/plan`
### `POST /api/iso/capa/5whys`
### `GET /api/iso/compliance/gap`
### `GET /api/iso/compliance/score`
### `GET /api/iso/risk/climate`
### `GET/POST /api/iso/risk/matrix`

ISO 9001/45001 audit management endpoints. Auth requirements vary per endpoint.

---

## Common Response Patterns

All REST endpoints follow Next.js Response conventions:

**Success:**
```json
{ "data": ..., "status": 200 }
```

**Validation error:**
```json
{ "error": "Description", "status": 400 }
```

**Auth error:**
```json
{ "error": "Unauthorized", "status": 401 }
```

**Not found:**
```json
{ "error": "Not found", "status": 404 }
```

**Server error:**
```json
{ "error": "message", "status": 500 }
```
