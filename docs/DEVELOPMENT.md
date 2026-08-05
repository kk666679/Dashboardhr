# Development Guide

## Project Conventions

### Code Organization

- **Pages/Routes**: `app/[locale]/[product]/[page]` — locale-first routing with 9 supported locales
- **Components**: Reusable UI in `components/ui/`, domain-specific in `components/features/`, product layouts in `components/platform/`
- **API Layer**: Prefer tRPC (defined in `server/api/routers/` or `server/routers/`) over raw `fetch()`
- **Server-Only Logic**: Keep in `lib/`, `server/`, or `services/` — never import in `'use client'` components
- **Validation**: Use Zod schemas (defined in `lib/schemas.ts`, `lib/sop-schemas.ts`, etc.)
- **State Management**: Zustand stores in `lib/zustand/` for complex client state
- **Styling**: Tailwind CSS v4 with CSS-first configuration (`@import "tailwindcss"` + `@theme {}` in CSS files)

### TypeScript Configuration

- **Target**: ES2023
- **Module Resolution**: `bundler` (modern, fast)
- **Strict Mode**: Disabled (`strict: false`) — gradual adoption in progress
- **Path Aliases**: `@/*` maps to `./*`
- **JSX**: `react-jsx` transform (no manual React imports needed)

## Adding a New Product Module

1. Create route group in `app/[locale]/[product]/` with page files
2. Add navigation items in `config/navigation.ts` under the appropriate product
3. Register the product in `config/products.ts`
4. Configure sidebar in `config/sidebar.ts`
5. Create feature components in `components/features/[product]/`
6. If needed, add tRPC router in `server/routers/[product].ts` and register in `server/api/routers/index.ts`
7. Add relevant hooks in `hooks/use[Product].ts`

## Adding a New tRPC Query

1. Define procedure in `server/routers/[module].ts` or `server/api/routers/[module].ts`
2. Export from `server/api/routers/index.ts` if needed
3. Call from client via `trpc.[module].[procedure].useQuery()`

```ts
// server/routers/employee.ts
import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

export const employeeRouter = router({
  list: publicProcedure
    .input(z.object({ tenantId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.employee.findMany({
        where: { tenantId: input.tenantId },
      })
    }),
})
```

## Adding a New Type

1. Add Zod schema in `lib/schemas.ts` or `types/types.ts`
2. Infer/export the TypeScript type if needed

## Adding a New Utility

- Create the function in the appropriate domain folder under `utils/`
- Re-export from `utils/index.ts`

## Internationalization (i18n) Development

### Adding a New Locale

1. Add locale code to `LOCALES` array in `i18n/config.ts`
2. Add locale configuration (BCP-47, date/number formats, direction)
3. Create translation files in `i18n/locales/[code]/`
4. Update `i18n/locales/` index files

### Using Translations in Components

```tsx
'use client'
import { useTranslation } from '@/hooks/useTranslation'

export function MyComponent() {
  const { t } = useTranslation()
  return <h1>{t('welcome.title')}</h1>
}
```

## Worker Development

Workers are BullMQ consumers that process background jobs. They are located in `workers/`.

### Creating a New Worker

1. Create `workers/[name].worker.ts`
2. Define the job processor
3. Register in `workers/index.ts` if it should start with the worker pool

```ts
// workers/my-custom.worker.ts
import { Worker } from 'bullmq'
import { connection } from '@/lib/queues/bullmq-connection'

const worker = new Worker('my-queue', async (job) => {
  console.log(`Processing job ${job.id}:`, job.data)
  // Process the job...
}, { connection })

console.log('My custom worker started')
export default worker
```

## Docker Development Workflow

```bash
# Start full stack (PostgreSQL + Redis + App + Worker)
docker-compose up

# Rebuild after dependency changes
docker-compose build --no-cache

# Run only infrastructure (for local dev)
docker-compose up postgres redis

# Run worker independently
docker-compose up worker
```

### Dockerfile Targets

The multi-stage Dockerfile provides three targets:

| Target | Purpose |
|---|---|
| `development` | Hot-reload dev server with mounted volumes |
| `builder` | Production build with Prisma generation |
| `production` | Minimal production image (standalone) |

## Environment Variables

See `docs/QUICK_START.md` for a full environment variable reference.

### Required for Local Development

```bash
# Copy and edit
cp .env.example .env.local

# At minimum, set:
DATABASE_URL=postgresql://hcm:hcm_dev_password@localhost:5432/hcm_dev
```

## Testing

### Test Structure

- **Unit tests**: Co-located with source files (`*.test.ts`)
- **Integration tests**: `tests/` directory
- **E2E tests**: Planned (not yet implemented)

### Running Tests

```bash
# Run all tests (when implemented)
npm test
```

## Code Quality

```bash
# Type-check the entire project
npm run typecheck

# Build to verify compilation
npm run build

# Verify automation routes
npm run verify:automation-routes
