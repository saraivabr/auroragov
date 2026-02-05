import { Home, MessageSquare, FileText, Mail, Menu, Grid3x3, Shield, User, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IconSidebarProps {
  onMenuClick?: () => void;
}

export function IconSidebar({ onMenuClick }: IconSidebarProps) {
  const topIcons = [
    { icon: Menu, label: 'Menu' },
    { icon: Home, label: 'Home' },
    { icon: MessageSquare, label: 'Chat' },
    { icon: FileText, label: 'Documentos' },
    { icon: Mail, label: 'Mensagens' },
    { icon: Grid3x3, label: 'Apps' },
    { icon: Shield, label: 'Segurança' },
  ];

  const bottomIcons = [
    { icon: User, label: 'Perfil' },
    { icon: Settings, label: 'Configurações' },
    { icon: HelpCircle, label: 'Ajuda' },
  ];

  return (
    <div className="w-[60px] h-screen bg-[#141414] border-r border-gray-800 flex flex-col items-center py-4">
      <div className="mb-6">
        <button className="w-10 h-10 bg-gradient-to-br from-govbr-blue to-govbr-blue-vivid rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">A</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center gap-2">
        {topIcons.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800 w-10 h-10"
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </Button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        {bottomIcons.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800 w-10 h-10"
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </Button>
        ))}
      </div>
    </div>
  );
}
