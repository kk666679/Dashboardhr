import { Conversation, ConversationHeader, ConversationContent } from '../../ai-elements/conversation';
import { Artifact, ArtifactHeader, ArtifactTitle, ArtifactContent } from '../../ai-elements/artifact';
import { Suggestion, Suggestions } from '../../ai-elements/suggestion';
import { Agent, AgentHeader, AgentStatusDot } from '../../ai-elements/agent';

export const VoiceOfCustomer = () => (
  <div className="space-y-4">
    <Agent>
      <AgentHeader name="VOC Analysis Agent" model="gpt-4o" status="idle" actions={
        <span className="flex items-center gap-1 text-xs" style={{ color: '#8b92a9' }}>
          <AgentStatusDot status="idle" /> Ready
        </span>
      } />
    </Agent>

    <Conversation>
      <ConversationHeader title="Customer Feedback Collection" />
      <ConversationContent>
        <div className="text-sm py-2" style={{ color: '#8b92a9' }}>
          Enter customer feedback to analyze themes and extract CTQs.
        </div>
      </ConversationContent>
    </Conversation>

    <Suggestions>
      <Suggestion suggestion="Key themes: Quality (42%), Delivery (31%), Cost (18%), Service (9%)" />
      <Suggestion suggestion="Top customer complaint: Dimensional tolerance variance on delivered parts" />
      <Suggestion suggestion="Sentiment analysis: 68% negative, 22% neutral, 10% positive" />
    </Suggestions>

    <Artifact>
      <ArtifactHeader>
        <ArtifactTitle>VOC Summary — July 2026</ArtifactTitle>
      </ArtifactHeader>
      <ArtifactContent>
        <div className="text-sm" style={{ color: '#8b92a9' }}>
          <div className="mb-2">Total feedback entries: 147</div>
          <div>Voice of Customer analysis identifies dimensional tolerance as primary pain point. Recommended: Link to CTQ tree for tolerance specification ±0.05mm.</div>
        </div>
      </ArtifactContent>
    </Artifact>
  </div>
);
