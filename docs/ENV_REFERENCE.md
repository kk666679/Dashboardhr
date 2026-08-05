# Environment Variable Reference

> Cross-reference for `.env.example`. All variables validated at startup by `lib/env.ts` (Zod schema).
> Copy `.env.example` to `.env.local` and fill in your values.

---

## Quick Start Minimum

For local development you need at least:

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/aifwms
REDIS_URL=redis://localhost:6379
JWT_SECRET=<any-string-32-chars-or-more>
```

Everything else has a sensible default or is optional.

---

## Database

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ (or ORM_PRISMA_URL) | — | Standard PostgreSQL connection string. Used for local Docker Compose. Format: `postgresql://user:pass@host:5432/dbname` |
| `ORM_PRISMA_URL` | ✅ (or DATABASE_URL) | — | Prisma Accelerate / Neon serverless connection string. Takes precedence over `DATABASE_URL`. Format: `prisma://accelerate.prisma-data.net/?api_key=...` |
| `NEON_DATABASE_URL` | ⛳ | — | Neon serverless PostgreSQL. Alternative to `DATABASE_URL` for serverless deployments. |

**At least one of `DATABASE_URL` or `ORM_PRISMA_URL` must be provided.** The application will refuse to start in production if neither is set.

---

## Redis

| Variable | Required | Default | Description |
|---|---|---|---|
| `REDIS_URL` | ⛳ | `redis://localhost:6379` | Redis connection string. Used for: session storage (jose), BullMQ job queues (7 workers), Redis-backed rate limiting, per-tenant token budget tracking. |

Without Redis the app falls back to in-memory caches — these are lost on restart and don't work across multiple instances.

---

## Authentication

| Variable | Required | Default | Description |
|---|---|---|---|
| `JWT_SECRET` | ✅ | `dev-secret-...` (dev only) | HMAC signing secret for session JWTs. **Must be ≥ 32 characters in production.** Never commit the production value. |

---

## AI Providers

At least one provider is recommended for the AI Hub and OpenClaw agents.

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | ⛳ | — | OpenAI API key (starts with `sk-`). Used for GPT-4o-mini in chat, OCR, attrition scoring, payroll explainer, etc. |
| `ANTHROPIC_API_KEY` | ⛳ | — | Anthropic Claude key (starts with `sk-ant-`). Used for Claude 3.5 Sonnet in primary chat path; claude-3-haiku as fallback in AI agents. |
| `OLLAMA_API_URL` | ⛳ | — | Ollama local LLM base URL (e.g. `http://localhost:11434`). Used as final fallback when cloud providers are unavailable. |

Provider priority in `/api/ai/chat`: explicit `provider` param → Claude (if key present) → OpenAI → Ollama + RAG.

---

## File Uploads

| Variable | Required | Default | Description |
|---|---|---|---|
| `UPLOAD_DIR` | ⛳ | `./uploads` | Directory for uploaded files (relative to project root). Created automatically if it doesn't exist. |
| `MAX_FILE_SIZE` | ⛳ | `10485760` (10 MB) | Maximum upload size in bytes. |

---

## Security & Rate Limiting

| Variable | Required | Default | Description |
|---|---|---|---|
| `CORS_ALLOWED_ORIGINS` | ⛳ | `http://localhost:3000` | Comma-separated list of allowed CORS origins. Set to your production domain in production. |
| `RATE_LIMIT_REQUESTS` | ⛳ | `100` | Maximum API requests per 1-minute window per identifier (IP or tenant). |
| `TOKEN_BUDGET_PER_TENANT` | ⛳ | `100000` | Maximum AI tokens consumed per tenant per hour (used by `checkTenantBudget()`). |

---

## Multi-Tenancy

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_TENANT_ID` | ⛳ | — | Default tenant identifier. Used in single-tenant deployments or as a dev default. Exposed to the browser (NEXT_PUBLIC prefix). |

---

## Compliance & Audit

| Variable | Required | Default | Description |
|---|---|---|---|
| `AUDITOR_EMAIL` | ⛳ | `""` | Email address for compliance audit notifications (levy rate change alerts, regulatory circular notifications). Referenced in `lib/constants/levy-rates.ts`. |

---

## Secrets Management

| Variable | Required | Default | Description |
|---|---|---|---|
| `SECRETS_PROVIDER` | ⛳ | `env` | Secrets backend: `env` (default — read from process.env), `aws` (AWS Secrets Manager), or `azure` (Azure Key Vault). |

---

## OIDC / Single Sign-On

Configure whichever provider(s) your organisation uses. Leave others blank.

| Variable | Provider | Description |
|---|---|---|
| `NEXTAUTH_URL` | All | App base URL for OIDC callbacks (e.g. `https://your-app.com`). Required when using OIDC providers. |
| `ENTRA_TENANT_ID` | Microsoft Entra ID | Azure AD tenant GUID |
| `ENTRA_CLIENT_ID` | Microsoft Entra ID | Azure app registration client ID |
| `ENTRA_CLIENT_SECRET` | Microsoft Entra ID | Azure app registration client secret |
| `GOOGLE_CLIENT_ID` | Google | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google | Google OAuth client secret |
| `OKTA_ISSUER` | Okta | Okta issuer URL (e.g. `https://yourorg.okta.com`) |
| `OKTA_CLIENT_ID` | Okta | Okta application client ID |
| `OKTA_CLIENT_SECRET` | Okta | Okta application client secret |

---

## Build & Tooling

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANALYZE` | ⛳ | `false` | Set to `true` to enable `@next/bundle-analyzer` during `pnpm build`. Opens an interactive bundle size treemap. Run via `pnpm run analyze`. |
| `NODE_ENV` | ⛳ | `development` | Runtime environment. One of `development`, `production`, or `test`. Controls console output removal, lazy env validation, and loopback URL allowance in SSRF guard. |
| `NEXT_TELEMETRY_DISABLED` | ⛳ | — | Set to `1` to disable Next.js telemetry. Already set in CI. |

---

## Validation

`lib/env.ts` validates all variables at startup using a Zod schema:

- In **production**: invalid or missing required variables cause the process to exit immediately.
- In **development/test**: missing optional variables log a warning and the app continues.

Run `node -e "require('./lib/env').validateEnv()"` to check your `.env.local` before deploying.

---

## Related Files

- `.env.example` — copy of all variables with comments and placeholder values
- `lib/env.ts` — Zod schema + lazy parser
- `docs/CONTRIBUTING.md` — development setup guide
- `docs/SECURITY.md` — secrets rotation and security practices
