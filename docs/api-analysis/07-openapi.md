# 07 — OpenAPI 3.1 Specification

OpenAPI 3.1 specification for all REST endpoints (`app/api/**`). The tRPC layer is covered separately — see `03-trpc.md`.

---

```yaml
openapi: "3.1.0"
info:
  title: AIFWMS REST API
  description: |
    AI-powered Foreign Worker Management System — REST API layer.
    The primary API is tRPC (POST /api/trpc/{procedure}).
    This spec covers REST-only endpoints: auth, AI, documents, webhooks, SIEM, health, and integrations.
  version: "1.0.0"
  contact:
    name: AIFWMS API Team
    url: https://aifwms.xyz

servers:
  - url: https://aifwms.xyz
    description: Production
  - url: http://localhost:3000
    description: Development

tags:
  - name: Authentication
    description: Login, OIDC, MFA, session management
  - name: AI
    description: Chat, RAG, document analysis
  - name: Documents
    description: Document upload and download
  - name: Blob
    description: Vercel Blob storage proxy
  - name: Embeddings
    description: Text ingestion for semantic search
  - name: Geolocation
    description: Worker GPS tracking and geofences
  - name: Webhooks
    description: Inbound events from external systems
  - name: SIEM
    description: Audit event stream for SIEM integration
  - name: Regulatory
    description: Regulatory change management
  - name: SOPs
    description: Standard operating procedures
  - name: Health
    description: Readiness and liveness probes

components:
  securitySchemes:
    sessionCookie:
      type: apiKey
      in: cookie
      name: __session
      description: Redis-backed session cookie (httpOnly, secure, sameSite=strict)
    apiKey:
      type: apiKey
      in: header
      name: x-api-key
      description: API key for SIEM integration
    hmacSignature:
      type: apiKey
      in: header
      name: x-biometric-signature
      description: HMAC-SHA256 signature for biometric webhook (format: sha256=<hex>)

  schemas:
    Error:
      type: object
      required: [error]
      properties:
        error:
          type: string
          example: "Unauthorized"

    UserIdentity:
      type: object
      properties:
        id:
          type: string
        email:
          type: string
          format: email
        role:
          type: string
          enum: [Super_Admin, HR_Director, HR_Manager, Payroll_Manager, Compliance_Officer, Manager, EMPLOYEE, ADMIN, HR]
        tenantId:
          type: string

    SessionResponse:
      type: object
      properties:
        user:
          oneOf:
            - $ref: "#/components/schemas/UserIdentity"
            - type: "null"

    LoginRequest:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
          format: email
        password:
          type: string
          minLength: 1

    LoginSuccess:
      type: object
      properties:
        success:
          type: boolean
          example: true
        userId:
          type: string
        role:
          type: string

    LoginMfaChallenge:
      type: object
      properties:
        mfaRequired:
          type: boolean
          example: true
        tempToken:
          type: string
          description: Signed JWT valid for 10 minutes, required to complete MFA

    MfaVerifyRequest:
      type: object
      required: [tempToken, method]
      properties:
        tempToken:
          type: string
        method:
          type: string
          enum: [totp, sms, webauthn]
        code:
          type: string
          description: Required for totp and sms methods

    ChatRequest:
      type: object
      required: [message]
      properties:
        message:
          type: string
          minLength: 1
          maxLength: 8000
        sessionId:
          type: string
          default: default
        employeeId:
          type: string
        persona:
          type: string
          enum: [orchestrator, hr, payroll, compliance, recruitment, onboarding, offboarding, analytics]
          default: orchestrator
        provider:
          type: string
          enum: [claude, openai, ollama]

    DocumentMetadata:
      type: object
      properties:
        id:
          type: string
        type:
          type: string
        status:
          type: string
          enum: [PENDING, APPROVED, REJECTED, EXPIRED]

    BlobUploadRequest:
      type: object
      required: [content, filename]
      properties:
        content:
          type: string
        filename:
          type: string
          minLength: 1
          maxLength: 255

    EmbeddingsIngestRequest:
      type: object
      required: [documentId, text]
      properties:
        documentId:
          type: string
          minLength: 1
        text:
          type: string
          minLength: 1
          maxLength: 50000

    WorkerLocation:
      type: object
      properties:
        id:
          type: string
          example: "W-2024-001"
        name:
          type: string
        location:
          type: string
        status:
          type: string
          enum: [active, alert, offline]
        battery:
          type: integer
          minimum: 0
          maximum: 100
        signal:
          type: integer
          minimum: 0
          maximum: 5
        lastUpdate:
          type: string
        coordinates:
          type: object
          properties:
            lat:
              type: number
            lng:
              type: number

    Geofence:
      type: object
      properties:
        name:
          type: string
        type:
          type: string
          enum: [work, restricted, housing]
        status:
          type: string
          enum: [active, violation]
        workers:
          type: integer
        alerts:
          type: integer
        coordinates:
          type: array
          items:
            type: array
            items:
              type: array
              items:
                type: number

    GeolocationResponse:
      type: object
      properties:
        workers:
          type: array
          items:
            $ref: "#/components/schemas/WorkerLocation"
        geofences:
          type: array
          items:
            $ref: "#/components/schemas/Geofence"
        activeTrackers:
          type: integer
        timestamp:
          type: string
          format: date-time

    BiometricEvent:
      type: object
      required: [deviceId, deviceEmployeeId, tenantId, timestamp, eventType, confidenceScore]
      properties:
        deviceId:
          type: string
        deviceEmployeeId:
          type: string
        tenantId:
          type: string
        timestamp:
          type: string
          format: date-time
        eventType:
          type: string
          enum: [CLOCK_IN, CLOCK_OUT]
        confidenceScore:
          type: number
          minimum: 0
          maximum: 100
        metadata:
          type: object
          additionalProperties: true

    AuditEvent:
      type: object
      properties:
        id:
          type: string
        createdAt:
          type: string
          format: date-time
        entityType:
          type: string
        action:
          type: string
          enum: [CREATE, UPDATE, DELETE, READ]
        actorId:
          type: string
        tenantId:
          type: string
        ipAddress:
          type: string
        module:
          type: string

    HealthResponse:
      type: object
      properties:
        status:
          type: string
          enum: [ok, error]
        db:
          type: string
          enum: [connected, disconnected]
        timestamp:
          type: string
          format: date-time

    RegulatoryChangeRequest:
      type: object
      required: [tenantId, title]
      properties:
        tenantId:
          type: string
        title:
          type: string
        description:
          type: string
        referenceNo:
          type: string
        oldContent:
          type: string
        newContent:
          type: string
        sourceUrl:
          type: string
          format: uri
        effectiveDate:
          type: string
          format: date
        implementationDeadline:
          type: string
          format: date

paths:

  # ── Authentication ──────────────────────────────────────────────────────────

  /api/auth/{action}:
    post:
      tags: [Authentication]
      summary: Authentication actions (login, logout, OIDC callback)
      parameters:
        - name: action
          in: path
          required: true
          schema:
            type: string
            enum: [login, logout, callback]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              oneOf:
                - $ref: "#/components/schemas/LoginRequest"
      responses:
        "200":
          description: Login success or MFA challenge
          content:
            application/json:
              schema:
                oneOf:
                  - $ref: "#/components/schemas/LoginSuccess"
                  - $ref: "#/components/schemas/LoginMfaChallenge"
        "400":
          description: Missing credentials
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "401":
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
    get:
      tags: [Authentication]
      summary: Session check or OIDC signin redirect
      parameters:
        - name: action
          in: path
          required: true
          schema:
            type: string
            enum: [session, signin]
      security:
        - sessionCookie: []
      responses:
        "200":
          description: Current session
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/SessionResponse"
        "302":
          description: Redirect to OIDC provider

  /api/auth/mfa:
    post:
      tags: [Authentication]
      summary: Verify MFA code
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/MfaVerifyRequest"
      responses:
        "200":
          description: MFA verified, full session created
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  userId:
                    type: string
        "401":
          description: Invalid or expired MFA code
    put:
      tags: [Authentication]
      summary: Setup TOTP (enroll authenticator app)
      security:
        - sessionCookie: []
      responses:
        "200":
          description: TOTP secret and OTP auth URL
          content:
            application/json:
              schema:
                type: object
                properties:
                  secret:
                    type: string
                  otpauthUrl:
                    type: string

  # ── AI ──────────────────────────────────────────────────────────────────────

  /api/ai/chat:
    post:
      tags: [AI]
      summary: Streaming AI chat
      description: |
        Streams AI responses via Server-Sent Events. Supports Claude, OpenAI, and Ollama.
        **⚠️ Currently unauthenticated — requires auth fix (see security review).**
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ChatRequest"
      responses:
        "200":
          description: Streaming response (text/event-stream) or JSON fallback
          content:
            text/event-stream:
              schema:
                type: string
            application/json:
              schema:
                type: object
                properties:
                  answer:
                    type: string
        "400":
          description: Invalid request body
        "503":
          description: LLM provider unavailable

  # ── Documents ───────────────────────────────────────────────────────────────

  /api/documents/upload:
    post:
      tags: [Documents]
      summary: Upload an employee document
      description: |
        **⚠️ Auth is header-based (X-Employee-ID, X-Tenant-ID) — not session-based. Needs fix.**
      parameters:
        - name: X-Employee-ID
          in: header
          required: true
          schema:
            type: string
        - name: X-Tenant-ID
          in: header
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              required: [file, documentType]
              properties:
                file:
                  type: string
                  format: binary
                documentType:
                  type: string
                expiryDate:
                  type: string
                  format: date
      responses:
        "201":
          description: Document uploaded
          content:
            application/json:
              schema:
                type: object
                properties:
                  document:
                    $ref: "#/components/schemas/DocumentMetadata"
        "400":
          description: Missing file or documentType
        "500":
          description: Upload failed
    get:
      tags: [Documents]
      summary: List documents for an employee
      parameters:
        - name: X-Employee-ID
          in: header
          required: true
          schema:
            type: string
        - name: X-Tenant-ID
          in: header
          required: true
          schema:
            type: string
      responses:
        "200":
          description: List of documents
          content:
            application/json:
              schema:
                type: object
                properties:
                  documents:
                    type: array
                    items:
                      $ref: "#/components/schemas/DocumentMetadata"

  # ── Blob Storage ─────────────────────────────────────────────────────────────

  /api/blob:
    post:
      tags: [Blob]
      summary: Upload content to Vercel Blob
      security:
        - sessionCookie: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/BlobUploadRequest"
      responses:
        "200":
          description: Vercel Blob object
    get:
      tags: [Blob]
      summary: Download from Vercel Blob
      security:
        - sessionCookie: []
      parameters:
        - name: pathname
          in: query
          required: true
          schema:
            type: string
      responses:
        "200":
          description: File content
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
        "401":
          description: Unauthorized
        "404":
          description: Not found

  # ── Embeddings ───────────────────────────────────────────────────────────────

  /api/embeddings/ingest:
    post:
      tags: [Embeddings]
      summary: Ingest document text for semantic search
      description: "⚠️ Currently unauthenticated — requires auth fix."
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/EmbeddingsIngestRequest"
      responses:
        "200":
          description: Document updated with text
          content:
            application/json:
              schema:
                type: object
                properties:
                  ok:
                    type: boolean
                  document:
                    $ref: "#/components/schemas/DocumentMetadata"
        "400":
          description: Validation error

  # ── Geolocation ──────────────────────────────────────────────────────────────

  /api/geolocation:
    get:
      tags: [Geolocation]
      summary: Get worker locations and geofence data
      description: "⚠️ Currently unauthenticated — requires auth fix."
      responses:
        "200":
          description: Worker locations and geofences
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GeolocationResponse"
    post:
      tags: [Geolocation]
      summary: Submit worker location update
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
      responses:
        "200":
          description: Success

  # ── Webhooks ─────────────────────────────────────────────────────────────────

  /api/webhooks/biometric:
    post:
      tags: [Webhooks]
      summary: Receive biometric clock event from hardware terminal
      security:
        - hmacSignature: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/BiometricEvent"
      responses:
        "202":
          description: Event accepted and queued
          content:
            application/json:
              schema:
                type: object
                properties:
                  accepted:
                    type: boolean
                    example: true
        "401":
          description: Invalid HMAC signature
        "422":
          description: Confidence score below threshold
          content:
            application/json:
              schema:
                type: object
                properties:
                  accepted:
                    type: boolean
                    example: false
                  reason:
                    type: string

  # ── SIEM ─────────────────────────────────────────────────────────────────────

  /api/siem:
    get:
      tags: [SIEM]
      summary: Stream audit events to SIEM
      security:
        - apiKey: []
      parameters:
        - name: tenantId
          in: query
          required: true
          schema:
            type: string
        - name: format
          in: query
          schema:
            type: string
            enum: [json, cef]
            default: json
        - name: since
          in: query
          schema:
            type: string
            format: date-time
            description: Return events after this timestamp (for incremental pulls)
      responses:
        "200":
          description: Audit events
          content:
            application/json:
              schema:
                type: object
                properties:
                  events:
                    type: array
                    items:
                      $ref: "#/components/schemas/AuditEvent"
                  count:
                    type: integer
            text/plain:
              schema:
                type: string
                description: CEF 0.1 format, one event per line
        "400":
          description: Missing tenantId
        "401":
          description: Invalid API key

  # ── Regulatory ────────────────────────────────────────────────────────────────

  /api/regulatory/changes:
    post:
      tags: [Regulatory]
      summary: Trigger regulatory change pipeline
      description: "⚠️ Currently unauthenticated."
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/RegulatoryChangeRequest"
      responses:
        "200":
          description: Pipeline result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
        "400":
          description: Missing required fields
        "500":
          description: Pipeline error
    get:
      tags: [Regulatory]
      summary: List regulatory changes
      description: "⚠️ Currently unauthenticated."
      parameters:
        - name: tenantId
          in: query
          schema:
            type: string
        - name: status
          in: query
          schema:
            type: string
        - name: limit
          in: query
          schema:
            type: integer
            maximum: 200
            default: 50
      responses:
        "200":
          description: List of regulatory changes

  # ── SOPs ─────────────────────────────────────────────────────────────────────

  /api/sops:
    get:
      tags: [SOPs]
      summary: Search standard operating procedures
      description: "⚠️ Currently unauthenticated."
      parameters:
        - name: q
          in: query
          schema:
            type: string
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
      responses:
        "200":
          description: Search results
          content:
            application/json:
              schema:
                type: object
                properties:
                  query:
                    type: string
                  results:
                    type: array
                    items:
                      type: object

  # ── Health ────────────────────────────────────────────────────────────────────

  /api/health:
    get:
      tags: [Health]
      summary: Readiness probe
      description: Checks PostgreSQL connectivity. Used by k8s/load balancer.
      security: []
      responses:
        "200":
          description: Ready
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/HealthResponse"
        "503":
          description: Database unavailable

  /api/health/live:
    get:
      tags: [Health]
      summary: Liveness probe
      security: []
      responses:
        "200":
          description: Alive
```
