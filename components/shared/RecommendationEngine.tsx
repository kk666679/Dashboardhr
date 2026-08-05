import { Suggestion, Suggestions } from '../ai-elements';
import { Reasoning, ReasoningTrigger, ReasoningContent } from '../ai-elements';

export const RecommendationEngine = ({ context }: { context: string }) => (
  <div className="space-y-4">
    <div className="text-sm text-muted-foreground">Ask for recommendations...</div>
    <Reasoning>
      <ReasoningTrigger />
      <ReasoningContent>Analyzing current state... Comparing with best practices...</ReasoningContent>
    </Reasoning>
    <Suggestions>
      <Suggestion suggestion="Use ANOVA" />
      <Suggestion suggestion="Run a DOE" />
    </Suggestions>
  </div>
);
