# Shared Component Inventory — AHROS

## Purpose

Identify components currently embedded in specific products/domains that should be promoted to shared platform components for reuse across the enterprise.

---

## Candidates for Promotion

### Sidebar Components

| Component | Current Location | Used By | Promote To |
|-----------|-----------------|---------|-----------|
| `app-sidebar.tsx` | `components/dashboard-sidebar/` | Dashboard (HR) only | `components/platform/sidebar/` |
| `sidebar-data.ts` | `components/dashboard-sidebar/` | Dashboard only | `config/sidebar-data.ts` |
| `route-mapping.ts` | `components/dashboard-sidebar/` | Dashboard only | `config/routes.ts` |
| `sidebar-footer.tsx` | `components/dashboard-sidebar/` | Dashboard only | `components/platform/sidebar/` |
| `ProductSidebar.tsx` | `components/platform/` | All products | Already shared — keep |
| `ProductSwitcher.tsx` | `components/platform/` | All products | Already shared — keep |

**Action:** Unify into single sidebar system. `DashboardShell` and `ProductLayout` should use the same sidebar component.

### Header Components

| Component | Current Location | Used By | Promote To |
|-----------|-----------------|---------|-----------|
| `Header.tsx` | `components/dashboard-sidebar/` | Dashboard (HR) | `components/platform/header/` |
| `Header.tsx` | `components/platform/` | All products | Already shared — keep |
| `Navbar.tsx` | `components/dashboard-sidebar/` | Dashboard (HR) | `components/platform/header/` |

**Action:** Unify. The Dashboard header and Product header should be the same component with different configuration.

### Layout Components

| Component | Current Location | Used By | Promote To |
|-----------|-----------------|---------|-----------|
| `DashboardShell.tsx` | `components/layout/` | Dashboard routes | `components/platform/layout/` |
| `ProductLayout.tsx` | `components/platform/` | All products | Already shared — keep |
| `page-shell.tsx` | `components/layout/` | Various pages | Already shared — keep |

**Action:** Create unified `AppShell` that works for all products.

### AI Components

| Component | Current Location | Used By | Promote To |
|-----------|-----------------|---------|-----------|
| `agent.tsx` | `components/ai-elements/` | AI, Automation | Already shared |
| `conversation.tsx` | `components/ai-elements/` | AI, Dashboard | Already shared |
| `plan.tsx` | `components/ai-elements/` | AI, Automation | Already shared |
| `reasoning.tsx` | `components/ai-elements/` | AI | Already shared |
| `timeline.tsx` | `components/ai-elements/` | AI, Automation | Already shared |
| HR orchestrator comps | `app/[locale]/ai/hr-orchestrator/` | AI only | Extract to `components/ai/` |

### Chart Components

| Component | Current Location | Used By | Promote To |
|-----------|-----------------|---------|-----------|
| All charts | `components/charts/` | Dashboard, Analytics, Finance | Already shared |
| `ChartCard.tsx` | `components/charts/` | Multiple | Already shared |

### Module UI Components

| Component | Current Location | Used By | Promote To |
|-----------|-----------------|---------|-----------|
| Various | `components/modules/*/ui/` | Respective modules | KEEP in modules |
| `TenantCard` | `components/modules/tenant/ui/` | Admin/Dashboard | Could promote |
| `ComplianceDashboard` | `components/modules/compliance/ui/` | Compliance | KEEP in domain |
| `EmployeeTable` | `components/modules/employee/ui/` | People | Promote to domain |
| `PayrollTable` | `components/modules/payroll/ui/` | Payroll | KEEP in domain |
| `WorkflowBoard` | `components/modules/workflows/ui/` | Automation | KEEP in platform |
| `ESSPortal` | `components/modules/ess/ui/` | ESS | KEEP in domain |

---

## Duplicate Components (To Merge)

