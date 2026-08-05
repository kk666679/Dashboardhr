import { Reasoning, ReasoningTrigger, ReasoningContent } from '../ai-elements';
import { Sources, SourcesTrigger, SourcesContent, Source } from '../ai-elements';
import { Suggestion } from '../ai-elements';

export const AIProcessCoach = ({ phase }: { phase: string }) => (
  <div className="p-4 border rounded space-y-4">
    <div className="text-sm text-muted-foreground">
      Ask about {phase} phase...
    </div>
    <Reasoning>
      <ReasoningTrigger />
      <ReasoningContent>Understanding context... Generating advice...</ReasoningContent>
    </Reasoning>
    <Sources>
      <SourcesTrigger count={1} />
      <SourcesContent>
        <Source title="DMAIC Guide" href="/dashboard/documents/repository" />
      </SourcesContent>
    </Sources>
  </div>
);
