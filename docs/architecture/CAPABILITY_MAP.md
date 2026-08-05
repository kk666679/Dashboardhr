# Product Capability Map — AHROS

## Purpose

Map every existing feature and page to its future architectural layer and bounded domain. Identify overlaps, gaps, and migration candidates.

---

## Mapping Convention

```
[Layer] / [Domain] / [Capability]
  → Current Location(s)
  → Status: EXISTING | PARTIAL | MISSING | DUPLICATE
  → Migration: KEEP | MOVE | MERGE | DEPRECATE | CREATE
```

---

## Platform Layer Capabilities

### Authentication & Authorization

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Login | `app/[locale]/login/` | EXISTING | KEEP |
| MFA | `app/[locale]/login/mfa/` | EXISTING | KEEP |
| Session management | `lib/session/`, `lib/neon-auth.ts` | PARTIAL | MOVE to `domains/platform/auth/` |
| RBAC | `lib/security/abac.ts` | PARTIAL | MOVE to `domains/platform/permissions/` |
| Tenant isolation | `lib/security/abac.ts` (stub) | PARTIAL | FIX — hardcoded tenantId |

### Organization

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Company profile | `app/[locale]/dashboard/organisation/` | EXISTING | MOVE to `domains/platform/org/` |
| Org chart | `components/features/company/` | PARTIAL | KEEP in People domain |

### Notifications

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| In-app notifications | `hooks/useNotification.ts`, `components/features/notifications/` | PARTIAL | MOVE to `domains/platform/notifications/` |
| Notification dispatch | `lib/notification-dispatch.ts` | PARTIAL | MOVE |
| Push notifications | Not implemented | MISSING | CREATE |

### Settings

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| General settings | `app/[locale]/dashboard/settings/` | EXISTING | MOVE to `domains/platform/settings/` |
| Avatar | `app/[locale]/dashboard/settings/avatar/` | EXISTING | MOVE |
| Pricing | `app/[locale]/dashboard/settings/pricing/` | EXISTING | MOVE |
| Subscription | `app/[locale]/dashboard/subscription/` | EXISTING | MOVE |

### Search

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Semantic search | `app/[locale]/ai/semantic-search/`, `hooks/useSemanticSearch.ts` | EXISTING | MOVE to `domains/platform/search/` |
| Global search | Not implemented | MISSING | CREATE |

### Audit

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Audit trail | `app/[locale]/dashboard/audit-trail/` | PARTIAL | MOVE to `domains/platform/audit/` |
| SopAuditEvent | `prisma/schema.prisma` (SopAuditEvent) | PARTIAL | Generalize to platform AuditLog |

---

## Executive Dashboard Capabilities

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| KPI overview | `app/[locale]/dashboard/page.tsx` → `ExecutiveOverview` | EXISTING | ENHANCE — add AI summary |
| Analytics charts | `app/[locale]/dashboard/analytics/`, `components/charts/` | EXISTING | ENHANCE |
| Recent activity | `RecentActivity` component | EXISTING | ENHANCE |
| Right rail (events) | `RightRail` component | EXISTING | ENHANCE — add pending work |
| AI daily briefing | Not implemented | MISSING | CREATE |
| Compliance health widget | Not implemented | MISSING | CREATE |
| Workflow status widget | Not implemented | MISSING | CREATE |

---

## Business Domain Capabilities

### People Domain

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Employee list | `app/[locale]/employees/`, `app/[locale]/dashboard/workers/` | EXISTING | MERGE — duplicate |
| Employee detail | `app/[locale]/employees/[id]/` | EXISTING | KEEP |
| Add employee | `app/[locale]/employees/new/`, `app/[locale]/dashboard/workers/add/` | DUPLICATE | MERGE |
| Employee lifecycle | `app/[locale]/dashboard/lifecycle/` | EXISTING | MOVE to People domain |
| Organisation chart | `app/[locale]/dashboard/organisation/` | EXISTING | MOVE to People domain |
| Workforce planning | `app/[locale]/dashboard/workforce-planning/` | EXISTING | MOVE to People domain |
| Employee relations | `app/[locale]/dashboard/employee-relations/` | EXISTING | MOVE to People domain |
| Industrial relations | `app/[locale]/dashboard/industrial-relations/` | EXISTING | MOVE to People domain |
| Health & safety | `app/[locale]/dashboard/health-safety/` | EXISTING | MOVE to People domain |
| Travel | `app/[locale]/dashboard/travel/` | EXISTING | MOVE to People domain |

