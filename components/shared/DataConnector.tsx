import { Agent, AgentHeader, AgentStatusDot } from '../ai-elements';
import { Sources, SourcesTrigger, SourcesContent, Source } from '../ai-elements';

export const DataConnector = () => (
  <div className="space-y-4">
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Data Source</label>
      <select className="border rounded px-3 py-2 text-sm">
        <option>CSV</option>
        <option>SQL</option>
        <option>API</option>
      </select>
      <label className="text-sm font-medium">File Path</label>
      <input type="text" className="border rounded px-3 py-2 text-sm" placeholder="Enter path..." />
    </div>
    <Agent>
      <AgentHeader
        name="Data Agent"
        model="fetcher-v1"
        status="idle"
        actions={<span className="flex items-center gap-1 text-xs"><AgentStatusDot status="idle" />Ready</span>}
      />
    </Agent>
    <Sources>
      <SourcesTrigger count={1} />
      <SourcesContent>
        <Source title="Data Dictionary" href="/dashboard/data-governance" />
      </SourcesContent>
    </Sources>
  </div>
);
