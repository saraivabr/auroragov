import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, FileSearch, FileText, TrendingUp, Clock, CheckCircle2, AlertCircle, BarChart3, Users, FileCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Stats {
  totalConsultas: number;
  totalAnalises: number;
  totalDocumentos: number;
  consultasHoje: number;
}

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalConsultas: 0,
    totalAnalises: 0,
    totalDocumentos: 0,
    consultasHoje: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const [consultasResult, analisesResult, documentosResult, consultasHojeResult] = await Promise.all([
      supabase.from('consultas_juridicas').select('id', { count: 'exact', head: true }),
      supabase.from('analises_documentos').select('id', { count: 'exact', head: true }),
      supabase.from('documentos_oficiais').select('id', { count: 'exact', head: true }).eq('is_template', false),
      supabase.from('consultas_juridicas').select('id', { count: 'exact', head: true }).gte('created_at', hoje.toISOString())
    ]);

    setStats({
      totalConsultas: consultasResult.count || 0,
      totalAnalises: analisesResult.count || 0,
      totalDocumentos: documentosResult.count || 0,
      consultasHoje: consultasHojeResult.count || 0
    });

    const { data: recentConsultas } = await supabase
      .from('consultas_juridicas')
      .select('id, pergunta, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: recentAnalises } = await supabase
      .from('analises_documentos')
      .select('id, titulo, tipo_documento, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: recentDocumentos } = await supabase
      .from('documentos_oficiais')
      .select('id, titulo, tipo, created_at')
      .eq('is_template', false)
      .order('created_at', { ascending: false })
      .limit(3);

    const activities = [
      ...(recentConsultas || []).map(c => ({ ...c, type: 'consulta' })),
      ...(recentAnalises || []).map(a => ({ ...a, type: 'analise' })),
      ...(recentDocumentos || []).map(d => ({ ...d, type: 'documento' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6);

    setRecentActivity(activities);
    setIsLoading(false);
  };

  const features = [
    {
      icon: Scale,
      title: 'Consulta Jurídica',
      description: 'Consulte legislação brasileira com respostas fundamentadas em leis e decretos',
      color: 'from-blue-500 to-blue-600',
      path: '/consulta-juridica',
      stats: `${stats.totalConsultas} consultas realizadas`
    },
    {
      icon: FileSearch,
      title: 'Análise de Documentos',
      description: 'Analise editais, contratos e normativos identificando pontos críticos',
      color: 'from-green-500 to-green-600',
      path: '/analise-documentos',
      stats: `${stats.totalAnalises} documentos analisados`
    },
    {
      icon: FileText,
      title: 'Gerador de Documentos',
      description: 'Gere ofícios, memorandos e pareceres seguindo padrões oficiais',
      color: 'from-purple-500 to-purple-600',
      path: '/gerar-documentos',
      stats: `${stats.totalDocumentos} documentos gerados`
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'consulta': return <Scale className="w-4 h-4 text-blue-600" />;
      case 'analise': return <FileSearch className="w-4 h-4 text-green-600" />;
      case 'documento': return <FileText className="w-4 h-4 text-purple-600" />;
      default: return <FileCheck className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityTitle = (activity: any) => {
    switch (activity.type) {
      case 'consulta': return activity.pergunta?.substring(0, 60) + '...';
      case 'analise': return activity.titulo;
      case 'documento': return activity.titulo;
      default: return 'Atividade';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assistente Governamental IA
          </h1>
          <p className="text-gray-600">
            Bem-vindo(a), {user?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalConsultas}</p>
              <p className="text-sm text-gray-600">Consultas Jurídicas</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <FileSearch className="w-6 h-6 text-green-600" />
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAnalises}</p>
              <p className="text-sm text-gray-600">Análises de Documentos</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <FileCheck className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDocumentos}</p>
              <p className="text-sm text-gray-600">Documentos Gerados</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <BarChart3 className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.consultasHoje}</p>
              <p className="text-sm text-gray-600">Consultas Hoje</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(feature.path)}>
              <CardHeader>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{feature.stats}</span>
                  <Button size="sm" className={`bg-gradient-to-r ${feature.color} text-white`}>
                    Acessar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Atividades Recentes
              </CardTitle>
              <CardDescription>Suas últimas ações no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">Nenhuma atividade recente</p>
                  <p className="text-gray-500 text-xs mt-1">Comece utilizando as ferramentas acima</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getActivityTitle(activity)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {activity.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.created_at).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(activity.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recursos da Plataforma
              </CardTitle>
              <CardDescription>Ferramentas disponíveis para você</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Consultas Ilimitadas</p>
                    <p className="text-xs text-blue-700 mt-1">Acesso completo ao banco de legislação brasileira</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Análise Inteligente</p>
                    <p className="text-xs text-green-700 mt-1">IA avançada para análise de conformidade e riscos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Templates Oficiais</p>
                    <p className="text-xs text-purple-700 mt-1">Documentos seguindo padrões de redação oficial</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">Histórico Completo</p>
                    <p className="text-xs text-amber-700 mt-1">Acesso a todas as suas consultas e documentos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
