# Design System Inventory — AHROS

## Purpose

Catalog every existing UI component, identify gaps for an enterprise design system, and define the foundation tokens needed.

---

## Current State

### Existing Primitives (`components/ui/`) — 60+ components

| Component | Status | Notes |
|-----------|--------|-------|
| `accordion.tsx` | ✅ Stable | Radix-based |
| `alert-dialog.tsx` | ✅ Stable | |
| `alert.tsx` | ✅ Stable | |
| `aspect-ratio.tsx` | ✅ Stable | |
| `avatar.tsx` | ✅ Stable | |
| `badge.tsx` | ✅ Stable | Has `solid` variant |
| `breadcrumb.tsx` | ✅ Stable | |
| `button.tsx` | ✅ Stable | Multiple variants |
| `button-group.tsx` | ✅ Stable | |
| `calendar.tsx` | ✅ Stable | |
| `card.tsx` | ✅ Stable | |
| `carousel.tsx` | ✅ Stable | Embla-based |
| `chart.tsx` | ✅ Stable | Recharts wrapper |
| `checkbox.tsx` | ✅ Stable | |
| `collapsible.tsx` | ✅ Stable | |
| `command.tsx` | ✅ Stable | cmdk-based |
| `context-menu.tsx` | ✅ Stable | |
| `dialog.tsx` | ✅ Stable | |
| `drawer.tsx` | ✅ Stable | Vaul-based |
| `dropdown-menu.tsx` | ✅ Stable | |
| `enhanced-animated-button.tsx` | ✅ Stable | |
| `form.tsx` | ✅ Stable | react-hook-form |
| `hover-card.tsx` | ✅ Stable | |
| `input.tsx` | ✅ Stable | |
| `input-group.tsx` | ✅ Stable | |
| `input-otp.tsx` | ✅ Stable | MFA support |
| `label.tsx` | ✅ Stable | |
| `language-switcher.tsx` | ✅ Stable | |
| `Logo.tsx` | ✅ Stable | |
| `marquee.tsx` | ✅ Stable | |
| `menubar.tsx` | ✅ Stable | |
| `navigation-menu.tsx` | ✅ Stable | |
| `pagination.tsx` | ✅ Stable | |
| `popover.tsx` | ✅ Stable | |
| `progress.tsx` | ✅ Stable | |
| `radio-group.tsx` | ✅ Stable | |
| `resizable.tsx` | ✅ Stable | react-resizable-panels |
| `scroll-area.tsx` | ✅ Stable | |
| `select.tsx` | ✅ Stable | |
| `separator.tsx` | ✅ Stable | |
| `sheet.tsx` | ✅ Stable | |
| `sidebar.tsx` | ✅ Stable | shadcn sidebar |
| `skeleton.tsx` | ✅ Stable | |
| `slider.tsx` | ✅ Stable | |
| `sonner.tsx` | ✅ Stable | Toast system |
| `spinner.tsx` | ✅ Stable | |
| `steps.tsx` | ✅ Stable | |
| `switch.tsx` | ✅ Stable | |
| `table.tsx` | ✅ Stable | |
| `tabs.tsx` | ✅ Stable | |
| `textarea.tsx` | ✅ Stable | |
| `theme-toggle.tsx` | ✅ Stable | |
| `toast.tsx` | ✅ Stable | |
| `toaster.tsx` | ✅ Stable | |
| `toggle-group.tsx` | ✅ Stable | |
| `toggle.tsx` | ✅ Stable | |
| `tooltip.tsx` | ✅ Stable | |

### Existing AI Elements (`components/ai-elements/`) — 40+ components

