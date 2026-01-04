export type AIModel = 'chatgpt' | 'claude' | 'gemini' | 'deepseek';

export interface AIModelInfo {
  id: AIModel;
  name: string;
  specialty: string;
  color: string;
}

export const AI_MODELS: Record<AIModel, AIModelInfo> = {
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    specialty: 'Análise Geral',
    color: '#10A37F'
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    specialty: 'Redação Técnica',
    color: '#D97757'
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    specialty: 'Pesquisa & Dados',
    color: '#4285F4'
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    specialty: 'Análise Jurídica',
    color: '#7C3AED'
  }
};

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
