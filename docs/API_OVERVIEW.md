# API Overview (Next.js + tRPC)

## REST API Routes

The repository contains extensive Next.js Route Handlers under `app/api/` for REST endpoints.

### AI Endpoints
| Endpoint | Method | Description |
|---|---|---|
| `/api/ai/chat` | POST | Streaming chat completion (multi-provider) |
| `/api/ai/chat/history` | GET | Retrieve chat session history |
| `/api/ai/rag` | POST | Retrieval-Augmented Generation query |
| `/api/ai/reason` | POST | AI reasoning/analysis endpoint |
| `/api/ai/documents` | POST | AI-powered document processing |

### HR Orchestration
| Endpoint | Method | Description |
|---|---|---|
| `/api/hr-orchestrator` | POST | Multi-agent HR orchestrator (routes to domain agents) |

### Authentication & Security
| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/[...nextauth]` | \* | NextAuth.js authentication routes |
| `/api/auth/mfa` | POST | Multi-factor authentication |

### Geolocation & Attendance
| Endpoint | Method | Description |
|---|---|---|
| `/api/geolocation` | GET/POST | Geolocation tracking |
| `/api/geolocation/attendance/[workerId]` | GET/POST | Worker attendance with geo-verification |
| `/api/geolocation/location` | POST | Location data ingestion |

### Knowledge Base & Embeddings
| Endpoint | Method | Description |
|---|---|---|
| `/api/kb/ingest` | POST | Ingest documents into knowledge base |
| `/api/kb/search` | GET | Semantic search across knowledge base |
| `/api/knowledge-base` | GET | List knowledge base entries |
| `/api/knowledge-base/[standard]` | GET | Filter by compliance standard |
| `/api/embeddings/ingest` | POST | Generate and store embeddings |

### ISO/QMS Endpoints
| Endpoint | Method | Description |
|---|---|---|
| `/api/iso/audit/checklist` | GET | ISO audit checklist |
| `/api/iso/audit/plan` | POST | Create ISO audit plan |
| `/api/iso/capa/5whys` | POST | 5 Whys root cause analysis |
| `/api/iso/compliance/gap` | POST | Gap analysis for compliance |
| `/api/iso/compliance/score` | GET | Compliance scoring |
| `/api/iso/risk/climate` | POST | Climate risk assessment |
| `/api/iso/risk/matrix` | POST | Risk matrix evaluation |

### SOP Management
| Endpoint | Method | Description |
|---|---|---|
| `/api/sops` | GET/POST | List and create SOPs |
| `/api/sops/[id]` | GET/PUT/DELETE | CRUD for individual SOPs |
| `/api/sops/create` | POST | SOP creation workflow |
| `/api/sops/export` | GET | Export SOPs |
| `/api/sops/search` | GET | Search SOPs |

### Integrations & HR Sync
| Endpoint | Method | Description |
|---|---|---|
| `/api/hr-integration/sync` | POST | HR data synchronization |
| `/api/hr-integration/payroll/sync-attendance` | POST | Payroll attendance sync |
| `/api/integrations/gl-export` | POST | General ledger export |

### Webhooks
| Endpoint | Method | Description |
|---|---|---|
| `/api/webhooks/background-check` | POST | Background check webhook |
| `/api/webhooks/biometric` | POST | Biometric data webhook |

### System & Utility
| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Health check |
| `/api/health/live` | GET | Liveness probe |
| `/api/documents/upload` | POST | Document upload to blob storage |
| `/api/avatar/upload` | POST | Avatar image upload |
| `/api/blob` | GET/POST | Vercel Blob storage operations |
| `/api/reports/lhdn-audit-template` | GET | LHDN audit report template |
| `/api/svgs` | GET | SVG icon generation |
| `/api/openapi` | GET | OpenAPI specification endpoint |
| `/api/trpc/[trpc]` | POST | tRPC HTTP handler |
| `/api/types/schemas` | GET | Exposed Zod schemas |
| `/api/window-exe` | GET | WindowDownloader executable download |
| `/api/siem` | POST | Security event logging |

---

## tRPC API

tRPC is the primary typed API layer. Routers are defined under `server/api/routers/` and `server/routers/`.

### tRPC Router Index

#### Core HR Routers
| Router | Procedures | Description |
|---|---|---|
| `employee` | list, get, create, update, delete | Employee CRUD |
| `foreignWorker` | list, get, create, update, visa, permit | Foreign worker management |
| `expatriate` | list, get, create, update | Expatriate management |
| `attendance` | checkIn, checkOut, history, report | Attendance tracking |
| `leave` | list, balance, apply, approve, cancel | Leave management |
| `payroll` | run, history, payslip, adjustment | Payroll processing |
| `compensation` | plans, bands, review, adjust | Compensation management |
| `compensationPlans` | create, update, list | Compensation plan templates |

#### Compliance & Legal
| Router | Procedures | Description |
|---|---|---|
| `compliance` | dashboard, audit, findings, report | Compliance management |
| `fomema` | schedule, result, alert, expiry | FOMEMA medical tracking |
| `visa` | apply, renew, status, expiry | Visa management |
| `statutory` | epf, socso, eis, pcb | Statutory contributions |
| `termination` | initiate, approve, clearance | Termination workflow |
| `offboarding` | start, tasks, checklist, complete | Offboarding process |
| `onboarding` | onboard, tasks, complete | Onboarding workflow |

#### Talent Management
| Router | Procedures | Description |
|---|---|---|
| `recruitment` | jobs, candidates, interview, offer | Recruitment pipeline |
| `performance` | reviews, goals, feedback, rating | Performance management |
| `learningDev` | courses, enrollments, progress | Learning & development |
| `succession` | plans, candidates, readiness | Succession planning |
| `successionPlanning` | create, update, pipeline | Succession pipeline |

#### Financial & Assets
| Router | Procedures | Description |
|---|---|---|
| `accounting` | ledger, invoices, reports | Accounting operations |
| `payrollHcm` | run, history, reports | Payroll HCM integration |
| `claims` | submit, approve, history | Employee claims |
| `assets` | list, assign, maintain, dispose | Asset management |
| `capex` | projects, budget, roi | Capital expenditure |

#### Automation & Workflow
| Router | Procedures | Description |
|---|---|---|
| `automation` | triggers, actions, workflows | Automation rules |
| `workflowEngine` | execute, status, logs | Workflow execution engine |
| `sop` | list, create, approve, publish | SOP management |
| `qms` | quality, metrics, audits | Quality management |

#### Analytics & Reporting
| Router | Procedures | Description |
|---|---|---|
| `analytics` | dashboard, reports, export | Business analytics |
| `dashboard` | kpi, trends, alerts | Dashboard data |
| `search` | global, advanced, filters | Global search |

#### HR Operations
| Router | Procedures | Description |
|---|---|---|
| `employeeRelations` | cases, grievances, resolution | Employee relations |
| `industrialRelations` | unions, disputes, agreements | Industrial relations |
| `healthSafety` | incidents, inspections, training | Health & safety |
| `travel` | requests, approvals, itinerary | Travel management |
| `scheduling` | shifts, roster, swap | Shift scheduling |
| `shifts` | create, assign, swap | Shift management |
| `positions` | list, create, fill | Position management |
| `workforcePlanning` | forecast, budget, headcount | Workforce planning |

#### ISO & Quality
| Router | Procedures | Description |
|---|---|---|
| `iso` | standards, audits, findings, capa | ISO management |
| `lms` | courses, training, compliance | Learning management system |
| `opex` | lean, sixSigma, kaizen, kanban | Operational excellence |

#### Administration
| Router | Procedures | Description |
|---|---|---|
| `auth` | login, logout, session, mfa | Authentication |
| `benefits` | plans, enrollment, claims | Benefits administration |
| `document` | upload, list, sign, archive | Document management |
| `notifications` | send, list, preferences | Notification center |
| `notificationCenter` | channels, templates, history | Notification configuration |
| `security` | audit, logs, settings | Security management |
| `dataGovernance` | policies, retention, audit | Data governance |
| `auditTrail` | events, export, search | Audit trail |
| `organisation` | structure, departments, roles | Organisation management |
| `companyRouters` | company, settings, branding | Company configuration |
| `accommodation` | list, inspect, compliance | Worker accommodation |
| `medical` | records, appointments, alerts | Medical management |

#### Miscellaneous
| Router | Procedures | Description |
|---|---|---|
| `stubs` | test, mock, seed | Stub data for testing |
| `zakat` | calculate, report, compliance | Zakat calculation |
| `agent` | list, assign, performance | Agent management |
| `handbookRouter` | policies, acknowledgments | Employee handbook |
| `ms` | metrics, scoring | Management system |
| `mss` | manager dashboard, approvals | Manager self-service |
| `ess` | profile, payslips, leave | Employee self-service |
| `lifecycle` | events, triggers, history | Lifecycle event management |
| `integrations` | list, connect, status | Third-party integrations |
| `ai` | chat, generate, analyze | AI capabilities |

---

### Example: Query in a Client Component

```ts
'use client'

