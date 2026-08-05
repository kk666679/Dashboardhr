# Enterprise Information Architecture — AHROS

## Overview

The application is restructured from a product-centric layout into a **six-layer enterprise architecture** that reflects business capabilities, not technical modules.

```
Enterprise Platform (AHROS)
├── Platform                    — Infrastructure & shared services
├── Executive Dashboard          — Command center & business health
├── Business Domains            — Bounded contexts for real-world capabilities
├── AI Platform                  — AI as infrastructure across all domains
├── Shared Platform              — Cross-cutting concerns (compliance, automation, knowledge)
└── Design System                — Foundations, primitives, enterprise components
```

---

## Layer 1: Platform

**Purpose:** Pure infrastructure. Nothing business-specific belongs here.

| Module | Description | Route Prefix |
|--------|-------------|-------------|
| **Authentication** | Login, MFA, session management, OAuth | `/auth` |
| **Organization** | Tenant config, company profile, branding | `/org` |
| **Users** | User management, roles, permissions | `/users` |
| **Permissions** | RBAC/ABAC engine, policy definitions | `/permissions` |
| **Notifications** | In-app, email, push notification infrastructure | `/notifications` |
| **Routing** | Next.js App Router, middleware, locale routing | (framework) |
| **Layouts** | App shell, workspace shell, landing shell | (layout components) |
| **Search** | Global search infrastructure, indexing | `/search` |
| **Settings** | System settings, feature flags | `/settings/system` |
| **Feature Flags** | Toggle infrastructure for gradual rollout | `/flags` |
| **Audit** | Immutable audit trail, change data capture | `/audit` |
| **Billing** | Subscription management, invoicing | `/billing` |
| **Themes** | Design token system, tenant branding | `/themes` |
| **Localization** | i18n infrastructure, translation management | `/i18n` |
| **Telemetry** | Analytics, logging, monitoring infrastructure | `/telemetry` |
| **Plugin Registry** | Third-party plugin system | `/plugins` |
| **Command Palette** | Global Cmd+K, quick actions | (floating) |
| **App Shell** | Application frame, navigation shell | (layout component) |

---

## Layer 2: Executive Dashboard

**Purpose:** Command center. Answers "What requires my attention today?" Never owns operational UI.

| Widget | Description | Data Source |
|--------|-------------|-------------|
| **Daily Briefing** | AI-generated summary of today's critical items | AI Platform |
| **Business Health** | Key business KPIs (headcount, payroll, compliance) | All Domains |
| **Compliance Health** | Overall compliance score, critical flags | Compliance Platform |
| **Pending Work** | Approvals, reviews, tasks requiring action | Workflow Engine |
| **AI Recommendations** | AI-generated insights and recommendations | AI Platform |
| **Critical Alerts** | Expiring permits, compliance violations, anomalies | Rule Engine |
| **Upcoming Deadlines** | Calendar of statutory deadlines, renewal dates | All Domains |
| **Running Workflows** | Active workflow executions and their status | Automation Platform |
| **Business KPIs** | Configurable KPI dashboard per role | Analytics Engine |
| **Automation ROI** | Cost/time savings from automated workflows | Automation Platform |

**Route:** `/dashboard`

---

## Layer 3: Business Domains

**Purpose:** Every real-world capability owns its own bounded context.

| Domain | Description | Route | Current Status |
|--------|-------------|-------|---------------|
| **People** | Employee master data, profiles, lifecycle | `/people` | ⚠️ Partially extracted |
| **Recruitment** | Job requisitions, candidates, interviews, offers | `/recruitment` | ⚠️ Partially extracted |
| **Onboarding** | Employee onboarding checklists, document collection | `/onboarding` | ❌ Not extracted |
| **Offboarding** | Exit process, clearance, final settlement | `/offboarding` | ❌ Not extracted |
| **Payroll** | Payroll processing, payslips, statutory contributions | `/payroll` | ⚠️ Partially extracted |
| **Attendance** | Time tracking, attendance records, schedule | `/attendance` | ❌ Not extracted |
| **Leave** | Leave applications, balances, approvals | `/leave` | ⚠️ Partially extracted |
| **Performance** | Reviews, goals, feedback, evaluations | `/performance` | ❌ Not extracted |
| **Learning** | Training, courses, certifications, HRD Corp | `/learning` | ❌ Not extracted |
| **Assets** | Company assets, allocation, tracking | `/assets` | ⚠️ Partially extracted (CAPEX) |
| **Foreign Workers** | Work permits, visas, FOMEMA, levies | `/foreign-workers` | ⚠️ Partially extracted |
| **Compliance** | Regulatory compliance, audits, statutory checks | `/compliance` | ⚠️ Partially extracted |
| **Finance** | Invoices, billing, tax, e-invoice, government submissions | `/finance` | ⚠️ Partially extracted (Accounting) |
| **Documents** | Document management, templates, e-signatures | `/documents` | ❌ Not extracted |
| **Projects** | Project management, milestones, budgets | `/projects` | ⚠️ Partially extracted (CAPEX) |
| **Vendors** | Vendor management, contracts, procurement | `/vendors` | ❌ Not extracted |
| **Administration** | System administration, configuration | `/admin` | ⚠️ Partially extracted |

