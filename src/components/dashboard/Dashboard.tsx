import { Header } from './Header';
import { ModelSelector } from './ModelSelector';
import { TemplateLibrary } from './TemplateLibrary';
import { ChatInterface } from './ChatInterface';
import { AuditTrail } from './AuditTrail';
import { ActionBar } from './ActionBar';
import { DocumentWorkspace } from './DocumentWorkspace';
import { ComparisonMode } from './ComparisonMode';
import { MobileWarning } from './MobileWarning';
import { OnboardingTour } from './OnboardingTour';
import { Toaster } from '@/components/ui/toaster';
import { useApp } from '@/contexts/AppContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export function Dashboard() {
  const {
    selectedModel,
    messages,
    auditEntries,
    isLoading,
    promptValue,
    showDocumentWorkspace,
    showComparisonMode,
    showOnboarding,
    setShowDocumentWorkspace,
    setShowComparisonMode,
    setPromptValue,
    handleSendMessage,
    handleModelChange,
    handleFeedback,
    handleExport
  } = useApp();
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <>
      <MobileWarning />
      {showOnboarding && <OnboardingTour />}
      <div className="hidden lg:block min-h-screen bg-[#0A1628] noise-texture">
        <Header />
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
            <div className="col-span-3 space-y-6">
              <div className="glass-effect rounded-lg p-6">
                <ModelSelector selectedModel={selectedModel} onModelChange={handleModelChange} />
              </div>
              <div className="glass-effect rounded-lg p-6 h-[calc(100%-200px)]">
                <TemplateLibrary />
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
