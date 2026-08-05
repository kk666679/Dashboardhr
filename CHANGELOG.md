# Changelog

All notable changes to the FWMS project are documented here. This file tracks sprint progress, features, and fixes aligned with the [MILESTONES.md](./MILESTONES.md) roadmap.

## Unreleased

### Sprint 1 — Build Recovery & Technical Stabilization
**Status:** IN PROGRESS (Target: June 21, 2026)

#### Fixed

- **docs: sync OpenClaw AI agent framework documentation & registries**
  - Reconciled `skills-registry.json` (v2.2.0) with `agent-registry.json` (35 agents / 122 referenced skills):
    all 84 previously-missing skill references are now defined (123 total, 15 categories)
  - Updated `.openclaw/docs/*.md` (AGENTS, SKILL, ARCHITECTURE_SUMMARY, GAP_ANALYSIS,
    MIGRATION_SUMMARY, KNOWLEDGE_MAP, AGENT_INTERACTION) with accurate agent/skill counts
  - Filled `.openclaw/README_AI.md` with the full AI framework guide
  - Added OpenClaw framework references to root `README.md` and `docs/README.md`
  - Files: `.openclaw/config/skills-registry.json`, `.openclaw/docs/*.md`,
    `.openclaw/README_AI.md`, `README.md`, `docs/README.md`
- **fix: correct @xyflow/react imports and missing module exports** (#S1C1)
  - Wrapped `ShapeNode` component in `React.memo()` to properly export as React component
  - Resolved React Flow node type mismatch in FlowDesigner
  - File: `components/features/automation/shapes/shape-node.tsx`
  - ✅ `npm run build` now passes
  - ✅ `tsc --noEmit` passes

#### Pending

- `fix: strongly type React Flow nodes and edge payloads` (#S1C2)
- `fix: align AI widgets with hook contracts` (#S1C3)
- `refactor: remove stale expatriate code paths` (#S1C4)
- `fix: add expiryStats to DashboardViewModel mapper` (#S1C5)
- `fix: resolve embeddings and knowledge-base typing issues` (#S1C6)
- `fix: resolve remaining tRPC router export issues` (#S1C7)
- `ci: add build gate and typecheck workflow` (#S1C8)

#### Metrics

| Metric | Current | Target |
|--------|---------|--------|
| TypeScript Errors | ~150 | **0** |
| Build Time | ~90s | <120s |
| Automation Module | ✅ Compiling | ✅ Compiling |
| CI Gate | 🟡 Partial | ✅ Full |

---

## Versioning

FWMS uses [Semantic Versioning](https://semver.org/):

- **Major (X.0.0):** Sprint completion, architecture changes
- **Minor (0.X.0):** Feature sprint completion
- **Patch (0.0.X):** Bug fixes and hotfixes

### Current Version
- **Development**: 0.1.0-sprint-1 (Build Recovery Phase)
- **Last Stable**: Not yet released

---

## [1.0.0] — TBD

### Planned for v1.0.0 Release

Completion of Sprints 1–3 and stabilization of:

- ✅ Foreign worker lifecycle management (CRUD, permits, visas)
- ✅ Automated renewal reminders and escalation workflows
- ✅ FOMEMA medical tracking and compliance alerts
- ✅ HR synchronization and audit trails
- ✅ React Flow workflow execution engine
- ✅ Dashboard analytics and reporting

**Expected Release:** Q3 2026

---

## Migration Guides

None yet — project is pre-release.

---

## Known Issues

### High Priority

- **React Flow Automation Module Compilation:** Partially resolved in #S1C1; type guards pending in #S1C2
- **Duplicate Expatriate Models:** Two canonical representations exist; consolidation planned in #S1C4

### Medium Priority

- **Dashboard Stats Hardcoded:** Using mocks instead of live data; wiring to DB in #S1C5
- **embeddings Client Type Mismatches:** Schema validation needed in #S1C6

### Low Priority

- **Geolocation Map Rendering:** Error about width/height constraints (cosmetic warning)
- **Clipboard API Permissions:** Disabled in non-HTTPS contexts (expected behavior)

---

## Support

For issues, blockers, or questions:

1. Check [SPRINT_1_TRACKER.md](./SPRINT_1_TRACKER.md) for current scope and blockers
2. File issues with `sprint-1` label if blocking current sprint
3. Contact the development team via Slack #fwms-sprint-1-recovery

---

## Maintainers

- **Platform Team:** Build recovery, architecture stability
- **FWMS Product Team:** Feature delivery, domain expertise
- **Compliance & Automation:** QMS integration, automation engine

---

## License

MIT — See [LICENSE](./LICENSE)