### Domain Boundary Rules

1. Each domain owns its **pages, components, hooks, stores, API, schemas, permissions, documentation, tests, templates, workflow definitions, and artifacts**
2. No business logic exists outside a domain
3. Domains communicate through **events** (EventBus) and **shared contracts** (Zod schemas)
4. Domains never import from other domains directly — use the EventBus
5. Each domain has exactly one owner (team or person)

---

## Layer 4: AI Platform

**Purpose:** AI is platform infrastructure, not a page. Every domain consumes AI services.

| Module | Description | Location |
|--------|-------------|----------|
| **Agents** | Domain-specific AI agents | `ai/agents/` |
| **Conversation** | Chat infrastructure, session management | `ai/conversation/` |
| **Planning** | Plan generation, validation, review | `ai/planning/` |
| **Reasoning** | Chain-of-thought, step-by-step reasoning | `ai/reasoning/` |
| **Memory** | Cross-session memory, pattern learning | `ai/memory/` |
| **Knowledge** | RAG, vector search, knowledge base management | `ai/knowledge/` |
| **Artifacts** | Artifact generation, versioning, synchronization | `ai/artifacts/` |
| **Simulation** | What-if analysis, workflow simulation | `ai/simulation/` |
| **Execution** | Workflow execution with AI oversight | `ai/execution/` |
| **Tools** | Tool definitions, tool registry, tool routing | `ai/tools/` |
| **Models** | Model configuration, routing, fallback | `ai/models/` |
| **Prompt Library** | Versioned, domain-specific prompt templates | `ai/prompt-library/` |
| **Learning** | Continuous learning from execution patterns | `ai/learning/` |
| **Citations** | Citation tracking, source attribution | `ai/citations/` |
| **Timeline** | Execution timeline generation | `ai/timeline/` |
| **Thinking** | AI thinking visualization, reasoning panels | `ai/thinking/` |
| **Sources** | Source management, data provenance | `ai/sources/` |
| **Checkpoints** | Execution save/restore points | `ai/checkpoints/` |
| **SOP Generation** | Auto-generate SOPs from executions | `ai/sop/` |

---

## Layer 5: Shared Platform

**Purpose:** Cross-cutting concerns that span multiple domains.

### Automation Platform

| Module | Description |
|--------|-------------|
| **Flow Studio** | Visual workflow designer |
| **Planner** | AI-powered workflow planning |
| **Executions** | Workflow execution engine |
| **Templates** | Pre-built workflow templates |
| **Triggers** | Event-driven trigger system |
| **Schedules** | Cron-based schedule triggers |
| **Retry Engine** | Retry logic with exponential backoff |
| **Agent Runtime** | AI agent orchestration during execution |
| **Checkpoint Engine** | Save/resume execution |
| **Integrations** | Third-party API connectors |
| **Workflow Marketplace** | Shareable workflow library |

### Compliance Platform

| Module | Description |
|--------|-------------|
| **Employment Act** | Malaysian Employment Act 1955 compliance |
| **EPF** | KWSP contribution management |
| **SOCSO** | PERKESO coverage management |
| **LHDN** | Tax compliance, PCB, EA forms |
| **PDPA** | Personal Data Protection Act compliance |
| **Immigration** | Immigration Act compliance |
| **Audit** | Audit preparation and tracking |
| **Risk Engine** | Risk scoring and mitigation |
| **Policy Engine** | Company policy enforcement |
| **Approval Rules** | Approval workflow configuration |

### Knowledge Platform

| Module | Description |
|--------|-------------|
| **SOP** | Standard Operating Procedure management |
| **Playbook** | Best practice playbooks |
| **Timeline** | Execution timeline visualization |
| **Audit Report** | Compliance audit reports |
| **Architecture Diagram** | Workflow architecture visualization |
| **Compliance Report** | Regulatory compliance reports |
| **Meeting Notes** | AI-generated meeting summaries |
| **Workflow Doc** | Auto-documented workflows |
| **Decision History** | AI decision logging |
| **Learning Summary** | Weekly/monthly learning digests |

---

## Layer 6: Design System

**Purpose:** Visual consistency, component reuse, accessibility.

### Foundations

| Token Category | Items | File |
|---------------|-------|------|
| **Typography** | Font family, scale (12-48px), weights, line heights | `styles/design-tokens.ts` |
| **Spacing** | 4px grid system, spacing scale | `styles/design-tokens.ts` |
| **Colors** | Semantic tokens (brand, bg, text, border, status) | `styles/design-tokens.ts` |
| **Icons** | Lucide icon set, icon sizing guidelines | (Lucide) |
| **Motion** | Duration, easing curves, reduced motion | `styles/design-tokens.ts` |
| **Elevation** | Shadow tokens, z-index scale | `styles/design-tokens.ts` |
| **Accessibility** | Color contrast, focus rings, ARIA patterns | (Inclusive) |

