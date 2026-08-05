# AiFWMS Documentation

This folder is the documentation source of truth for the AiFWMS platform.

## Docs Index

| Document | Description |
|---|---|
| [QUICK_START.md](./QUICK_START.md) | Setup instructions, prerequisites, environment variables, Docker, workers |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture diagrams, product structure, AI orchestration, security layers, i18n architecture |
| [API_OVERVIEW.md](./API_OVERVIEW.md) | REST API routes and tRPC router index (30+ routers) with usage examples |
| [SECURITY.md](./SECURITY.md) | Access control (ABAC/RLS), authentication, secrets management, compliance |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Project conventions, adding features, i18n dev, worker dev, Docker workflow |
| [FAQ.md](./FAQ.md) | Frequently asked questions about features, architecture, and troubleshooting |

## Technical Debt & Optimization

| Document | Description |
|---|---|
| [tech-debt/TODO.md](./tech-debt/TODO.md) | Live tracking of all technical debt items with status checkboxes |
| [tech-debt/REDUCTION_PLAN.md](./tech-debt/REDUCTION_PLAN.md) | Comprehensive engineering audit report with scores, issue tables, and risk assessment |
| [tech-debt/PATH_TO_100.md](./tech-debt/PATH_TO_100.md) | Milestone-based roadmap to raise every health category to 100/100 |

## OpenClaw AI Agent Framework

The repository embeds the **OpenClaw** autonomous multi-agent framework in `.openclaw/` —
35 agents and 123 skills powering autonomous HR, foreign worker, compliance, and CI/Lean
operations. See [`.openclaw/README_AI.md`](../.openclaw/README_AI.md) and the
[`.openclaw/docs/`](../.openclaw/docs/) index for agent inventory, skills, memory, and
architecture details.

## Related Files

- [CHANGELOG.md](../CHANGELOG.md) — Sprint progress and versioning
- [README.md](../README.md) — Repository overview

## Quick Navigation

- **Getting Started**: [QUICK_START.md](./QUICK_START.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **API & tRPC**: [API_OVERVIEW.md](./API_OVERVIEW.md)
- **Security**: [SECURITY.md](./SECURITY.md)
- **Development Guide**: [DEVELOPMENT.md](./DEVELOPMENT.md)
- **FAQ**: [FAQ.md](./FAQ.md)
- **OpenClaw AI Framework**: [.openclaw/README_AI.md](../.openclaw/README_AI.md)
