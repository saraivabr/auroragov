export interface AIModel {
  id: string;
  provider: string;
  model_id: string;
  display_name: string;
  description: string | null;
  context_length: number | null;
  pricing_input: number | null;
  pricing_output: number | null;
  supports_json: boolean;
  supports_streaming: boolean;
  supports_vision: boolean;
  is_available: boolean;
  is_recommended: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface UserModelPreference {
  id: string;
  user_id: string;
  agent_id: string | null;
  preferred_model_id: string;
  created_at: string;
  updated_at: string;
}

export interface UsageStats {
  id: string;
  user_id: string;
  agent_id: string | null;
  model_id: string | null;
  date: string;
  total_messages: number;
  total_tokens_input: number;
  total_tokens_output: number;
  total_cost_usd: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  agent_id: string | null;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model_used?: string;
  model_provider?: string;
  tokens_input?: number;
  tokens_output?: number;
  cost_usd?: number;
  processing_time_ms?: number;
  created_at: string;
}

export interface ChatRequest {
  conversationId: string;
  message: string;
  agentId?: string;
  userId: string;
  modelId?: string;
  stream?: boolean;
}

export interface ChatResponse {
  message: Message;
  response: string;
  model_used: string;
  tokens_input: number;
  tokens_output: number;
  cost_usd: number;
  processing_time_ms: number;
}

export interface OpenRouterChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterChatRequest {
  model: string;
  messages: OpenRouterChatMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface OpenRouterChatResponse {
  id: string;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ModelStats {
  model_id: string;
  display_name: string;
  total_messages: number;
  total_tokens: number;
  total_cost_usd: number;
  percentage: number;
}

export interface AgentStats {
  agent_id: string;
  agent_name?: string;
  total_messages: number;
  total_tokens: number;
  total_cost_usd: number;
}

export interface UsageSummary {
  period: 'day' | 'week' | 'month';
  total_messages: number;
  total_tokens_input: number;
  total_tokens_output: number;
  total_cost_usd: number;
  by_model: ModelStats[];
  by_agent: AgentStats[];
  daily_breakdown?: {
    date: string;
    messages: number;
    cost_usd: number;
  }[];
}