| Component | Status | Notes |
|-----------|--------|-------|
| `agent.tsx` | ✅ Stable | Agent card UI |
| `artifact.tsx` | ✅ Stable | Artifact display |
| `attachments.tsx` | ✅ Stable | |
| `audio-player.tsx` | ✅ Stable | |
| `canvas.tsx` | ✅ Stable | |
| `chain-of-thought.tsx` | ✅ Stable | |
| `checkpoint.tsx` | ✅ Stable | |
| `code-block.tsx` | ✅ Stable | Shiki-based |
| `confirmation.tsx` | ✅ Stable | |
| `connection.tsx` | ✅ Stable | |
| `context.tsx` | ✅ Stable | |
| `controls.tsx` | ✅ Stable | |
| `conversation.tsx` | ✅ Stable | Chat UI |
| `edge.tsx` | ✅ Stable | Flow edge |
| `file-tree.tsx` | ✅ Stable | |
| `hr-agent-card.tsx` | ✅ Stable | |
| `image.tsx` | ✅ Stable | |
| `inline-citation.tsx` | ✅ Stable | |
| `jsx-preview.tsx` | ✅ Stable | |
| `message.tsx` | ✅ Stable | |
| `mic-selector.tsx` | ✅ Stable | |
| `model-selector.tsx` | ✅ Stable | |
| `node.tsx` | ✅ Stable | Flow node |
| `open-in-chat.tsx` | ✅ Stable | |
| `package-info.tsx` | ✅ Stable | |
| `panel.tsx` | ✅ Stable | |
| `persona.tsx` | ✅ Stable | |
| `plan.tsx` | ✅ Stable | |
| `prompt-input.tsx` | ✅ Stable | |
| `queue.tsx` | ✅ Stable | |
| `reasoning.tsx` | ✅ Stable | |
| `sandbox.tsx` | ✅ Stable | |
| `schema-display.tsx` | ✅ Stable | |
| `shimmer.tsx` | ✅ Stable | Text shimmer |
| `snippet.tsx` | ✅ Stable | |
| `sources.tsx` | ✅ Stable | |
| `speech-input.tsx` | ✅ Stable | |
| `stack-trace.tsx` | ✅ Stable | |
| `steps.tsx` | ✅ Stable | |
| `suggestion.tsx` | ✅ Stable | |
| `task.tsx` | ✅ Stable | |
| `terminal.tsx` | ✅ Stable | |
| `test-results.tsx` | ✅ Stable | |
| `timeline.tsx` | ✅ Stable | |
| `tool.tsx` | ✅ Stable | |
| `toolbar.tsx` | ✅ Stable | |
| `transcription.tsx` | ✅ Stable | |
| `voice-selector.tsx` | ✅ Stable | |
| `web-preview.tsx` | ✅ Stable | |

### Existing Charts (`components/charts/`)

| Component | Status | Notes |
|-----------|--------|-------|
| `ActivityChart.tsx` | ✅ Stable | |
| `AreaChart.tsx` | ✅ Stable | |
| `BarChart.tsx` | ✅ Stable | |
| `ChartCard.tsx` | ✅ Stable | |
| `ChartContainer.tsx` | ✅ Stable | |
| `Heatmap.tsx` | ✅ Stable | |
| `LineChart.tsx` | ✅ Stable | |
| `PieChart.tsx` | ✅ Stable | |
| `RadarChart.tsx` | ✅ Stable | |
| `smart-analytics.tsx` | ✅ Stable | |

---

## Design Token Foundations (MISSING — To Create)

The following design tokens need to be codified in a single source of truth:

### Typography

```
--font-sans: Inter, system-ui, sans-serif
--font-mono: JetBrains Mono, monospace

--text-xs:   0.75rem  (12px)  line-height: 1rem
--text-sm:   0.875rem (14px)  line-height: 1.25rem
--text-base: 1rem     (16px)  line-height: 1.5rem
--text-lg:   1.125rem (18px)  line-height: 1.75rem
--text-xl:   1.25rem  (20px)  line-height: 1.75rem
--text-2xl:  1.5rem   (24px)  line-height: 2rem
--text-3xl:  1.875rem (30px)  line-height: 2.25rem
--text-4xl:  2.25rem  (36px)  line-height: 2.5rem
--text-5xl:  3rem     (48px)  line-height: 1

--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### Spacing (4px Grid)

```
--space-0.5: 0.125rem (2px)
--space-1:   0.25rem  (4px)
--space-1.5: 0.375rem (6px)
--space-2:   0.5rem   (8px)
--space-2.5: 0.625rem (10px)
--space-3:   0.75rem  (12px)
--space-3.5: 0.875rem (14px)
--space-4:   1rem     (16px)
--space-5:   1.25rem  (20px)
--space-6:   1.5rem   (24px)
--space-8:   2rem     (32px)
--space-10:  2.5rem   (40px)
--space-12:  3rem     (48px)
--space-16:  4rem     (64px)
--space-20:  5rem     (80px)
--space-24:  6rem     (96px)
```

### Colors (Semantic Tokens)

#### Brand
```
--brand:             <primary color>
--brand-muted:       <primary at 10-15% opacity>
--brand-hover:       <primary at 10% darker>
--brand-foreground:  <text on brand>
```

#### Background
```
--background:           page background
--background-subtle:    card/panel background
--background-hover:     hover state
--background-active:    active state
```

#### Foreground (Text)
```
--foreground:           primary text
--foreground-muted:     secondary text
--foreground-subtle:    tertiary/hint text
--foreground-inverse:   text on dark backgrounds
```

#### Border
```
--border:               default border
--border-subtle:        subtle divider
--border-hover:         hover state border
--border-active:        active state border
```

#### Sidebar
```
--sidebar:              sidebar background
--sidebar-border:       sidebar borders
--sidebar-accent:       hover/active item bg
--sidebar-foreground:   sidebar text
```

#### Status
```
--status-success:       green (pass, compliant)
--status-warning:       amber (warning, pending)
--status-danger:        red (fail, critical)
--status-info:          blue (info, neutral)
--status-neutral:       gray (not applicable)
```

### Motion

```
--duration-instant:  0ms
--duration-fast:     100ms
--duration-normal:   200ms  
--duration-slow:     300ms
--duration-slugish:  500ms