**Overlaps:** Workers page exists in both `/dashboard/workers` and `/employees` — merge required.

### Recruitment Domain

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Job postings | `app/[locale]/dashboard/recruitment/` | EXISTING | MOVE to `domains/recruitment/` |
| Talent acquisition | `app/[locale]/dashboard/talent-acquisition/` | DUPLICATE | MERGE with recruitment |
| Candidates | Not extracted | PARTIAL | CREATE |
| Interviews | Not extracted | MISSING | CREATE |
| Offers | Not extracted | MISSING | CREATE |

**Overlaps:** Recruitment and Talent Acquisition are separate routes — should be merged.

### Onboarding Domain

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Onboarding dashboard | `app/[locale]/dashboard/onboarding/` | EXISTING | MOVE to `domains/onboarding/` |
| New employee onboarding | `app/[locale]/employees/onboarding/` | DUPLICATE | MERGE |
| Onboarding checklist | Not extracted | MISSING | CREATE |

### Offboarding Domain

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Offboarding list | `app/[locale]/dashboard/offboarding/` | EXISTING | MOVE to `domains/offboarding/` |
| Employee offboarding | `app/[locale]/employees/offboarding/` | DUPLICATE | MERGE |
| Termination | `app/[locale]/dashboard/termination/` | EXISTING | MOVE to Offboarding domain |
| Clearance | Not extracted | MISSING | CREATE |

### Payroll Domain

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Payroll dashboard | `app/[locale]/dashboard/payroll/` | EXISTING | MOVE to `domains/payroll/` |
| Payroll runs | `app/[locale]/dashboard/payroll/[runId]/` | EXISTING | MOVE |
| Statutory | `app/[locale]/dashboard/payroll/statutory/` | EXISTING | MOVE |
| Payroll calculator | `app/[locale]/accounting/payroll-calculator/` | EXISTING | MOVE |
| Payslips | `app/[locale]/ess/payslips/` | EXISTING | KEEP in ESS |
| Compensation | `app/[locale]/dashboard/compensation/` | EXISTING | MOVE to Payroll domain |
| Benefits | `app/[locale]/dashboard/benefits/` | EXISTING | MOVE to Payroll domain |
| Payroll AI | `app/[locale]/ai/payroll/` | EXISTING | MOVE AI to domain |

### Attendance Domain

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Scheduling | `app/[locale]/dashboard/scheduling/` | EXISTING | MOVE to `domains/attendance/` |
| Attendance | Not extracted | MISSING | CREATE |
| Time tracking | Not extracted | MISSING | CREATE |
| ESS attendance | `app/[locale]/mss/attendance/` | EXISTING | MOVE |

### Leave Domain

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Leave management | `app/[locale]/dashboard/leave/` | EXISTING | MOVE to `domains/leave/` |
| ESS leave | `app/[locale]/ess/leave/` | EXISTING | KEEP in ESS |
| MSS leave | `app/[locale]/mss/approvals/` | EXISTING | KEEP in MSS |
| Leave AI | `app/[locale]/ai/employee/` (partial) | PARTIAL | INTEGRATE |

### Performance Domain

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Performance reviews | `app/[locale]/dashboard/performance/` | EXISTING | MOVE to `domains/performance/` |
| New review | `app/[locale]/dashboard/performance/new/` | EXISTING | MOVE |
| MSS performance | `app/[locale]/mss/performance/` | EXISTING | KEEP in MSS |
| Succession | `app/[locale]/dashboard/succession/` | EXISTING | MOVE to Performance domain |
| Goals | Not extracted | MISSING | CREATE |

### Learning Domain

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Learning & development | `app/[locale]/dashboard/learning-development/` | EXISTING | MOVE to `domains/learning/` |
| ESS training | `app/[locale]/ess/training/` | EXISTING | KEEP in ESS |

