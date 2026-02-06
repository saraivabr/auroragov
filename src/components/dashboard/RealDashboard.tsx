import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  FileSearch, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalConsultas: number;
  totalAnalises: number;
  totalDocumentos: number;
  consultasHoje: number;
  analisesHoje: number;
  documentosHoje: number;
}

interface RecentActivity {
  id: string;
  type: 'consulta' | 'analise' | 'documento';
  title: string;
  created_at: string;
}

export function RealDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalConsultas: 0,
    totalAnalises: 0,
    totalDocumentos: 0,
    consultasHoje: 0,
    analisesHoje: 0,
    documentosHoje: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Fetch total consultas
      const { count: totalConsultas } = await (supabase as any)
        .from('consultas_juridicas')
        .select('*', { count: 'exact', head: true });

      // Fetch consultas hoje
      const { count: consultasHoje } = await (supabase as any)
        .from('consultas_juridicas')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO);

      // Fetch total analises
      const { count: totalAnalises } = await (supabase as any)
        .from('analises_documentos')
        .select('*', { count: 'exact', head: true });

      // Fetch analises hoje
      const { count: analisesHoje } = await (supabase as any)
        .from('analises_documentos')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO);

      // Fetch total documentos
      const { count: totalDocumentos } = await (supabase as any)
        .from('documentos_oficiais')
        .select('*', { count: 'exact', head: true })
        .eq('is_template', false);

      // Fetch documentos hoje
      const { count: documentosHoje } = await (supabase as any)
        .from('documentos_oficiais')
        .select('*', { count: 'exact', head: true })
        .eq('is_template', false)
        .gte('created_at', todayISO);

      setStats({
        totalConsultas: totalConsultas || 0,
        totalAnalises: totalAnalises || 0,
        totalDocumentos: totalDocumentos || 0,
        consultasHoje: consultasHoje || 0,
        analisesHoje: analisesHoje || 0,
        documentosHoje: documentosHoje || 0,
      });

      // Fetch recent activities
      const { data: consultas } = await (supabase as any)
        .from('consultas_juridicas')
        .select('id, pergunta, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: analises } = await (supabase as any)
        .from('analises_documentos')
        .select('id, titulo, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: documentos } = await (supabase as any)
        .from('documentos_oficiais')
        .select('id, titulo, created_at')
        .eq('is_template', false)
        .order('created_at', { ascending: false })
        .limit(3);

      const activities: RecentActivity[] = [
        ...(consultas?.map((c: any) => ({ 
          id: c.id, 
          type: 'consulta' as const, 
          title: c.pergunta.substring(0, 60) + '...', 
          created_at: c.created_at 
        })) || []),
        ...(analises?.map((a: any) => ({ 
          id: a.id, 
          type: 'analise' as const, 
          title: a.titulo, 
          created_at: a.created_at 
        })) || []),
        ...(documentos?.map((d: any) => ({ 
          id: d.id, 
          type: 'documento' as const, 
          title: d.titulo, 
          created_at: d.created_at 
        })) || []),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

      setRecentActivities(activities);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `há ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    if (diffDays < 7) return `há ${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
    return date.toLocaleDateString('pt-BR');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'consulta': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'analise': return <FileSearch className="w-4 h-4 text-govbr-yellow" />;
      case 'documento': return <FileText className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'consulta': return 'Consulta Jurídica';
      case 'analise': return 'Análise de Documento';
      case 'documento': return 'Documento Oficial';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Bem-vindo de volta, {user?.email?.split('@')[0] || 'Usuário'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Consultas Jurídicas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Consultas Jurídicas
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalConsultas}</div>
              <p className="text-xs text-gray-600">
                <span className="text-green-600 font-medium">+{stats.consultasHoje}</span> hoje
              </p>
              <Button 
                className="mt-4 w-full" 
                onClick={() => navigate('/consulta-juridica')}
                variant="outline"
              >
                Fazer Consulta
              </Button>
            </CardContent>
          </Card>

          {/* Análises de Documentos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Análises de Documentos
              </CardTitle>
              <FileSearch className="h-4 w-4 text-govbr-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnalises}</div>
              <p className="text-xs text-gray-600">
                <span className="text-green-600 font-medium">+{stats.analisesHoje}</span> hoje
              </p>
              <Button 
                className="mt-4 w-full" 
                onClick={() => navigate('/analise-documentos')}
                variant="outline"
              >
                Analisar Documento
              </Button>
            </CardContent>
          </Card>

          {/* Documentos Oficiais */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Documentos Gerados
              </CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDocumentos}</div>
              <p className="text-xs text-gray-600">
                <span className="text-green-600 font-medium">+{stats.documentosHoje}</span> hoje
              </p>
              <Button 
                className="mt-4 w-full" 
                onClick={() => navigate('/gerar-documentos')}
                variant="outline"
              >
                Gerar Documento
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Suas últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Nenhuma atividade recente</p>
                <p className="text-sm mt-2">Comece usando as funcionalidades acima</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getActivityLabel(activity.type)} • {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => navigate('/consulta-juridica')}
                className="h-auto flex-col items-start p-4 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200"
                variant="outline"
              >
                <MessageSquare className="w-6 h-6 mb-2" />
                <div className="text-left">
                  <div className="font-semibold">Consulta Jurídica</div>
                  <div className="text-xs text-blue-700">
                    Tire dúvidas sobre legislação
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/analise-documentos')}
                className="h-auto flex-col items-start p-4 bg-govbr-blue/5 hover:bg-govbr-blue/10 text-govbr-blue-dark border border-govbr-blue-light"
                variant="outline"
              >
                <FileSearch className="w-6 h-6 mb-2" />
                <div className="text-left">
                  <div className="font-semibold">Análise de Documentos</div>
                  <div className="text-xs text-govbr-blue">
                    Analise editais e contratos
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/gerar-documentos')}
                className="h-auto flex-col items-start p-4 bg-green-50 hover:bg-green-100 text-green-900 border border-green-200"
                variant="outline"
              >
                <FileText className="w-6 h-6 mb-2" />
                <div className="text-left">
                  <div className="font-semibold">Gerar Documentos</div>
                  <div className="text-xs text-green-700">
                    Crie documentos oficiais
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
