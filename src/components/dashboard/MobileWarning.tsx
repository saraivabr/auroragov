import { Monitor } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function MobileWarning() {
  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-6 lg:hidden">
      <Alert className="max-w-md glass-effect border-amber-500/50">
        <Monitor className="h-5 w-5 text-amber-400" />
        <AlertTitle className="text-amber-400 text-lg">
          Visualização Desktop Recomendada
        </AlertTitle>
        <AlertDescription className="text-gray-300 mt-2">
          Aurora Gov foi projetado para uso em desktop para melhor experiência e produtividade.
          Por favor, acesse através de um computador com resolução mínima de 1280px.
        </AlertDescription>
      </Alert>
    </div>
  );
}
