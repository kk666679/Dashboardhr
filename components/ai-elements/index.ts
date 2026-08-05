// AI Elements — Reusable AI UI Components
// These components are used across the application for AI interactions.

// ─── Conversation ─────────────────────────────────────────────────────────────
export {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  ConversationDownload,
  ConversationTypingIndicator,
  ConversationHeader,
  ConversationLoading,
  messagesToMarkdown,
} from './conversation';
export type {
  ConversationProps,
  ConversationContentProps,
  ConversationEmptyStateProps,
  ConversationScrollButtonProps,
  ConversationDownloadProps,
  ConversationTypingIndicatorProps,
  ConversationHeaderProps,
  ConversationLoadingProps,
} from './conversation';

// ─── Message ──────────────────────────────────────────────────────────────────
export { Message, MessageContent, MessageActions, MessageAction } from './message';
export {
  MessageBranch,
  MessageBranchContent,
  MessageBranchSelector,
  MessageBranchPrevious,
  MessageBranchNext,
  MessageBranchPage,
  MessageResponse,
  MessageToolbar,
  // New additions
  MessageTimestamp,
  MessageCopyButton,
  MessageFeedback,
} from './message';
export type {
  MessageProps,
  MessageContentProps,
  MessageActionsProps,
  MessageActionProps,
  MessageBranchProps,
  MessageBranchContentProps,
  MessageBranchSelectorProps,
  MessageBranchPreviousProps,
  MessageBranchNextProps,
  MessageBranchPageProps,
  MessageResponseProps,
  MessageToolbarProps,
  MessageTimestampProps,
  MessageCopyButtonProps,
  MessageFeedbackProps,
  MessageFeedbackValue,
} from './message';

// ─── Agent ────────────────────────────────────────────────────────────────────
export {
  Agent,
  AgentHeader,
  AgentStatusDot,
  AgentContent,
  AgentInstructions,
  AgentTools,
  AgentTool,
  AgentOutput,
  AgentMetrics,
  AgentActions,
  AgentAction,
} from './agent';
export type {
  AgentProps,
  AgentHeaderProps,
  AgentStatusDotProps,
  AgentContentProps,
  AgentInstructionsProps,
  AgentToolsProps,
  AgentToolProps,
  AgentOutputProps,
  AgentMetricsProps,
  AgentActionsProps,
  AgentActionProps,
  AgentStatus,
  AgentMetric,
} from './agent';

// ─── HR Agent Card ────────────────────────────────────────────────────────────
export { HRAgentCard, HRAgentStatusBar } from './hr-agent-card';
export type {
  HRAgentCardProps,
  HRAgentStatusBarProps,
  HRDomain,
} from './hr-agent-card';

// ─── Prompt Input ─────────────────────────────────────────────────────────────
export {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputTools,
  PromptInputButton,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputSelect,
  PromptInputSelectTrigger,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectValue,
  PromptInputCommand,
  PromptInputCommandInput,
  PromptInputCommandList,
  PromptInputCommandEmpty,
  PromptInputCommandGroup,
  PromptInputCommandItem,
  PromptInputCommandSeparator,
  PromptInputHoverCard,
  PromptInputHoverCardTrigger,
  PromptInputHoverCardContent,
  PromptInputTabsList,
  PromptInputTab,
  PromptInputTabLabel,
  PromptInputTabBody,
  PromptInputTabItem,
  PromptInputProvider,
} from './prompt-input';
export type {
  PromptInputProps,
  PromptInputMessage,
  PromptInputProviderProps,
} from './prompt-input';

// ─── Sources ──────────────────────────────────────────────────────────────────
export { Sources, SourcesTrigger, SourcesContent, Source } from './sources';
export type {
  SourcesProps,
  SourcesTriggerProps,
  SourcesContentProps,
} from './sources';

// ─── Reasoning ────────────────────────────────────────────────────────────────
export { Reasoning, ReasoningTrigger, ReasoningContent } from './reasoning';
export type {
  ReasoningProps,
  ReasoningTriggerProps,
  ReasoningContentProps,
} from './reasoning';

