# FAQ

## General

### What is AiFWMS?
AiFWMS (AI Foreign Worker Management System) is an enterprise-grade Malaysian HR platform designed for foreign worker compliance, permit and visa lifecycle management, payroll support, geolocation attendance tracking, and AI-powered HR orchestration.

### Is the system multi-tenant?
Yes. Tenant scoping is built into the architecture via `NEXT_PUBLIC_TENANT_ID`. All data access is scoped to prevent cross-tenant leakage, enforced through ABAC and RLS middleware.

### What is the tech stack?
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 6, Tailwind CSS 4
- **Backend**: Next.js Route Handlers, tRPC 11, Zod validation
- **Database**: PostgreSQL 16 with pgvector extension, Prisma 7 ORM
- **AI**: Vercel AI SDK, OpenAI, Anthropic Claude, Ollama
- **Queues**: BullMQ 5 + Redis 7
- **Security**: NextAuth.js, ABAC, RLS, rate limiting, SSRF/XSS protection
- **Containerization**: Docker, Docker Compose

## AI & Machine Learning

### Which AI providers are supported?
Three providers are supported:
1. **OpenAI** — GPT-4o and embeddings via `@ai-sdk/openai`
2. **Anthropic Claude** — Claude models via `@ai-sdk/anthropic`
3. **Ollama** — Local LLM inference via `@langchain/ollama`

### What is the AI Orchestrator?
The HR Orchestrator (`/api/hr-orchestrator`) is a multi-agent system that routes user queries to specialized domain agents (payroll, compliance, recruitment, immigration, etc.) based on the query context. It also integrates with a RAG (Retrieval-Augmented Generation) pipeline for knowledge base queries.

### What is the RAG pipeline?
The RAG pipeline retrieves relevant context from the knowledge base using pgvector embeddings, then enriches LLM prompts with that context for more accurate, domain-specific responses. Endpoints: `/api/ai/rag`, `/api/kb/search`.

## Internationalization

### How many languages are supported?
9 languages are currently supported:
- English (`en`), Bahasa Melayu (`ms`), 中文 (`zh`), Español (`es`), Bahasa Indonesia (`id`), ภาษาไทย (`th`), Filipino (`ph`), Tiếng Việt (`vt`), العربية (`ar`)

### Is RTL supported?
Yes. Arabic (`ar`) uses right-to-left text direction. The `i18n/config.ts` file centralizes RTL configuration.

### How do I add a new locale?
Add the locale code to the `LOCALES` array in `i18n/config.ts`, configure its BCP-47 mapping and formatting options, then create translation files in `i18n/locales/[code]/`.

## Workers & Background Jobs

### What background workers are available?
6 BullMQ workers handle async processing:
- **leave.worker** — Leave request processing and approvals
- **notification.worker** — Email, in-app, and push notifications
- **payroll.worker** — Payroll execution and payslip generation
- **retention.worker** — Employee retention analytics
- **statutory.worker** — EPF, SOCSO, EIS, PCB calculations
- **workflow.worker** — Automation workflow execution

### How do I start workers?
```bash
# All workers
npx tsx workers/index.ts

# Individual worker
npx tsx workers/leave.worker.ts
```

## ISO & Quality Management

### What ISO standards are supported?
The system supports ISO 9001 (Quality Management) and ISO 27001 (Information Security) frameworks through dedicated modules under `/iso/` and `/automation/qms/`.

### What quality tools are available?
- Audit checklists and planning
- CAPA (Corrective and Preventive Actions)
- 5 Whys root cause analysis
- Fishbone (Ishikawa) diagrams
- Gap analysis
- Compliance scoring
- Risk assessment matrix
- Climate risk assessment

## CAPEX & OPEX

### What is CAPEX?
The CAPEX module manages capital expenditure including asset tracking, project management, budget planning, and ROI analysis. Route: `/capex/`

### What is OPEX?
The OPEX (Operational Excellence) module includes:
- **Lean** — Waste reduction and process optimization
- **Six Sigma** — DMAIC methodology and statistical process control
- **Kaizen** — Continuous improvement tracking
- **Kanban** — Visual workflow management
- **Analytics** — Performance metrics and dashboards

Route: `/opex/`

## Accounting

### What accounting features are available?
- Invoice management (create, track, export)
- Delivery orders
- Credit and debit notes
- Payroll processing and calculator
- E-invoice (LHDN-compliant)
- Tax calculator
- Government submissions
- Financial reports
- Enhanced dashboard with analytics

Route: `/accounting/`

## WindowDownloader (Desktop App)

### What is WindowDownloader?
WindowDownloader is an Electron-based desktop application that provides offline access to certain FWMS features. It is located in the `WindowDownloader/` directory.

### How do I build WindowDownloader?
```bash
cd WindowDownloader
npm install
npm run build
```

## Security

### How is authentication handled?
Authentication uses NextAuth.js with support for MFA (TOTP) via the `/api/auth/mfa` endpoint.

### How is authorization enforced?
Authorization uses Attribute-Based Access Control (ABAC) defined in `lib/security/abac.ts`, enforced through `server/middleware/abac.ts`. Row-Level Security (RLS) middleware in `server/middleware/rls.ts` provides additional data-level filtering.

### How are secrets managed?
Secrets can be stored in environment variables (`SECRETS_PROVIDER=env`), AWS Secrets Manager (`SECRETS_PROVIDER=aws`), or Azure Key Vault (`SECRETS_PROVIDER=azure`).

## Troubleshooting

### How do I run local development?
See [QUICK_START.md](./QUICK_START.md) for complete setup instructions.

### Build fails with TypeScript errors
Run `npm run typecheck` to identify issues. Check `CHANGELOG.md` Sprint 1 for known issues and fixes.

### AI features return errors
Ensure your API keys are set (at minimum `OPENAI_API_KEY`). For local development without API keys, you can use Ollama as a local LLM alternative.

### Prisma connection fails
Verify PostgreSQL is running and `DATABASE_URL` is correct. With Docker Compose, wait for the health check to pass before starting the app.