### Foreign Workers Domain

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Foreign workers | `app/[locale]/employees/foreign-workers/` | EXISTING | MOVE to `domains/foreign-workers/` |
| Expatriates | `app/[locale]/employees/expatriates/`, `app/[locale]/dashboard/expatriates/` | DUPLICATE | MERGE |
| Permits | `app/[locale]/dashboard/permits/` | EXISTING | MOVE |
| Visa renewal | `app/[locale]/dashboard/permits/visa-renewal/` | EXISTING | MOVE |
| FOMEMA | `app/[locale]/dashboard/medical/fomema/` | EXISTING | MOVE |
| Accommodation | `app/[locale]/dashboard/accommodation/` | EXISTING | MOVE |
| Geolocation | `app/[locale]/dashboard/geolocation/` | EXISTING | MOVE |
| Medical | `app/[locale]/dashboard/medical/` | EXISTING | MOVE |
| Expat AI | `app/[locale]/ai/expat/` | EXISTING | MOVE AI to domain |

### Compliance Domain

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Compliance dashboard | `app/[locale]/dashboard/compliance/` | EXISTING | MOVE to `domains/compliance/` |
| Audit | `app/[locale]/dashboard/compliance/audit/new/` | EXISTING | MOVE |
| Zakat | `app/[locale]/dashboard/compliance/zakat/` | EXISTING | MOVE |
| ISO dashboard | `app/[locale]/iso/` | EXISTING | MOVE |
| ISO audit checklist | `app/[locale]/iso/audit-checklist/` | EXISTING | MOVE |
| CAPA | `app/[locale]/iso/capa-create/` | EXISTING | MOVE |
| Fishbone | `app/[locale]/iso/fishbone/` | EXISTING | MOVE |
| 5 Whys | `app/[locale]/iso/five-whys/` | EXISTING | MOVE |
| Gap analysis | `app/[locale]/iso/gap-analysis/` | EXISTING | MOVE |
| Compliance AI | `app/[locale]/ai/compliance/` | EXISTING | MOVE AI to domain |

### Finance Domain

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Accounting overview | `app/[locale]/accounting/` | EXISTING | MOVE to `domains/finance/` |
| Invoices | `app/[locale]/accounting/invoices/` | EXISTING | MOVE |
| Delivery orders | `app/[locale]/accounting/delivery-orders/` | EXISTING | MOVE |
| Credit notes | `app/[locale]/accounting/credit-notes/` | EXISTING | MOVE |
| Debit notes | `app/[locale]/accounting/debit-notes/` | EXISTING | MOVE |
| E-Invoice | `app/[locale]/accounting/e-invoice/` | EXISTING | MOVE |
| Financial reports | `app/[locale]/accounting/reports/` | EXISTING | MOVE |
| Tax calculator | `app/[locale]/accounting/tax-calculator/` | EXISTING | MOVE |
| Government submissions | `app/[locale]/accounting/government-submissions/` | EXISTING | MOVE |

### Documents Domain

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Document list | `app/[locale]/dashboard/documents/` | EXISTING | MOVE to `domains/documents/` |
| Document generation | `app/[locale]/ai/doc-generator/` | EXISTING | MOVE |
| SOPs | `app/[locale]/dashboard/sops/` | EXISTING | MOVE to Knowledge Platform |
| PDF generator | `app/[locale]/dashboard/pdf-generator/` | EXISTING | MOVE |

### Assets Domain

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Asset list | `app/[locale]/capex/assets/` | EXISTING | MOVE to `domains/assets/` |
| Budget | `app/[locale]/capex/budget/` | EXISTING | MOVE |
| ESS assets | `app/[locale]/ess/assets/` | EXISTING | KEEP in ESS |

### Projects Domain

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Projects | `app/[locale]/capex/projects/` | EXISTING | MOVE to `domains/projects/` |
| ROI analysis | `app/[locale]/capex/roi/` | EXISTING | MOVE |

---

