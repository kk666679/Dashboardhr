# Security

## Access Control

### Multi-Tenant Scoping
- All data operations are scoped to a tenant via `NEXT_PUBLIC_TENANT_ID`
- Tenant-aware queries prevent cross-tenant data leakage
- Tenant context is verified at every API layer

### Role-Based Access Control (RBAC)
- RBAC context exists in the frontend at `contexts/RBACContext.tsx` (note: this may need to be migrated to the new structure)
- User roles determine UI visibility and action permissions

### Attribute-Based Access Control (ABAC)
- **Implementation**: `lib/security/abac.ts` — Core ABAC policy evaluation engine
- **Middleware**: `server/middleware/abac.ts` — Request-level ABAC enforcement
- ABAC policies evaluate attributes including: user role, department, resource type, action, and context (time, location, etc.)

### Row-Level Security (RLS)
- **Middleware**: `server/middleware/rls.ts` — Enforces row-level filtering
- Ensures users can only access data rows within their tenant scope
- Complements Prisma's query-level filtering

## Network Security

### Rate Limiting
- **Implementation**: `lib/security/rate-limit.ts`
- Configurable rate limits per endpoint, per user, and per IP
- Prevents API abuse and brute-force attacks

### SSRF Protection
- **Implementation**: `lib/security/ssrf.ts`
- Server-Side Request Forgery protection for outbound HTTP requests
- Validates and restricts target URLs to allowed domains

### XSS Protection
- **Implementation**: `lib/security/xss.ts`
- Input sanitization to prevent Cross-Site Scripting attacks
- Uses `dompurify` for client-side sanitization
- Server-side validation complements client-side protection

## Authentication

### Framework
- Uses **NextAuth.js** for authentication (`/api/auth/[...nextauth]`)
- Session management via JWT or database sessions

### Multi-Factor Authentication (MFA)
- **Endpoint**: `/api/auth/mfa`
- **Library**: `otplib` for TOTP (Time-based One-Time Password) generation and verification
- MFA enrollment and verification flows supported

### Session Management
- **Implementation**: `lib/session/index.ts`
- Secure session handling with configurable expiry
- Session validation on every authenticated request

## Secrets Management

### Architecture
The system supports multiple secrets providers, configured via `SECRETS_PROVIDER` environment variable:

| Provider | Value | Library |
|---|---|---|
| Environment Variables | `env` | `process.env` (local development) |
| AWS Secrets Manager | `aws` | `@aws-sdk/client-secrets-manager` |
| Azure Key Vault | `azure` | `@azure/keyvault-secrets` |

### Implementation
- **Abstraction layer**: `lib/secrets/index.ts` — Unified API for all providers
- **Server-only**: All secrets access is restricted to server-side code via `config/server-env.ts` and the `getRequiredServerEnv` utility
- **Validation**: Environment variables can be validated with patterns, min/max length, and custom validators

## Error Handling

- **Implementation**: `lib/security/error-handler.ts`
- Structured error responses that avoid leaking sensitive information
- Security-relevant errors are logged for audit purposes
- Stack traces are suppressed in production

## Compliance & Auditability

### Audit Trail
- Auditable actions are tracked through server middleware
- Audit log storage and querying available via the dashboard (`/dashboard/audit-trail`)
- tRPC router: `server/routers/auditTrail.ts` for audit event queries

### Path Security
- **Implementation**: `lib/security/path.ts`
- Path traversal protection for file operations
- Validates and sanitizes file paths before access

## Information Security (ISO 27001)

The system includes modules aligned with ISO 27001 requirements:
- Risk assessment matrix (`/api/iso/risk/matrix`)
- Climate risk assessment (`/api/iso/risk/climate`)
- Compliance scoring (`/api/iso/compliance/score`)
- Gap analysis (`/api/iso/compliance/gap`)
- Security event logging via SIEM endpoint (`/api/siem`)

## Best Practices

### For Developers

1. **Never expose secrets** through client-side code or `NEXT_PUBLIC_*` variables
2. **Use tRPC** for type-safe API calls instead of raw `fetch()`
3. **Validate all inputs** with Zod schemas before processing
4. **Keep server-only logic** in `lib/`, `server/`, or `services/` directories
5. **Apply tenant scoping** to all database queries
6. **Handle errors gracefully** without leaking internal details
7. **Log security events** for audit trail completeness

### For Production Deployments

1. Use a managed secrets provider (AWS Secrets Manager or Azure Key Vault)
2. Enable rate limiting on all public endpoints
3. Configure proper CORS settings
4. Use HTTPS in production
5. Regularly rotate API keys and secrets
6. Monitor audit trails for suspicious activity
7. Keep dependencies updated (especially security-related packages)
