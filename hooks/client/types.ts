/**
 * hooks/client/types.ts - Client-side types for AI capabilities & models
 */

export interface ModelCapabilities {
  supportsImageInput: boolean;
  supportsObjectGeneration: boolean;
  supportsToolUsage: boolean;
  supportsToolStreaming: boolean;
  supportsVision: boolean;
  supportsStreaming: boolean;
  supportsReasoning: boolean;
}

export type ModelProvider = 
  | 'openai'
  | 'anthropic' 
  | 'xai'
  | 'google'
  | 'deepseek'
  | 'mistral'
  | 'groq'
  | 'cerebras'
  | 'ollama';

export interface ModelDefinition {
  id: string;
  name: string;
  provider: ModelProvider;
  modelId: string;
  description: string;
  capabilities: ModelCapabilities;
  recommendedFor?: string[];
  deprecated?: boolean;
  speculative?: boolean; // Added for future models
}

export interface ProviderModels {
  provider: ModelProvider;
  providerName: string;
  models: ModelDefinition[];
}

// ============================================
// HOOKS TYPES (inferred from usage)
// ============================================
export interface Agent {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  status: string;
}

export interface Process {
  id: string;
  name: string;
  status: string;
}
