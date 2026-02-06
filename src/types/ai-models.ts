export type AIModel = 'google/gemini-2.0-flash-exp:free' | 'deepseek/deepseek-r1:free' | 'meta-llama/llama-3.3-70b-instruct:free' | 'qwen/qwen-2.5-72b-instruct:free';

export interface AIModelInfo {
  id: AIModel;
  name: string;
  specialty: string;
  color: string;
}

export const AI_MODELS: Record<AIModel, AIModelInfo> = {
  'google/gemini-2.0-flash-exp:free': {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini',
    specialty: 'Análise Geral',
    color: '#4285F4'
  },
  'deepseek/deepseek-r1:free': {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek',
    specialty: 'Raciocínio Avançado',
    color: '#7C3AED'
  },
  'meta-llama/llama-3.3-70b-instruct:free': {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama',
    specialty: 'Texto & Código',
    color: '#0668E1'
  },
  'qwen/qwen-2.5-72b-instruct:free': {
    id: 'qwen/qwen-2.5-72b-instruct:free',
    name: 'Qwen',
    specialty: 'Análise Jurídica',
    color: '#6366F1'
  }
};

export const DEFAULT_MODEL: AIModel = 'google/gemini-2.0-flash-exp:free';

// Fallback order for when a model fails
export const MODEL_FALLBACK_ORDER: AIModel[] = [
  'google/gemini-2.0-flash-exp:free',
  'deepseek/deepseek-r1:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen-2.5-72b-instruct:free',
];

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model: AIModel;
  timestamp: Date;
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  model?: AIModel;
  details: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  prompt: string;
  description: string;
}
