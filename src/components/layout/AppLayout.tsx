import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Scale, FileSearch, FileText, Users, Building2, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, isSuperAdmin, isGestor } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Scale, label: 'Consulta Jurídica', path: '/consulta-juridica' },
    { icon: FileSearch, label: 'Análise de Documentos', path: '/analise-documentos' },
    { icon: FileText, label: 'Gerar Documentos', path: '/gerar-documentos' },
    { icon: ShieldCheck, label: 'Auditor de Editais', path: '/auditor-editais' },
    ...((isSuperAdmin || isGestor) ? [{ icon: Users, label: 'Gerenciar Usuários', path: '/gerenciar-usuarios' }] : []),
    ...(isSuperAdmin ? [{ icon: Building2, label: 'Organizações', path: '/organizacoes' }] : []),
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-govbr-blue-dark">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-[60px] h-screen bg-[#141414] border-r border-gray-800 flex-col items-center py-4 flex-shrink-0 sticky top-0">
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

        <div className="mt-auto flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-govbr-blue to-govbr-blue-warm flex items-center justify-center" title={user?.email || ''}>
            <span className="text-white text-xs font-bold">
              {user?.email?.[0].toUpperCase()}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="w-10 h-10 text-gray-400 hover:text-red-400 hover:bg-gray-800"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#141414] border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-govbr-blue to-govbr-blue-vivid rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-white font-semibold">AuroraGov</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 pb-4 space-y-1 border-t border-gray-800 pt-4">
            {navItems.map((item) => (
              <button
                key={item.path + item.label}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive(item.path)
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
            <div className="flex items-center gap-3 px-4 py-3 text-gray-400">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-govbr-blue to-govbr-blue-warm flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user?.email?.[0].toUpperCase()}
                </span>
              </div>
              <span className="text-sm truncate">{user?.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Sair</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 md:mt-0 mt-14">
        {children}
      </div>
    </div>
  );
}
