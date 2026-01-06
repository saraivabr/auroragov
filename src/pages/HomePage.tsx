import {
  FileText,
  Scale,
  FileSearch,
  Folder,
  Users,
  AlertCircle,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ModuleCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
  priority: 'high' | 'medium';
}

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const modules: ModuleCard[] = [
    {
      title: 'Consulta Jurídica',
      description: 'Consulte leis, decretos e portarias com explicações contextualizadas',
      icon: <Scale className="w-8 h-8" />,
      route: '/consulta-juridica',
      color: 'from-blue-500 to-blue-600',
      priority: 'high'
    },
    {
      title: 'Análise de Documentos',
      description: 'Analise editais, contratos e documentos com IA',
      icon: <FileSearch className="w-8 h-8" />,
      route: '/analise-documentos',
      color: 'from-green-500 to-green-600',
      priority: 'high'
    },
    {
      title: 'Gerador de Documentos',
      description: 'Crie ofícios, memorandos e pareceres oficiais',
      icon: <FileText className="w-8 h-8" />,
      route: '/gerar-documentos',
      color: 'from-purple-500 to-purple-600',
      priority: 'high'
    },
    {
      title: 'Base Normativa',
      description: 'Acesse a base de leis e regulamentos atualizados',
      icon: <BookOpen className="w-8 h-8" />,
      route: '/base-normativa',
      color: 'from-cyan-500 to-cyan-600',
      priority: 'medium'
    },
    {
      title: 'Processos Administrativos',
      description: 'Gerencie e acompanhe processos em tramitação',
      icon: <Folder className="w-8 h-8" />,
      route: '/processos',
      color: 'from-orange-500 to-orange-600',
      priority: 'medium'
    },
    {
      title: 'Solicitações de Cidadãos',
      description: 'Responda pedidos e requerimentos de cidadãos',
      icon: <Users className="w-8 h-8" />,
      route: '/solicitacoes',
      color: 'from-pink-500 to-pink-600',
      priority: 'medium'
    },
    {
      title: 'Recursos Administrativos',
      description: 'Analise recursos e impugnações com suporte de IA',
      icon: <AlertCircle className="w-8 h-8" />,
      route: '/recursos',
      color: 'from-red-500 to-red-600',
      priority: 'medium'
    },
    {
      title: 'Painel de Estatísticas',
      description: 'Visualize métricas e indicadores de produtividade',
      icon: <TrendingUp className="w-8 h-8" />,
      route: '/estatisticas',
      color: 'from-gray-500 to-gray-600',
      priority: 'medium'
    }
  ];

  const highPriorityModules = modules.filter(m => m.priority === 'high');
  const mediumPriorityModules = modules.filter(m => m.priority === 'medium');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assistente Governamental
          </h1>
          <p className="text-gray-600">
            Bem-vindo, {user?.email}. Sistema de apoio para servidores públicos
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600 rounded"></div>
            Funcionalidades Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highPriorityModules.map((module) => (
              <Card
                key={module.route}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-400 group"
                onClick={() => navigate(module.route)}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {module.icon}
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {module.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gray-600 rounded"></div>
            Outras Funcionalidades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediumPriorityModules.map((module) => (
              <Card
                key={module.route}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-gray-400 group"
                onClick={() => navigate(module.route)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                    {module.icon}
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {module.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Aviso Importante
              </h3>
              <p className="text-sm text-blue-800">
                Este sistema utiliza inteligência artificial como ferramenta de apoio.
                As orientações fornecidas são informativas e não substituem pareceres jurídicos oficiais
                ou análises técnicas especializadas. Todas as ações são registradas para fins de auditoria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
