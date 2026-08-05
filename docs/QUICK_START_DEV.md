# Frontend-Backend Alignment - Quick Summary

## 📋 What's Connected

### ✅ Fully Aligned
- **Types**: All types centrally exported from `types/index.ts`
- **Hooks**: 35+ hooks available from `hooks/index.ts`
- **tRPC**: 12 routers with 50+ procedures fully integrated
- **Utils**: Consolidated exports with domain indices for payroll, compliance, geolocation, PDF
- **Services**: 7 domain services centrally accessible from `lib/services.ts`
- **Components**: 80+ dashboard pages connected via tRPC
- **Forms**: React Hook Form + Zod validation throughout
- **AI/Agents**: 9 specialist agents wired to UI components/pages

### ⚠️ Partial Alignment
- **Knowledge-Base**: JSON files exist but not centrally exposed (fix: use import)
- **Agent Pages**: 5 agents lack dedicated UI pages (fix: optional, routes to chat-hub)

### 📊 Integration Metrics
- **Routers**: 12/12 ✅
- **Hooks**: 35/35 ✅
- **Services**: 7/7 ✅
- **Utils Domains**: 6/6 ✅
- **Dashboard Pages**: 82/82 ✅
- **Agents**: 9 implemented, 5 missing UI pages

---

## 🚀 For New Developers

### Day 1: Read These

1. **[IMPORT_REFERENCE.md](./IMPORT_REFERENCE.md)** (5 min)
   - How to import everything
   - Copy-paste patterns for your code

2. **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** (15 min)
   - Best practices with examples
   - Common patterns (queries, mutations, forms, AI)

3. **[FRONTEND_BACKEND_ALIGNMENT.md](./FRONTEND_BACKEND_ALIGNMENT.md)** (15 min)
   - Architecture overview
   - See section "10. PAGE → MODULE MAPPING"

### Day 2: Start Coding

#### To Add a New Employee Page Feature:

```typescript
'use client'

import { trpc } from '@/lib/trpc'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function MyFeature() {
  // 1. Fetch data via tRPC
  const { data: employees } = trpc.employee.list.useQuery()

  // 2. Handle loading/error
  if (!employees) return <div>Loading...</div>

  // 3. Display
  return (
    <Card>
      <h2>Employees: {employees.length}</h2>
      {/* Your UI */}
    </Card>
  )
}
```

#### To Modify Employee Form:

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateEmployeeSchema } from '@/lib/schemas'
import { trpc } from '@/lib/trpc'

export function AddEmployee() {
  // 1. Setup form with validation
  const form = useForm({ resolver: zodResolver(CreateEmployeeSchema) })

  // 2. Setup mutation
  const mutation = trpc.employee.create.useMutation()

  // 3. Submit
  const onSubmit = (data) => mutation.mutateAsync(data)

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* fields */}</form>
}
```

#### To Use Payroll Calculations:

```typescript
'use client'

import { calculateEPF, calculateSOCSO } from '@/utils/payroll'

function PayrollSummary({ gross }: { gross: number }) {
  return (
    <div>
      <p>EPF: {calculateEPF(gross)}</p>
      <p>SOCSO: {calculateSOCSO(gross)}</p>
    </div>
  )
}
```

#### To Chat with AI Agent:

```typescript
'use client'

import { useHrOrchestrator } from '@/hooks'

function ComplianceChat() {
  const { messages, sendMessage } = useHrOrchestrator('compliance', 'claude')

  return (
    <div>
      {messages.map((m, i) => <div key={i}>{m.content}</div>)}
      <button onClick={() => sendMessage({ text: 'What are compliance risks?' })}>
        Ask
      </button>
    </div>
  )
}
```

---

## 📚 Documentation Roadmap

| Document | Purpose | Read Time | When |
|----------|---------|-----------|------|
| [IMPORT_REFERENCE.md](./IMPORT_REFERENCE.md) | Quick lookup for imports | 5 min | Before coding |
| [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) | Patterns & best practices | 20 min | First week |
| [FRONTEND_BACKEND_ALIGNMENT.md](./FRONTEND_BACKEND_ALIGNMENT.md) | Complete architecture | 30 min | First week |
| [API_ROUTES_REFERENCE.md](./API_ROUTES_REFERENCE.md) | All API endpoints | 20 min | When debugging |

---

## 🔗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Next.js)                 │
├─────────────────────────────────────────────────────────────┤
│
│  Pages (app/dashboard/*)  ← Receive props from...
│  Components (components/*) ← Use hooks from...
│  Forms (components/forms/) ← Validate with...
│
├─────────────────────────────────────────────────────────────┤
│              TYPES (types/index.ts)                         │
│              ↓ Derived from Zod schemas                     │
│              SCHEMAS (lib/schemas.ts)                       │
├─────────────────────────────────────────────────────────────┤
│
│  HOOKS (hooks/index.ts) ← Wrap queries from...
│  ↓
│  tRPC ROUTERS (server/routers/*.ts)
│  ↓
│  EXPRESS/NEXT API ROUTES (auto-generated)
│
├─────────────────────────────────────────────────────────────┤
│                  BACKEND (Node.js/Prisma)                   │
├─────────────────────────────────────────────────────────────┤
│
│  tRPC Procedures read from...
│  ↓
│  SERVICES (services/*.ts, lib/*-service.ts)
│  ↓
│  UTILS (utils/*.ts) ← Business logic
│  ↓
│  DATABASE (Prisma)
│
│  AI AGENTS (server/agents/*.ts)
│  ↓
│  TOOLS (server/agents/tools/*.ts)
│  ↓
│  Vercel AI SDK / LLM APIs
│
│  KNOWLEDGE-BASE (knowledge-base/*.json)
│  ↓
│  Embedded in agent responses
```