## AI Platform Capabilities

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| AI Hub | `app/[locale]/ai/` | EXISTING | RESTRUCTURE as AI Platform |
| Chat Hub | `app/[locale]/ai/chat-hub/` | EXISTING | MOVE to `ai/conversation/` |
| KB Chat | `app/[locale]/ai/kb-chat/` | EXISTING | MOVE to `ai/knowledge/` |
| HR Orchestrator | `app/[locale]/ai/hr-orchestrator/` | EXISTING | MOVE to `ai/runtime/` |
| Document Generator | `app/[locale]/ai/doc-generator/` | EXISTING | MOVE to Documents domain |
| Compliance AI | `app/[locale]/ai/compliance/` | EXISTING | MOVE to Compliance domain |
| Payroll AI | `app/[locale]/ai/payroll/` | EXISTING | MOVE to Payroll domain |
| Recruitment AI | `app/[locale]/ai/recruitment/` | EXISTING | MOVE to Recruitment domain |
| Employee AI | `app/[locale]/ai/employee/` | EXISTING | MOVE to People domain |
| Expat AI | `app/[locale]/ai/expat/` | EXISTING | MOVE to Foreign Workers domain |
| Semantic search | `app/[locale]/ai/semantic-search/` | EXISTING | MOVE to `domains/platform/search/` |

---

## Automation Platform Capabilities

| Capability | Current Location | Status | Migration |
|-----------|-----------------|--------|-----------|
| Automation overview | `app/[locale]/automation/` | EXISTING | RESTRUCTURE |
| Flow Designer | `app/[locale]/automation/designer/` | EXISTING | ENHANCE to Flow Studio |
| Flow Process | `app/[locale]/automation/flow-process/` | EXISTING | MERGE with Designer |
| Workflow Engine | `app/[locale]/automation/workflow-engine/` | EXISTING | ENHANCE |
| Execution Monitor | `app/[locale]/automation/monitor/` | EXISTING | ENHANCE |
| QMS | `app/[locale]/automation/qms/` | EXISTING | MOVE to Compliance domain |
| SOP Workflows | `app/[locale]/automation/sops/` | EXISTING | MOVE to Knowledge Platform |
| Analytics | `app/[locale]/automation/analytics/` | EXISTING | KEEP |
| Templates | `app/[locale]/automation/templates/` | EXISTING | ENHANCE |

---

## Capability Gap Summary

| Missing Capability | Priority | Domain | Notes |
|-------------------|----------|--------|-------|
| Global command palette | P0 | Platform | Cmd+K search across all domains |
| AI daily briefing | P0 | Executive Dashboard | AI-generated daily summary |
| Compliance health widget | P0 | Executive Dashboard | Real-time compliance score |
| Workflow status monitor | P0 | Automation Platform | Active execution dashboard |
| Employee self-service portal | P0 | People | ESS enhancements |
| Manager self-service hub | P0 | People | MSS enhancements |
| Knowledge base management | P0 | Knowledge Platform | SOP, playbook, report library |
| Onboarding checklist engine | P1 | Onboarding | Dynamic checklist generation |
| Offboarding clearance workflow | P1 | Offboarding | Multi-step clearance process |
| Attendance tracking | P1 | Attendance | Clock in/out, schedule |
| Time-off request workflow | P1 | Leave | Approval flow, balance tracking |
| Performance goals | P1 | Performance | OKR/KPI tracking |
| Learning paths | P1 | Learning | Course recommendations |
| Document e-signatures | P1 | Documents | Digital signature workflow |
| Vendor management | P2 | Vendors | Vendor onboarding, contracts |
| Procurement | P2 | Finance | Purchase orders, approvals |
| Contract management | P2 | Documents | Contract lifecycle |
| Plugin marketplace | P2 | Platform | Third-party extensions |
| White-label branding | P2 | Platform | Tenant-specific theming |

---

## Duplicate Capabilities Report

| Capability | Locations | Action |
|-----------|-----------|--------|
| Workers list | `/dashboard/workers`, `/employees` | MERGE into People domain |
| Onboarding | `/dashboard/onboarding`, `/employees/onboarding` | MERGE into Onboarding domain |
| Offboarding | `/dashboard/offboarding`, `/employees/offboarding` | MERGE into Offboarding domain |
| Recruitment vs Talent Acquisition | `/dashboard/recruitment`, `/dashboard/talent-acquisition` | MERGE into Recruitment domain |
| Expatriates | `/dashboard/expatriates`, `/employees/expatriates` | MERGE into Foreign Workers domain |
| Compensation | `/dashboard/compensation`, `/dashboard/compensation-benefits` | MERGE into Payroll domain |
| Add Worker vs New Employee | `/dashboard/workers/add`, `/employees/new` | MERGE into People domain |
