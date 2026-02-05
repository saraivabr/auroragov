import { Keyboard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const shortcuts = [
  {
    category: 'Geral',
    items: [
      { keys: ['F1'], description: 'Abrir tutorial/ajuda' },
      { keys: ['Ctrl', 'H'], description: 'Abrir tutorial/ajuda' },
      { keys: ['Esc'], description: 'Fechar modais' },
    ]
  },
  {
    category: 'Navegação',
    items: [
      { keys: ['Ctrl', 'D'], description: 'Abrir/fechar Workspace de Documentos' },
      { keys: ['Ctrl', 'K'], description: 'Abrir/fechar Modo de Comparação' },
    ]
  },
  {
    category: 'Chat',
    items: [
      { keys: ['Enter'], description: 'Enviar mensagem' },
      { keys: ['Shift', 'Enter'], description: 'Nova linha' },
    ]
  }
];

export function KeyboardShortcutsHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-govbr-yellow/80 hover:bg-govbr-yellow/10"
          title="Atalhos de Teclado"
        >
          <Keyboard className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-[#0A1628] border-govbr-blue-light/30">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-govbr-yellow" />
            Atalhos de Teclado
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {shortcuts.map((category) => (
            <div key={category.category} className="space-y-3">
              <h4 className="text-sm font-medium text-govbr-yellow uppercase tracking-wider">
                {category.category}
              </h4>
              
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-300">{item.description}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key, keyIndex) => (
                        <span key={keyIndex} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-sm">
                            {key}
                          </kbd>
                          {keyIndex < item.keys.length - 1 && (
                            <span className="text-gray-500">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-700">
          Dica: Mantenha pressionada a tecla Ctrl para usar atalhos de navegação
        </div>
      </DialogContent>
    </Dialog>
  );
}
