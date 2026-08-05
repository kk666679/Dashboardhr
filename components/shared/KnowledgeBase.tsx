import { Suggestion, Suggestions } from '../ai-elements';
import { Sources, SourcesTrigger, SourcesContent, Source } from '../ai-elements';

export const KnowledgeBase = () => (
  <div className="space-y-4">
    <div className="text-sm text-muted-foreground">Search past projects...</div>
    <Suggestions>
      <Suggestion suggestion="Similar project: Brake pad defect reduction" />
    </Suggestions>
    <Sources>
      <SourcesTrigger count={1} />
      <SourcesContent>
        <Source title="Lessons Learned" href="/dashboard/documents/repository" />
      </SourcesContent>
    </Sources>
  </div>
);
