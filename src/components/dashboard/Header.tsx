import { memo } from 'react';
import { Shield, Clock, CheckCircle2, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

export const Header = memo(function Header() {
  const { setShowOnboarding } = useApp();
  
  const restartTour = () => {
    localStorage.removeItem('auroragov_onboarding_completed');
    setShowOnboarding(true);
  };
  
  return (
    <header className="border-b border-govbr-blue-light/20 bg-govbr-blue-dark/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-govbr-blue to-govbr-blue-light flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white rounded-full relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">AuroraGov</h1>
              <p className="text-xs text-govbr-yellow">Plataforma de IA para Gestão Pública</p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <KeyboardShortcutsHelp />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={restartTour}
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                title="Revisar Tutorial"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg glass-effect">
              <Shield className="w-4 h-4 text-cyan-400" />
              <div className="text-xs">
                <div className="text-cyan-400 font-medium">Criptografia Ativa</div>
                <div className="text-gray-400">LGPD • ISO 27001</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass-effect">
              <Clock className="w-4 h-4 text-amber-400" />
              <div className="text-xs">
                <div className="text-amber-400 font-medium">Sessão</div>
                <div className="text-gray-400">45:00 min</div>
              </div>
            </div>

            <Badge variant="outline" className="border-green-500/50 text-green-400 gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Online
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
});