| Component | Location A | Location B | Action |
|-----------|-----------|-----------|--------|
| Header | `components/dashboard-sidebar/header.tsx` | `components/platform/Header.tsx` | MERGE — keep platform version |
| Sidebar | `components/dashboard-sidebar/app-sidebar.tsx` | `components/platform/ProductSidebar.tsx` | MERGE — create unified sidebar |
| Layout | `components/layout/DashboardShell.tsx` | `components/platform/ProductLayout.tsx` | MERGE — create AppShell |
| Modal | `components/layout/GlassModal.tsx` | Radix `dialog.tsx` | Standardize on Radix |
| Navbar | `components/dashboard-sidebar/navbar.tsx` | Platform breadcrumb | MERGE |

---

## Shared Feature Groups

### Search Infrastructure

| Component | Location | Notes |
|-----------|----------|-------|
| Global search UI | `components/platform/Search.tsx` | Already shared |
| Semantic search UI | `app/[locale]/ai/semantic-search/` | Domain-specific |
| Search backend | `lib/kb/`, `lib/embeddings.ts` | Already shared |
| KB chat | `components/dashboard-sidebar/kb-chat.tsx` | Embedded in sidebar |

**Action:** Create unified search platform with global search + semantic search + KB.

### Notification Infrastructure

| Component | Location | Notes |
|-----------|----------|-------|
| Notification hooks | `hooks/useNotification.ts` | Already shared |
| UI components | `components/features/notifications/` | Domain-specific |
| Dispatch service | `lib/notification-dispatch.ts` | Already shared |
| ESS notifications | `ess/` pages | Viewing own notifications |

**Action:** Create centralized notification center with configurable preferences.

### Compliance Components

| Component | Location | Notes |
|-----------|----------|-------|
| Compliance dashboard | `app/[locale]/dashboard/compliance/` | HR compliance |
| ISO compliance | `app/[locale]/iso/` | ISO-specific |
| Compliance AI | `app/[locale]/ai/compliance/` | AI-assisted |
| Compliance engine | `lib/compliance-engine.ts` | Core logic |
| Compliance reporter | `lib/ahros/compliance-reporter.ts` | AHROS integration |

**Action:** Unify under Compliance Platform with shared components.

---

## Shared Hook Inventory

| Hook | Already Shared? | Notes |
|------|---------------|-------|
| `useDebounce` | ✅ | |
| `useMobile` | ✅ | |
| `useToast` | ✅ | |
| `useKeyboardShortcuts` | ✅ | |
| `useClipboard` | ✅ | |
| `useTheme` | ✅ | |
| `useTranslation` | ✅ | |
| `useSearchParams` | ✅ | |
| `useGeolocation` | ❌ | Used by Foreign Workers — should stay in domain |
| `useRag` | ❌ | AI-specific — should stay in AI Platform |
| `useAiChat` | ❌ | AI-specific |
| `useSemanticSearch` | ❌ | AI-specific |

---

## Shared Utility Inventory

| Util | Already Shared? | Location |
|------|---------------|----------|
| `cn()` (clsx + tailwind-merge) | ✅ | `lib/utils.ts` |
| `formatCurrency()` | ✅ | `lib/utils.ts` |
| `formatDate()` | ✅ | Via date-fns |
| `motionVariants` | ✅ | `lib/motion-variants.ts` |
| `localeUtils` | ✅ | `lib/locale-utils.ts` |
| `env` | ✅ | `lib/env.ts` |

---

## Migration Strategy

### Phase 1: Identify & Map
- [x] Complete this inventory
- [ ] Add ownership labels to all shared components

### Phase 2: Promote & Merge
- [ ] Merge Header components
- [ ] Merge Sidebar components
- [ ] Create unified AppShell
- [ ] Promote search to platform service

### Phase 3: Standardize
- [ ] All shared components use the same patterns
- [ ] All shared components have TypeScript types
- [ ] All shared components have loading/empty/error states
- [ ] All shared components support className prop

### Phase 4: Document
- [ ] Component API documentation
- [ ] Usage examples
- [ ] Storybook stories for all shared components
