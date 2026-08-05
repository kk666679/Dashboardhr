# Contributing to AiFWMS

Thank you for contributing. This guide covers conventions, workflow, and commands to keep the codebase consistent.

---

## Development Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd aifwms
pnpm install

# 2. Copy environment file
cp .env.example .env.local
# Fill in DATABASE_URL, REDIS_URL, and JWT_SECRET at minimum

# 3. Generate Prisma client and push schema
pnpm prisma generate
pnpm prisma db push

# 4. Start development server
pnpm dev
```

---

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Next.js dev server (Turbopack) |
| `pnpm build` | Production build (runs `prisma generate` first) |
| `pnpm typecheck` | `tsc --noEmit` — must pass before merge |
| `pnpm test` | Run all Vitest unit tests |
| `pnpm run analyze` | Build with `@next/bundle-analyzer` bundle size report |
| `pnpm lint` | ESLint across the codebase |
| `pnpm prisma generate` | Regenerate Prisma client after schema changes |
| `pnpm prisma db push` | Push schema changes to database |
| `pnpm prisma migrate dev` | Create and apply a migration |

---

## Code Conventions

### TypeScript
- `strict: true` is enabled — avoid `any` casts; use proper types or generics.
- Server-only logic lives in `lib/`, `server/`, `workers/`. Never import these in `'use client'` components.
- All API inputs must be validated with Zod schemas.

### File Structure
- **Domain services** → `lib/` (pure business logic, no framework coupling)
- **tRPC routers** → `server/api/routers/` (one router per domain)
- **REST handlers** → `app/api/` (session-guarded, Zod-validated)
- **OpenClaw agents** → `.openclaw/agents/` (extend `BaseAgent`)
- **React components** → `components/` (split by `ui/`, `features/`, `dashboard-sidebar/`)
- **Page routes** → `app/[locale]/` (one folder per product)

### Tenant Isolation
Every Prisma query **must** include `where: { tenantId }`. Use `withTenant()` from `lib/prisma.ts` to propagate tenant context automatically via AsyncLocalStorage in tRPC procedures. Never query without a tenant scope.

### Security Checklist (before submitting a PR)
- [ ] New API routes call `getCurrentSession()` and return 401 if unauthenticated
- [ ] All user input validated with Zod (no raw `req.body` access)
- [ ] Prisma queries scoped by `tenantId`
- [ ] AI prompt inputs passed through `sanitizePrompt()` from `lib/security/prompt.ts`
- [ ] Outbound HTTP calls use `safeFetch()` from `lib/security/ssrf.ts`
- [ ] No secrets committed (check `.env.example` — use env vars, not literals)

### Tests
- Write tests for any new service functions, agents, or utilities.
- Place test files adjacent to the implementation (`foo.ts` → `foo.test.ts`).
- Mock `@/lib/prisma` and external SDKs via `vi.mock()` — no live DB in unit tests.
- Run `pnpm test` before pushing; the CI gate enforces this.

### Styling
- Tailwind CSS v4 only — use `@theme` tokens, no inline `style={}` except for dynamic values.
- Dark/light mode via `next-themes` — test both modes when adding new UI.
- Use existing `shadcn/ui` + Radix components before adding new UI libraries.

---

## Git Workflow

1. Create a feature branch from `main`: `git checkout -b feat/your-feature`
2. Make focused commits with clear messages: `git commit -m "feat(payroll): add EPF bracket for age 60+"`
3. Run `pnpm typecheck && pnpm test` locally before pushing
4. Open a PR against `main` — CI will run typecheck, tests, and build automatically
5. Request review from at least one team member

### Commit Message Format
```
<type>(<scope>): <short description>

Types: feat, fix, refactor, test, docs, chore, perf
Scope: module name (payroll, agent, auth, schema, etc.)
```

---

## Adding a New OpenClaw Agent

1. Create `.openclaw/agents/<name>.agent.ts` extending `BaseAgent`
2. Implement `process(input: AgentInput, context: AgentContext): Promise<AgentOutput>`
3. Register it in `.openclaw/agents/orchestrator.agent.ts` `AGENT_REGISTRY`
4. Add entry to `.openclaw/config/agent-registry.json`
5. Write unit tests in `.openclaw/agents/<name>.agent.test.ts` — mock `@/lib/prisma`, `@/lib/embeddings`, `@/lib/pgvector-client`, and `@/lib/ahros/event-bus`

---

## Adding a New tRPC Router

1. Create `server/api/routers/<domain>.ts`
2. Export the router from `server/api/routers/index.ts`
3. Register it in `server/api/root.ts`
4. Use `protectedProcedure` (or `abacProcedure`) — never `publicProcedure` for sensitive data
5. Validate all inputs with Zod

---

## Database Changes

1. Edit `prisma/schema.prisma`
2. Run `pnpm prisma migrate dev --name describe-your-change`
3. Update `SOFT_DELETE_MODELS` in `lib/prisma.ts` if the new model has `deletedAt`
4. If adding long-text `String` fields, annotate with `@db.Text`

---

## Environment Variables

See `.env.example` at the project root for all variables. See `docs/ENV_REFERENCE.md` for full documentation with defaults, validation rules, and usage context.

---

*Questions? Open a GitHub Discussion or check `docs/FAQ.md`.*
