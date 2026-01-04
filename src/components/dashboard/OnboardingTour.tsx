import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

interface TourStep {
  title: string;
  description: string;
  position: 'left' | 'center' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Bem-vindo ao Aurora Gov! 🎉',
    description: 'Uma central unificada de IA para servidores públicos. Vamos fazer um tour rápido de 2 minutos para você começar.',
    position: 'center'
  },
  {
    title: 'Modelos de IA 🤖',
    description: 'Escolha entre 4 modelos especializados: ChatGPT para tarefas gerais, Claude para redação técnica, Gemini para pesquisa e DeepSeek para análise jurídica.',
    position: 'left'
  },
  {
    title: 'Biblioteca de Templates 📚',
    description: 'Acesse templates prontos para tarefas comuns como redigir ofícios, analisar contratos e criar relatórios. Basta clicar em um template para começar!',
    position: 'left'
  },
  {
    title: 'Interface de Chat 💬',
    description: 'Digite suas perguntas em linguagem natural. A IA vai responder de forma clara e objetiva. Use Enter para enviar e Shift+Enter para quebrar linha.',
    position: 'center'
  },
  {
    title: 'Trilha de Auditoria 📋',
    description: 'Todas as suas ações são registradas aqui para conformidade com LGPD. Você pode exportar o histórico a qualquer momento.',
    position: 'right'
  },
  {
    title: 'Pronto para começar! ✨',
    description: 'Você pode revisitar este tutorial a qualquer momento clicando no ícone de ajuda. Explore os recursos e aproveite o Aurora Gov!',
    position: 'center'
  }
];

export function OnboardingTour() {
  const { completeOnboarding } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-[#00D9FF] text-[#0A1628] hover:bg-[#00D9FF]/90 shadow-lg"
        >
          Continuar Tutorial ({currentStep + 1}/{TOUR_STEPS.length})
        </Button>
      </div>
    );
  }

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in" />
      
      {/* Tour Modal */}
      <div
        className={`fixed z-50 animate-in slide-in-from-bottom ${
          step.position === 'left'
            ? 'left-4 top-1/2 -translate-y-1/2'
            : step.position === 'right'
            ? 'right-4 top-1/2 -translate-y-1/2'
            : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
        }`}
      >
        <div className="glass-effect rounded-lg p-6 w-[400px] border-2 border-[#00D9FF] shadow-[0_0_30px_rgba(0,217,255,0.3)]">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#F7F9FC] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[#F7F9FC]/80 leading-relaxed">
                {step.description}
              </p>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="ml-2 text-[#F7F9FC]/60 hover:text-[#F7F9FC] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-6">
            {TOUR_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  index <= currentStep
                    ? 'bg-[#00D9FF]'
                    : 'bg-[#F7F9FC]/20'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-[#F7F9FC]/60 hover:text-[#F7F9FC] hover:bg-[#F7F9FC]/10"
            >
              Pular Tutorial
            </Button>
            
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF]/10"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                className="bg-[#00D9FF] text-[#0A1628] hover:bg-[#00D9FF]/90"
              >
                {isLastStep ? (
                  <>
                    Concluir <Check className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    Próximo <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Step Counter */}
          <div className="text-center mt-4 text-xs text-[#F7F9FC]/60">
            Passo {currentStep + 1} de {TOUR_STEPS.length}
          </div>
        </div>
      </div>
    </>
  );
}