### Enterprise Components

| Component | Description | Status |
|-----------|-------------|--------|
| **Data Grid** | Sortable, filterable, virtualized table | ❌ Missing |
| **Timeline** | Horizontal/vertical timeline visualization | ⚠️ Partial (AHROS) |
| **Workflow Canvas** | Drag-and-drop workflow builder | ⚠️ Partial (Flow Designer) |
| **Artifact Viewer** | Artifact display with version history | ⚠️ Partial (AHROS) |
| **Knowledge Tree** | Hierarchical knowledge visualization | ❌ Missing |
| **Reasoning Panel** | AI reasoning chain visualization | ⚠️ Partial (AHROS) |
| **Execution Monitor** | Real-time execution status dashboard | ❌ Missing |
| **Approval Cards** | Approval request/review cards | ❌ Missing |
| **Status Indicators** | Status badges, progress indicators | ⚠️ Partial (badge) |
| **AI Panels** | AI conversation, context, sources panels | ⚠️ Partial (ai-elements) |

---

## Route Hierarchy

```
/                           → Landing page
/dashboard                  → Executive Dashboard (command center)
/workspace/[id]             → Workspace session
/people                     → People domain
/people/[id]                → Person profile
/recruitment                → Recruitment domain
/onboarding                 → Onboarding domain
/offboarding                → Offboarding domain
/payroll                    → Payroll domain
/attendance                 → Attendance domain
/leave                      → Leave domain
/performance                → Performance domain
/learning                   → Learning domain
/assets                     → Assets domain
/foreign-workers            → Foreign Workers domain
/compliance                 → Compliance domain
/finance                    → Finance domain
/documents                  → Documents domain
/projects                   → Projects domain
/vendors                    → Vendors domain
/admin                      → Administration domain
/automation                 → Automation Platform
/automation/flows           → Flow Studio
/automation/executions      → Execution Monitor
/automation/templates       → Workflow Templates
/knowledge                  → Knowledge Platform
/knowledge/sops             → SOP Library
/knowledge/playbooks        → Playbook Library
/knowledge/reports          → Audit Reports
/ai/copilot                 → AI Copilot
/ai/conversation            → AI Conversation
/ai/agents                  → Agent Management
/settings                   → Platform Settings
/integrations               → Integration Hub
```

---

## Navigation Structure (Business Language)

```
┌─────────────────────────────────────────────┐
│ ◉ Dashboard                                  │
│   Dashboard (Command Center)                 │
│   Analytics                                  │
├─────────────────────────────────────────────┤
│ ◉ Workspace                                  │
│   New Workspace                              │
│   Recent Sessions                            │
├─────────────────────────────────────────────┤
│ ◉ People                                     │
│   All Employees                              │
│   New Employee                               │
│   Onboarding                                 │
│   Offboarding                                │
│   Organisation Chart                         │
├─────────────────────────────────────────────┤
│ ◉ Workforce Management                       │
│   Recruitment                                │
│   Attendance                                 │
│   Leave                                      │
│   Performance                                │
│   Learning & Development                     │
│   Succession                                 │
├─────────────────────────────────────────────┤
│ ◉ Foreign Workers                            │
│   Overview                                   │
│   Permits & Visas                            │
│   FOMEMA                                     │
│   Accommodation                              │
│   Geolocation                                │
├─────────────────────────────────────────────┤
│ ◉ Finance                                    │
│   Payroll                                    │
│   Compensation & Benefits                    │
│   Invoicing                                  │
│   Tax                                        │
│   E-Invoice                                  │
├─────────────────────────────────────────────┤
│ ◉ Compliance                                 │
│   Compliance Dashboard                       │
│   Audits                                     │
│   Statutory                                  │
│   Risk                                       │
│   Policy                                     │
├─────────────────────────────────────────────┤
│ ◉ Automation                                 │
│   Flow Studio                                │
│   Execution Monitor                          │
│   Templates                                  │
│   QMS                                        │
├─────────────────────────────────────────────┤
│ ◉ Knowledge                                  │
│   Knowledge Base                             │
│   SOPs                                       │
│   Playbooks                                  │
│   Audit Reports                              │
├─────────────────────────────────────────────┤
│ ◉ AI                                         │
│   AI Copilot                                 │
│   Conversations                              │
│   Agents                                     │
│   Semantic Search                            │
├─────────────────────────────────────────────┤
│ ◉ Administration                             │
│   Settings                                   │
│   Integrations                               │
│   Documents                                  │
│   Security                                   │
│   Audit Trail                                │
│   Billing                                    │
└─────────────────────────────────────────────┘
