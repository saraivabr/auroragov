import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Scale, FileSearch, FileText, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function IconSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSuperAdmin, isGestor } = useAuth();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: MessageSquare, label: 'Chat', path: '/' },
    { icon: Scale, label: 'Consulta Jurídica', path: '/consulta-juridica' },
    { icon: FileSearch, label: 'Análise de Documentos', path: '/analise-documentos' },
    { icon: FileText, label: 'Gerar Documentos', path: '/gerar-documentos' },
    ...((isSuperAdmin || isGestor) ? [{ icon: Users, label: 'Gerenciar Usuários', path: '/gerenciar-usuarios' }] : []),
    ...(isSuperAdmin ? [{ icon: Building2, label: 'Organizações', path: '/organizacoes' }] : []),
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-[60px] h-screen bg-[#141414] border-r border-gray-800 flex flex-col items-center py-4 flex-shrink-0">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 bg-gradient-to-br from-govbr-blue to-govbr-blue-vivid rounded-lg flex items-center justify-center"
        >
          <span className="text-white text-sm font-bold">A</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center gap-2">
        {navItems.map((item) => (
          <Button
            key={item.path + item.label}
            variant="ghost"
            size="icon"
            onClick={() => navigate(item.path)}
            className={cn(
              "w-10 h-10",
              isActive(item.path)
                ? "text-white bg-gray-800"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            )}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </Button>
        ))}
      </div>
    </div>
  );
}
