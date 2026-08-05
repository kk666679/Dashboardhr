# Quick Start

This document contains local developer instructions for the AiFWMS platform.

## Prerequisites

- **Node.js** 22+ (project uses Node 22 in Docker)
- **npm** 10+ (or pnpm/yarn as alternatives)
- **Git**
- **PostgreSQL** 16+ with pgvector extension (local via Docker Compose)
- **Redis** 7+ (local via Docker Compose)
- **Docker** & **Docker Compose** (recommended for infrastructure)

## Installation

### Local Development

```bash
# Clone the repository
git clone https://github.com/mafieq737/fwms.git
cd fwms

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Start development server
npm run dev
```

### Run with Docker Compose (Full Stack)

```bash
docker-compose up
```

This starts:
- **`postgres`** — PostgreSQL 16 with pgvector extension
- **`redis`** — Redis 7 (Alpine) with LRU eviction (max 512mb)
- **`app`** — Next.js 16 application (port 3000)
- **`worker`** — BullMQ background worker for async task processing

### Run Workers Independently

```bash
# Start all workers via tsx
npx tsx workers/index.ts

# Or start individual workers:
npx tsx workers/leave.worker.ts
npx tsx workers/notification.worker.ts
npx tsx workers/payroll.worker.ts
npx tsx workers/retention.worker.ts
npx tsx workers/statutory.worker.ts
npx tsx workers/workflow.worker.ts
```

### WindowDownloader (Electron Desktop App)

```bash
cd WindowDownloader
npm install
npm run dev     # Development mode
npm run build   # Production build (outputs to dist/)
```

## Environment Variables

Based on `config/server-env.ts`, `docker-compose.yml`, and `prisma.config.ts`.

| Variable | Description | Required | Default |
|---|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | ✅ | `postgresql://hcm:hcm_dev_password@postgres:5432/hcm_dev` |
| `NEON_DATABASE_URL` | Neon serverless PostgreSQL (overrides DATABASE_URL) | ⛳ | — |
| `OPENAI_API_KEY` | OpenAI API key for LLM features | ⛳ | — |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key for LLM features | ⛳ | — |
| `EMBEDDINGS_MODEL` | Embeddings model name | ⛳ | `text-embedding-ada-002` |
| `NODE_ENV` | Node environment | ⛳ | `development` |
| `NEXT_PUBLIC_APP_URL` | Public app base URL | ⛳ | `http://localhost:3000` |
| `REDIS_URL` | Redis connection string | ⛳ | `redis://redis:6379` |
| `SECRETS_PROVIDER` | Secrets provider (`env`, `aws`, `azure`) | ⛳ | `env` |
| `NEXT_PUBLIC_TENANT_ID` | Tenant identifier for UI scoping | ⛳ | `tenant1` |
| `AWS_ACCESS_KEY_ID` | AWS credentials (if SECRETS_PROVIDER=aws) | ⛳ | — |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials (if SECRETS_PROVIDER=aws) | ⛳ | — |
| `AZURE_TENANT_ID` | Azure credentials (if SECRETS_PROVIDER=azure) | ⛳ | — |
| `AZURE_CLIENT_ID` | Azure credentials (if SECRETS_PROVIDER=azure) | ⛳ | — |
| `AZURE_CLIENT_SECRET` | Azure credentials (if SECRETS_PROVIDER=azure) | ⛳ | — |
| `AZURE_KEY_VAULT_URL` | Azure Key Vault URL (if SECRETS_PROVIDER=azure) | ⛳ | — |

Legend: ✅ required for local dev; ⛳ optional/conditional.

## Prisma Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Apply all migrations
npx prisma migrate deploy

# OR push schema directly (development only)
npx prisma db push

# Open Prisma Studio (GUI database browser)
npx prisma studio
```

## Available Scripts

| Script | Command | Description |
|---|---|---|
| Dev Server | `npm run dev` | Start Next.js dev server with Turbopack |
| Production Build | `npm run build` | Build production artifacts (standalone output) |
| Production Start | `npm run start` | Run production server |
| Type Check | `npm run typecheck` | Run TypeScript type checking (`tsc --noEmit`) |
| Verify Automation Routes | `npm run verify:automation-routes` | Validate automation route configurations |

## Troubleshooting

### Prisma Connection Errors
- Ensure PostgreSQL is running: `docker-compose up postgres`
- Verify `DATABASE_URL` in `.env.local` matches your database configuration
- For Docker Compose, wait for health check to pass before starting the app

### Build Fails Due to TypeScript Issues
- Run `npm run typecheck` to identify specific type errors
- See `CHANGELOG.md` Sprint 1 for known type issues and fixes

### AI Provider Errors
- Missing API keys will cause fallback behavior
- At minimum, set `OPENAI_API_KEY` for AI features to work
- Ollama can be used locally as an alternative (via `@langchain/ollama`)