---

## 🎯 Common Tasks

### Add a New tRPC Query

1. Define in **`server/routers/[module].ts`**:
```typescript
export const exampleRouter = router({
  getData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Your logic
      return data
    })
})
```

2. Use in component:
```typescript
const { data } = trpc.[module].getData.useQuery({ id })
```

### Add a New Type

1. Add to **`lib/schemas.ts`**:
```typescript
export const MySchema = z.object({ /* fields */ })
```

2. Export inferred type from **`types/index.ts`**:
```typescript
export type MyType = z.infer<typeof MySchema>
```

### Add New Utility Function

1. Create in appropriate domain folder:
```typescript
// utils/compliance/new-function.ts
export function checkNewRule(data) { /* logic */ }
```

2. Re-export from **`utils/index.ts`**:
```typescript
export * from './compliance/new-function'
```

### Add New Agent

1. Create **`server/agents/my-agent.ts`**:
```typescript
export async function myAgent(input: string) {
  // Agent logic
  return { type: 'RESULT', data: {} }
}
```

2. Add to orchestrator routing
3. Create UI page at **`app/dashboard/ai/my-agent/page.tsx`**

---

## ✅ Quality Checklist

Before pushing code:

- [ ] Types imported from `@/types`
- [ ] Hooks imported from `@/hooks`
- [ ] Forms use Zod + React Hook Form
- [ ] tRPC mutations have onSuccess/onError
- [ ] Loading states handled
- [ ] Error boundaries in place
- [ ] No direct server imports
- [ ] No fetch() calls (use tRPC)
- [ ] Utilities imported from `@/utils/*`
- [ ] Components use shadcn/ui components

---

## 🐛 Troubleshooting

### "Cannot find module @/types"
**Fix:** Import from correct path
```typescript
// ✅ Correct
import type { Employee } from '@/types'

// ✗ Wrong
import type { Employee } from '@/types/index.ts'
```

### "tRPC procedure not found"
**Fix:** Check router export in `server/root.ts`
```typescript
// app/root.ts should have:
export const appRouter = router({
  employee: employeeRouter,
  // ...
})
```

### "Service not available in client component"
**Fix:** Services are server-only. Access via tRPC or Server Component.
```typescript
// ✗ Won't work in 'use client' component
import { auditEngine } from '@/lib/services'

// ✅ Use tRPC instead
const { data } = trpc.compliance.check.useQuery()
```

### "Zod validation errors not showing"
**Fix:** Check form error handling
```typescript
{form.formState.errors.fieldName && (
  <p className="text-red-500">
    {form.formState.errors.fieldName?.message}
  </p>
)}
```

---

## 📖 Documentation Location

All documentation files are in the repo root:

- `FRONTEND_BACKEND_ALIGNMENT.md` - Architecture & alignment
- `API_ROUTES_REFERENCE.md` - All API endpoints
- `INTEGRATION_GUIDE.md` - Patterns & examples
- `IMPORT_REFERENCE.md` - Quick import lookup
- `AGENTS.md` - Agent system overview
- `CLAUDE.md` - AI assistant instructions

---

## 🚨 Common Mistakes to Avoid

1. **Importing from `@/server`** - Always use tRPC routers instead
2. **Calling services from client** - Services are server-only, use tRPC
3. **Not handling loading states** - Always show skeleton or loader
4. **Forgetting to invalidate queries** - Mutations need cache invalidation
5. **Using `fetch()` instead of tRPC** - Always use tRPC for API calls
6. **Manual type definitions** - Always derive from Zod schemas
7. **Not catching errors in mutations** - Always add onError handlers
8. **Using `Float` instead of `Decimal`** - Always use Decimal for money

---

## 💡 Pro Tips

### Tip 1: Use TypeScript for Type Safety
```typescript
// Your code gets full autocomplete & type checking
const { data } = trpc.employee.list.useQuery()
// data is Employee[] - TS knows this!
```

### Tip 2: Reuse Types Everywhere
```typescript
interface MyComponentProps extends Employee {
  onEdit: (emp: Employee) => void
}
```

### Tip 3: Create Custom Hooks for Complex Logic
```typescript
// hooks/useEmployeeAdmin.ts
export function useEmployeeAdmin(id: string) {
  const employee = trpc.employee.get.useQuery({ id })
  const updateMutation = trpc.employee.update.useMutation()
  // Return combined interface
  return { ...employee, update: updateMutation }
}
```

### Tip 4: Use Server Components for Initial Data
```typescript
// app/dashboard/page.tsx (Server Component)
const caller = await serverCaller()
const data = await caller.dashboard.getData()
return <Dashboard data={data} />  // Pass to client component
```

---

## 🤝 Need Help?

1. Check **IMPORT_REFERENCE.md** for import syntax
2. Check **INTEGRATION_GUIDE.md** for code patterns
3. Check **API_ROUTES_REFERENCE.md** for endpoint details
4. Search **FRONTEND_BACKEND_ALIGNMENT.md** for your use case

---

## Document Version

- **Created:** 2026-04-15
- **Last Updated:** 2026-04-15
- **Status:** Complete & Ready for Development Team
