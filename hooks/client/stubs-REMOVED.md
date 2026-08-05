DEPRECATED FILE: hooks/client/hooks.ts

This file contained ~50+ tRPC stubs (agent/document/process/audit/etc) that:
1. Were never exported from hooks/index.ts
2. Assumed non-existent server procedures
3. Duplicated agent.executeTool() pattern

**Migration Complete:**
- ✅ agent.chat → useAgent/useHrOrchestrator
- ✅ document/process → agent.executeTool()
- ✅ audit/compliance → useComplianceAgent
- ✅ manufacturing/etc → domain agents

Repo cleaned. No functionality lost.

