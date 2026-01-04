import { useState } from 'react';
import { Header } from './Header';
import { ModelSelector } from './ModelSelector';
import { TemplateLibrary } from './TemplateLibrary';
import { ChatInterface } from './ChatInterface';
import { AuditTrail } from './AuditTrail';
import { ActionBar } from './ActionBar';
import { DocumentWorkspace } from './DocumentWorkspace';
import { ComparisonMode } from './ComparisonMode';
import { MobileWarning } from './MobileWarning';
import { AIModel, Message, AuditEntry } from '@/types/ai-models';
import { Toaster } from '@/components/ui/toaster';

export function Dashboard() {
  const [selectedModel, setSelectedModel] = useState<AIModel>('chatgpt');
  const [messages, setMessages] = useState<Message[]>([]);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptValue, setPromptValue] = useState('');
  const [showDocumentWorkspace, setShowDocumentWorkspace] = useState(false);
  const [showComparisonMode, setShowComparisonMode] = useState(false);

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
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Esta é uma resposta simulada do ${selectedModel.toUpperCase()}.\n\nEm um ambiente de produção, esta resposta seria gerada pela API do modelo de IA selecionado. A resposta seria processada de forma segura, com criptografia end-to-end e registro completo na trilha de auditoria.\n\nTodos os dados são tratados em conformidade com a LGPD e demais regulamentações aplicáveis ao setor público brasileiro.`,
        model: selectedModel,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      addAuditEntry('Resposta Recebida', `Resposta do ${selectedModel}`, selectedModel);
      setIsLoading(false);
    }, 2000);
  };

  const handleModelChange = (model: AIModel) => {
    setSelectedModel(model);
    addAuditEntry('Modelo Alterado', `Modelo alterado para ${model}`);
  };

  const handleSelectTemplate = (prompt: string) => {
    setPromptValue(prompt);
    addAuditEntry('Template Selecionado', prompt.substring(0, 100));
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    addAuditEntry('Feedback Enviado', `Feedback ${type === 'positive' ? 'positivo' : 'negativo'} registrado`);
  };

  const handleExport = (format: 'pdf' | 'docx' | 'txt') => {
    addAuditEntry('Exportação', `Conversa exportada como ${format.toUpperCase()}`);
  };

  return (
    <>
      <MobileWarning />
      <div className="hidden lg:block min-h-screen bg-[#0A1628] noise-texture">
        <Header />
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
            <div className="col-span-3 space-y-6">
              <div className="glass-effect rounded-lg p-6">
                <ModelSelector selectedModel={selectedModel} onModelChange={handleModelChange} />
              </div>
              <div className="glass-effect rounded-lg p-6 h-[calc(100%-200px)]">
                <TemplateLibrary onSelectTemplate={handleSelectTemplate} />
              </div>
            </div>
            <div className="col-span-6">
              <div className="glass-effect rounded-lg h-full overflow-hidden flex flex-col">
                <ActionBar
                  onOpenDocument={() => setShowDocumentWorkspace(true)}
                  onOpenComparison={() => setShowComparisonMode(true)}
                  onFeedback={handleFeedback}
                  onExport={handleExport}
                  hasMessages={messages.length > 0}
                />
                <ChatInterface
                  selectedModel={selectedModel}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  promptValue={promptValue}
                  onPromptChange={setPromptValue}
                />
              </div>
            </div>
            <div className="col-span-3">
              <div className="glass-effect rounded-lg h-full overflow-hidden">
                <AuditTrail entries={auditEntries} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDocumentWorkspace && (
        <DocumentWorkspace messages={messages} onClose={() => setShowDocumentWorkspace(false)} />
      )}
      {showComparisonMode && (
        <ComparisonMode onClose={() => setShowComparisonMode(false)} />
      )}
      <Toaster />
    </>
  );
}