// ─── Suggestions ─────────────────────────────────────────────────────────────
export { Suggestions, Suggestion } from './suggestion';
export type { SuggestionsProps, SuggestionProps } from './suggestion';

// ─── Timeline ────────────────────────────────────────────────────────────────
export { Timeline, TimelineEventItem, TimelineHeader, TimelineEmptyState } from './timeline';
export type { TimelineProps, TimelineEventItemProps, TimelineHeaderProps, TimelineEmptyStateProps, TimelineEvent, TimelineEventStatus } from './timeline';

// ─── Artifact sub-components ─────────────────────────────────────────────────
export {
  Artifact,
  ArtifactHeader,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactContent,
  ArtifactActions,
  ArtifactAction,
  ArtifactClose,
} from './artifact';
export type {
  ArtifactProps,
  ArtifactHeaderProps,
  ArtifactTitleProps,
  ArtifactDescriptionProps,
  ArtifactContentProps,
  ArtifactActionsProps,
  ArtifactActionProps,
  ArtifactCloseProps,
} from './artifact';

// ─── Checkpoint sub-components ───────────────────────────────────────────────
export {
  Checkpoint,
  CheckpointIcon,
  CheckpointTrigger,
} from './checkpoint';
export type {
  CheckpointProps,
  CheckpointIconProps,
  CheckpointTriggerProps,
} from './checkpoint';

// ─── Task sub-components ─────────────────────────────────────────────────────
export {
  Task,
  TaskTrigger,
  TaskContent,
  TaskItem,
  TaskItemFile,
} from './task';
export type {
  TaskProps,
  TaskTriggerProps,
  TaskContentProps,
  TaskItemProps,
  TaskItemFileProps,
} from './task';

// ─── All other elements ───────────────────────────────────────────────────────
export {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
  ChainOfThoughtContent,
  ChainOfThoughtSearchResults,
  ChainOfThoughtSearchResult,
  ChainOfThoughtImage,
} from './chain-of-thought';
export type {
  ChainOfThoughtProps,
  ChainOfThoughtHeaderProps,
  ChainOfThoughtStepProps,
  ChainOfThoughtContentProps,
  ChainOfThoughtSearchResultsProps,
  ChainOfThoughtSearchResultProps,
  ChainOfThoughtImageProps,
} from './chain-of-thought';
export { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput, getStatusBadge } from './tool';
export type { ToolProps, ToolHeaderProps, ToolContentProps, ToolInputProps, ToolOutputProps, ToolPart } from './tool';
export { Attachments } from './attachments';
export { AudioPlayer } from './audio-player';
export { Canvas } from './canvas';
export { CodeBlock } from './code-block';
export { Commit } from './commit';
export { Confirmation } from './confirmation';
export { Connection } from './connection';
export { Context } from './context';
export { Controls } from './controls';
export { Edge } from './edge';
export { EnvironmentVariables } from './environment-variables';
export { FileTree } from './file-tree';
export { Image } from './image';
export { InlineCitation } from './inline-citation';
export { JSXPreview as JsxPreview } from './jsx-preview';
export { MicSelector } from './mic-selector';
export { ModelSelector } from './model-selector';
export { Node } from './node';
export { OpenIn as OpenInChat } from './open-in-chat';
export { PackageInfo } from './package-info';
export {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelDescription,
  PanelContent,
  PanelActions,
} from './panel';
export { Persona } from './persona';
export { Plan, PlanHeader, PlanTitle, PlanDescription, PlanAction, PlanContent, PlanFooter, PlanTrigger } from './plan';
export { Queue } from './queue';
export { Sandbox } from './sandbox';
export { SchemaDisplay } from './schema-display';
export { Shimmer } from './shimmer';
export type { TextShimmerProps } from './shimmer';
export { Snippet } from './snippet';
export { SpeechInput } from './speech-input';
export { StackTrace } from './stack-trace';
export { Terminal } from './terminal';
export { TestResults } from './test-results';
export { Toolbar } from './toolbar';
export { Transcription } from './transcription';
export { VoiceSelector } from './voice-selector';
export { WebPreview } from './web-preview';