import { trpc } from '@/lib/trpc'

export function EmployeeList() {
  const { data, isLoading, error } = trpc.employee.list.useQuery({
    tenantId: 'tenant1',
    limit: 20,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data?.map((emp) => (
        <li key={emp.id}>{emp.name} — {emp.position}</li>
      ))}
    </ul>
  )
}
```

### Example: Mutation

```ts
'use client'

import { trpc } from '@/lib/trpc'

export function CreateEmployeeForm() {
  const utils = trpc.useUtils()
  const mutation = trpc.employee.create.useMutation({
    onSuccess: () => {
      utils.employee.list.invalidate()
    },
  })

  const handleSubmit = (formData: FormData) => {
    mutation.mutate({
      name: formData.get('name') as string,
      position: formData.get('position') as string,
      department: formData.get('department') as string,
    })
  }

  return (
    <form action={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Employee'}
      </button>
    </form>
  )
}
```

## Quality Checklist for API Usage

- Prefer tRPC over raw `fetch()` for type safety
- Always handle loading and error states in UI components
- Mutations should invalidate/refetch related queries on success
- Use Zod schemas for input validation (defined in `lib/schemas.ts`)
- Server-only logic must never be imported into client components
- All API routes are tenant-scoped via `NEXT_PUBLIC_TENANT_ID`
- Route handlers that use AI require provider-specific API keys in environment
