import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AIModel, Message, AuditEntry, PromptTemplate } from '@/types/ai-models';

interface TemplateUsage {
  templateId: string;
  count: number;
  lastUsed: Date;
}

interface AppState {
  selectedModel: AIModel;
  messages: Message[];
  auditEntries: AuditEntry[];
  isLoading: boolean;
  promptValue: string;
  showDocumentWorkspace: boolean;
  showComparisonMode: boolean;
  templateUsage: Record<string, TemplateUsage>;
  favoriteTemplates: string[];
  showOnboarding: boolean;
}

interface AppContextType extends AppState {
  setSelectedModel: (model: AIModel) => void;
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  setAuditEntries: (entries: AuditEntry[] | ((prev: AuditEntry[]) => AuditEntry[])) => void;
  setIsLoading: (loading: boolean) => void;
  setPromptValue: (value: string) => void;
  setShowDocumentWorkspace: (show: boolean | ((prev: boolean) => boolean)) => void;
  setShowComparisonMode: (show: boolean | ((prev: boolean) => boolean)) => void;
  setShowOnboarding: (show: boolean | ((prev: boolean) => boolean)) => void;
  addAuditEntry: (action: string, details: string, model?: AIModel) => void;
  handleSendMessage: (content: string) => Promise<void>;
  handleModelChange: (model: AIModel) => void;
  handleSelectTemplate: (template: PromptTemplate) => void;
  handleFeedback: (type: 'positive' | 'negative') => void;
  handleExport: (format: 'pdf' | 'docx' | 'txt') => void;
  trackTemplateUsage: (templateId: string) => void;
  toggleFavoriteTemplate: (templateId: string) => void;
  getRecommendedTemplates: (templates: PromptTemplate[]) => PromptTemplate[];
  completeOnboarding: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Check if user has completed onboarding
  const hasCompletedOnboarding = localStorage.getItem('auroragov_onboarding_completed') === 'true';
  
  const [selectedModel, setSelectedModel] = useState<AIModel>('chatgpt');
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('auroragov_messages');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptValue, setPromptValue] = useState('');
  const [showDocumentWorkspace, setShowDocumentWorkspace] = useState(false);
  const [showComparisonMode, setShowComparisonMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!hasCompletedOnboarding);
  
  const [templateUsage, setTemplateUsage] = useState<Record<string, TemplateUsage>>(() => {
    const saved = localStorage.getItem('auroragov_template_usage');
    try {
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>(() => {
    const saved = localStorage.getItem('auroragov_favorite_templates');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Auto-save messages to localStorage
  useEffect(() => {
    localStorage.setItem('auroragov_messages', JSON.stringify(messages));
  }, [messages]);

  // Auto-save template usage to localStorage
  useEffect(() => {
    localStorage.setItem('auroragov_template_usage', JSON.stringify(templateUsage));
  }, [templateUsage]);

  // Auto-save favorite templates to localStorage
  useEffect(() => {
    localStorage.setItem('auroragov_favorite_templates', JSON.stringify(favoriteTemplates));
  }, [favoriteTemplates]);

  const addAuditEntry = (action: string, details: string, model?: AIModel) => {
    const entry: AuditEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action,
      user: 'Usuário Atual',
      model,
      details
    };
    setAuditEntries(prev => [entry, ...prev]);
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      model: selectedModel,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setPromptValue('');
    addAuditEntry('Mensagem Enviada', content.substring(0, 100), selectedModel);

    setIsLoading(true);
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      // Use the consulta-juridica edge function for general queries
      const response = await fetch(`${supabaseUrl}/functions/v1/consulta-juridica`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pergunta: content,
          userId: 'chat-user'
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao processar mensagem');
      }

      const result = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.resposta || 'Desculpe, não foi possível gerar uma resposta.',
        model: selectedModel,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      addAuditEntry('Resposta Recebida', `Resposta do ${selectedModel}`, selectedModel);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        model: selectedModel,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      addAuditEntry('Erro', 'Erro ao processar mensagem', selectedModel);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (model: AIModel) => {
    setSelectedModel(model);
    addAuditEntry('Modelo Alterado', `Modelo alterado para ${model}`);
  };

  const handleSelectTemplate = (template: PromptTemplate) => {
    setPromptValue(template.prompt);
    trackTemplateUsage(template.id);
    addAuditEntry('Template Selecionado', template.title);
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    addAuditEntry('Feedback Enviado', `Feedback ${type === 'positive' ? 'positivo' : 'negativo'} registrado`);
  };

  const handleExport = (format: 'pdf' | 'docx' | 'txt') => {
    addAuditEntry('Exportação', `Conversa exportada como ${format.toUpperCase()}`);
  };

  const trackTemplateUsage = (templateId: string) => {
    setTemplateUsage(prev => ({
      ...prev,
      [templateId]: {
        templateId,
        count: (prev[templateId]?.count || 0) + 1,
        lastUsed: new Date()
      }
    }));
  };

  const toggleFavoriteTemplate = (templateId: string) => {
    const wasFavorite = favoriteTemplates.includes(templateId);
    setFavoriteTemplates(prev => {
      if (prev.includes(templateId)) {
        return prev.filter(id => id !== templateId);
      }
      return [...prev, templateId];
    });
    addAuditEntry('Template Favorito', `Template ${wasFavorite ? 'removido dos' : 'adicionado aos'} favoritos`);
  };

  const getRecommendedTemplates = (templates: PromptTemplate[]): PromptTemplate[] => {
    // Sort templates by usage count and recency
    const sortedTemplates = [...templates].sort((a, b) => {
      const aUsage = templateUsage[a.id];
      const bUsage = templateUsage[b.id];
      
      if (!aUsage && !bUsage) return 0;
      if (!aUsage) return 1;
      if (!bUsage) return -1;
      
      // Prioritize favorites
      const aFavorite = favoriteTemplates.includes(a.id);
      const bFavorite = favoriteTemplates.includes(b.id);
      if (aFavorite && !bFavorite) return -1;
      if (!aFavorite && bFavorite) return 1;
      
      // Then by usage count
      if (aUsage.count !== bUsage.count) {
        return bUsage.count - aUsage.count;
      }
      
      // Then by recency
      return new Date(bUsage.lastUsed).getTime() - new Date(aUsage.lastUsed).getTime();
    });

    return sortedTemplates.slice(0, 3); // Return top 3 recommendations
  };

  const completeOnboarding = () => {
    localStorage.setItem('auroragov_onboarding_completed', 'true');
    setShowOnboarding(false);
    addAuditEntry('Onboarding Concluído', 'Tutorial inicial concluído');
  };

  const value: AppContextType = {
    selectedModel,
    messages,
    auditEntries,
    isLoading,
    promptValue,
    showDocumentWorkspace,
    showComparisonMode,
    templateUsage,
    favoriteTemplates,
    showOnboarding,
    setSelectedModel,
    setMessages,
    setAuditEntries,
    setIsLoading,
    setPromptValue,
    setShowDocumentWorkspace,
    setShowComparisonMode,
    setShowOnboarding,
    addAuditEntry,
    handleSendMessage,
    handleModelChange,
    handleSelectTemplate,
    handleFeedback,
    handleExport,
    trackTemplateUsage,
    toggleFavoriteTemplate,
    getRecommendedTemplates,
    completeOnboarding
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