--ease-default:     cubic-bezier(0.32, 0.72, 0, 1)
--ease-in:          cubic-bezier(0.4, 0, 1, 1)
--ease-out:         cubic-bezier(0, 0, 0.2, 1)
--ease-in-out:      cubic-bezier(0.4, 0, 0.2, 1)
--ease-bounce:      spring(300, 30)
```

### Elevation

```
--shadow-xs:    0 1px 2px rgba(0,0,0,0.05)
--shadow-sm:    0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
--shadow-md:    0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)
--shadow-lg:    0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
--shadow-xl:    0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)

--z-base:       0
--z-dropdown:   50
--z-sticky:     100
--z-overlay:    200
--z-modal:      300
--z-toast:      400
--z-tooltip:    500
```

---

## Missing Enterprise Components (To Create)

| Component | Priority | Description | Dependencies |
|-----------|----------|-------------|--------------|
| **DataGrid** | P0 | Sortable, filterable, virtualized data table with column resize, export | `@tanstack/react-table` |
| **Timeline** | P0 | Horizontal/vertical timeline with branching, zoom, step details | Existing `ai-elements/timeline.tsx` |
| **WorkflowCanvas** | P0 | Drag-and-drop workflow builder with nodes, edges, zoom | `@xyflow/react` (installed) |
| **ArtifactViewer** | P0 | Artifact display with version history, diff view, rollback | Existing registry |
| **KnowledgeTree** | P0 | Hierarchical knowledge browser with search, expand/collapse | |
| **ReasoningPanel** | P0 | AI reasoning chain with step-by-step visualization | Existing `ai-elements/reasoning.tsx` |
| **ExecutionMonitor** | P0 | Real-time execution status, progress, logs | |
| **ApprovalCards** | P1 | Approval request/review cards with actions | |
| **StatusIndicators** | P1 | Unified status badge system with icon, color, label | Existing `badge.tsx` |
| **AIPanels** | P1 | AI copilot, context, sources panels | Existing ai-elements |
| **MetricCard** | P1 | KPI/metric display card with trend, sparkline | |
| **ActivityFeed** | P1 | Scrollable activity feed with grouped events | |
| **FormBuilder** | P2 | Dynamic form generation from JSON schema | `@hookform/resolvers` |
| **KanbanBoard** | P2 | Drag-and-drop Kanban board | `@dnd-kit` (installed) |
| **GanttChart** | P2 | Project timeline visualization | |
| **Wizard** | P2 | Multi-step guided workflow wizard | |
| **SplitPane** | P2 | Resizable split panels | `react-resizable-panels` (installed) |
| **NotificationsDropdown** | P2 | Notification center with grouping | |
| **CommandPalette** | P0 | Cmd+K global command palette | `cmdk` (installed) |
| **FileUpload** | P1 | Drag-and-drop file upload with preview | |
| **SignaturePad** | P2 | E-signature capture | |
| **QRCode** | P2 | QR code generation and scanning | |
| **Barcode** | P2 | Barcode scanning support | |
| **MapView** | P1 | Interactive map component | `leaflet` (installed) |
| **MicrophoneButton** | P1 | Voice input button with recording state | Existing |
| **AIStreamingText** | P0 | Animated streaming text component | |

---

## Existing Charts Inventory

| Chart | Type | Customizable | Responsive | Animated |
|-------|------|-------------|------------|----------|
| ActivityChart | Activity/heatmap | ✅ | ✅ | ✅ |
| AreaChart | Area | ✅ | ✅ | ✅ |
| BarChart | Bar | ✅ | ✅ | ✅ |
| Heatmap | Heatmap | ✅ | ✅ | ✅ |
| LineChart | Line | ✅ | ✅ | ✅ |
| PieChart | Pie/Doughnut | ✅ | ✅ | ✅ |
| RadarChart | Radar | ✅ | ✅ | ✅ |
| smart-analytics | Composite | ✅ | ✅ | ✅ |

---

## Component Architecture Rules

1. **All primitives** must use `cn()` from `lib/utils.ts` for class merging
2. **All components** must support `className` prop for customization
3. **Interactive components** must support `disabled` state
4. **Form components** must support `error` state with error message
5. **All components** must have proper aria attributes
6. **AI elements** should support `streaming` prop for loading states
7. **Enterprise components** should support `loading`, `empty`, `error` states
8. **All new components** must have TypeScript strict types exported
9. **Animation** should respect `prefers-reduced-motion`
10. **Theme support** via CSS variables and `class` strategy
