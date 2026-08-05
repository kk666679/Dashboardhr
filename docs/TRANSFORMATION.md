# AHROS — AI-Native Enterprise Operating System

## Master Transformation Blueprint

**Version:** 1.0
**Date:** 2026-07-26
**Status:** Phase 1 Complete

---

## The Vision

Transform the current HR workflow application into an AI-Native Enterprise Operating System where business operations, AI orchestration, workflows, knowledge, compliance, and execution exist inside one unified workspace.

The application should feel closer to Notion AI, Figma, GitHub Copilot Workspace, Linear, ServiceNow, SAP SuccessFactors, Workday, and OpenAI Operator — not a traditional HRMS.

---

## Current State

- Next.js 16 App Router app with 300+ pages
- 9 product modules (Dashboard/HR, Accounting, Automation, AI, CAPEX, Employees, ESS, MSS, Integrations)
- AHROS core (EventBus, ArtifactRegistry, Orchestrator, ExecutionEngine, LearningEngine, ComplianceReporter)
- 16 domain AI agents
- 60+ UI primitives (shadcn/ui)
- 9-language i18n support
- tRPC API + TanStack Query + Zustand state management
- PostgreSQL + pgvector for RAG

---

## Six-Layer Architecture

```
Enterprise Platform (AHROS)
├── Platform                    — Infrastructure & shared services
├── Executive Dashboard          — Command center & business health  
├── Business Domains            — 17 bounded contexts for real-world capabilities
├── AI Platform                  — AI as infrastructure across all domains
├── Shared Platform              — Cross-cutting (Compliance, Automation, Knowledge)
└── Design System                — Foundations, primitives, enterprise components
```

---

## Product Philosophy

The application is no longer organized around screens.

Instead it's organized around:

```
Business Event → AI Understanding → Planning → Execution → Compliance → Knowledge → Learning → Continuous Improvement
```

Everything else is a visualization of this lifecycle.

---

## 7-Phase Transformation

| Phase | Focus | Deliverables | Status |
|-------|-------|-------------|--------|
| **P1** | Foundation Audit & Domain Mapping | 6 architecture documents | ✅ Complete |
| **P2** | Platform, Design System & AI Foundation | App Shell, Design Tokens, AI Runtime | ⏳ Next |
| **P3** | Extract Bounded Business Domains | 17 domain directories | ⏳ |
| **P4** | Automation Platform + AI Integration | Flow Studio, AI Domain Services | ⏳ |
| **P5** | Workspace UX + Artifact Synchronization | Workspace-first UX, Sync Model | ⏳ |
| **P6** | Knowledge Platform & Living Documentation | Auto-generated SOPs, Playbooks | ⏳ |
| **P7** | Performance, Testing, Accessibility, Observability | Perf plan, Tests, a11y, Monitoring | ⏳ |

---

## Architecture Documents (Phase 1 Complete)

| # | Document | Location | Status |
|---|----------|----------|--------|
| 1 | Enterprise Information Architecture | `docs/architecture/INFORMATION_ARCHITECTURE.md` | ✅ |
| 2 | Product Capability Map | `docs/architecture/CAPABILITY_MAP.md` | ✅ |
| 3 | Domain Ownership Matrix | `docs/architecture/DOMAIN_OWNERSHIP.md` | ✅ |
| 4 | Design System Inventory | `docs/design-system/INVENTORY.md` | ✅ |
| 5 | Shared Component Inventory | `docs/architecture/SHARED_COMPONENTS.md` | ✅ |
| 6 | Technical Debt Reduction Plan | `docs/tech-debt/REDUCTION_PLAN.md` | ✅ |

---

## Remaining Architecture Deliverables (To Create in Later Phases)

| # | Deliverable | Phase | Description |
|---|-----------|-------|-------------|
| 7 | Folder Restructuring Plan | P3 | Exact `mv` commands for domain extraction |
| 8 | Route Hierarchy | P5 | New route definitions aligned to business language |
| 9 | Workspace Architecture | P5 | Panel layout, workspace session management |
| 10 | AI Platform Architecture | P2 | AI runtime, memory, tools, models |
| 11 | Artifact Synchronization Model | P5 | Cross-domain artifact sync via EventBus |
| 12 | Event-Driven Interaction Model | P4 | Business event → AI → Plan → Execute model |
| 13 | Dependency Graph | P3 | Domain interdependencies, shared contracts |
| 14 | State Management Strategy | P2 | Zustand + TanStack Query boundaries |
| 15 | Plugin Architecture | P2 | Plugin registry, lifecycle, permissions |
| 16 | Domain Communication Contracts | P3 | Zod schemas for inter-domain communication |
| 17 | Migration Roadmap | P7 | Detailed phase-by-phase migration timeline |
| 18 | Performance Plan | P7 | Lazy loading, streaming, virtualization |
| 19 | Security Boundaries | P2 | Auth, RBAC, tenant isolation, audit |
| 20 | Enterprise Scalability Strategy | P7 | Multi-region, replication, caching |

