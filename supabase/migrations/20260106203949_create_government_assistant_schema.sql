/*
  # Schema completo para Assistente Governamental

  ## Visão Geral
  Este schema implementa um sistema completo de assistência para servidores públicos,
  incluindo consulta jurídica, análise de documentos, geração de documentos oficiais,
  e gestão de processos administrativos.

  ## Novas Tabelas

  ### `base_normativa`
  Armazena leis, decretos, portarias e outras normas
  - `id` (uuid, primary key)
  - `tipo` (text) - Lei, Decreto, Portaria, etc
  - `numero` (text) - Número da norma
  - `ano` (integer) - Ano de publicação
  - `ementa` (text) - Resumo/ementa
  - `conteudo` (text) - Texto completo
  - `orgao_emissor` (text) - Órgão que emitiu
  - `data_publicacao` (date)
  - `status` (text) - vigente, revogada, suspensa
  - `tags` (text[]) - Para busca e categorização
  - `user_id` (uuid) - Usuário que cadastrou
  - `created_at`, `updated_at`

  ### `consultas_juridicas`
  Histórico de consultas jurídicas realizadas
  - `id` (uuid, primary key)
  - `user_id` (uuid)
  - `user_name` (text)
  - `pergunta` (text) - Consulta feita
  - `resposta` (text) - Resposta gerada
  - `normas_relacionadas` (jsonb[]) - Normas citadas
  - `confiabilidade` (text) - alta, média, baixa
  - `feedback` (text) - positivo, negativo, neutro
  - `created_at`

  ### `analises_documentos`
  Análises de editais, contratos e documentos
  - `id` (uuid, primary key)
  - `user_id` (uuid)
  - `user_name` (text)
  - `tipo_documento` (text) - edital, contrato, parecer, etc
  - `titulo` (text)
  - `conteudo_original` (text)
  - `resumo` (text) - Resumo automático
  - `pontos_criticos` (jsonb[]) - Pontos de atenção
  - `checklist` (jsonb[]) - Itens a verificar
  - `riscos_identificados` (jsonb[])
  - `status` (text) - em_analise, concluido
  - `arquivo_url` (text)
  - `created_at`, `updated_at`

  ### `documentos_oficiais`
  Templates e documentos gerados
  - `id` (uuid, primary key)
  - `user_id` (uuid)
  - `user_name` (text)
  - `tipo` (text) - oficio, memorando, parecer, despacho
  - `titulo` (text)
  - `conteudo` (text)
  - `destinatario` (text)
  - `numero_documento` (text)
  - `is_template` (boolean)
  - `status` (text) - rascunho, finalizado, enviado
  - `metadata` (jsonb) - Campos adicionais
  - `created_at`, `updated_at`

  ### `processos_administrativos`
  Processos em triagem e acompanhamento
  - `id` (uuid, primary key)
  - `numero_processo` (text)
  - `tipo` (text)
  - `assunto` (text)
  - `requerente` (text)
  - `status` (text)
  - `prioridade` (text) - urgente, alta, normal, baixa
  - `prazo_limite` (date)
  - `orgao_responsavel` (text)
  - `servidor_responsavel_id` (uuid)
  - `servidor_responsavel_nome` (text)
  - `proximo_passo` (text)
  - `historico` (jsonb[])
  - `user_id` (uuid)
  - `created_at`, `updated_at`

  ### `solicitacoes_cidadao`
  Pedidos e requerimentos de cidadãos
  - `id` (uuid, primary key)
  - `protocolo` (text)
  - `tipo` (text)
  - `assunto` (text)
  - `descricao` (text)
  - `cidadao_nome` (text)
  - `cidadao_cpf` (text)
  - `cidadao_email` (text)
  - `status` (text) - pendente, em_analise, respondido
  - `resposta_sugerida` (text)
  - `resposta_final` (text)
  - `prazo_resposta` (date)
  - `servidor_responsavel_id` (uuid)
  - `servidor_responsavel_nome` (text)
  - `user_id` (uuid)
  - `created_at`, `updated_at`

  ### `recursos_administrativos`
  Recursos e impugnações
  - `id` (uuid, primary key)
  - `numero_recurso` (text)
  - `processo_origem` (text)
  - `tipo_recurso` (text)
  - `recorrente` (text)
  - `fundamentacao` (text)
  - `analise_ia` (jsonb) - Análise automática
  - `teoria_juridica_aplicavel` (text)
  - `sugestao_posicionamento` (text)
  - `status` (text)
  - `prazo_decisao` (date)
  - `servidor_responsavel_id` (uuid)
  - `servidor_responsavel_nome` (text)
  - `user_id` (uuid)
  - `created_at`, `updated_at`

  ## Security
  - RLS habilitado em todas as tabelas
  - Políticas restritivas: apenas usuários autenticados
  - Acesso baseado em user_id do auth.users

  ## Indexes
  - Indexes em campos de busca frequente
  - Indexes em datas para ordenação
  - Indexes em status para filtros
*/

-- Table: base_normativa
CREATE TABLE IF NOT EXISTS base_normativa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL CHECK (tipo IN ('lei', 'decreto', 'portaria', 'instrucao_normativa', 'resolucao', 'medida_provisoria')),
  numero text NOT NULL,
  ano integer NOT NULL,
  ementa text NOT NULL,
  conteudo text NOT NULL,
  orgao_emissor text NOT NULL,
  data_publicacao date NOT NULL,
  status text DEFAULT 'vigente' CHECK (status IN ('vigente', 'revogada', 'suspensa')),
  tags text[] DEFAULT ARRAY[]::text[],
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Table: consultas_juridicas
CREATE TABLE IF NOT EXISTS consultas_juridicas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name text NOT NULL,
  pergunta text NOT NULL,
  resposta text NOT NULL,
  normas_relacionadas jsonb[] DEFAULT ARRAY[]::jsonb[],
  confiabilidade text DEFAULT 'média' CHECK (confiabilidade IN ('alta', 'média', 'baixa')),
  feedback text CHECK (feedback IN ('positivo', 'negativo', 'neutro')),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Table: analises_documentos
CREATE TABLE IF NOT EXISTS analises_documentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name text NOT NULL,
  tipo_documento text NOT NULL CHECK (tipo_documento IN ('edital', 'contrato', 'parecer', 'normativo', 'outro')),
  titulo text NOT NULL,
  conteudo_original text NOT NULL,
  resumo text NOT NULL,
  pontos_criticos jsonb[] DEFAULT ARRAY[]::jsonb[],
  checklist jsonb[] DEFAULT ARRAY[]::jsonb[],
  riscos_identificados jsonb[] DEFAULT ARRAY[]::jsonb[],
  status text DEFAULT 'em_analise' CHECK (status IN ('em_analise', 'concluido')),
  arquivo_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Table: documentos_oficiais
CREATE TABLE IF NOT EXISTS documentos_oficiais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('oficio', 'memorando', 'parecer', 'despacho', 'portaria', 'outro')),
  titulo text NOT NULL,
  conteudo text NOT NULL,
  destinatario text,
  numero_documento text,
  is_template boolean DEFAULT false,
  status text DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'finalizado', 'enviado', 'arquivado')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Table: processos_administrativos
CREATE TABLE IF NOT EXISTS processos_administrativos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_processo text NOT NULL UNIQUE,
  tipo text NOT NULL,
  assunto text NOT NULL,
  requerente text NOT NULL,
  status text DEFAULT 'em_analise' CHECK (status IN ('aguardando', 'em_analise', 'pendente', 'concluido', 'arquivado')),
  prioridade text DEFAULT 'normal' CHECK (prioridade IN ('urgente', 'alta', 'normal', 'baixa')),
  prazo_limite date,
  orgao_responsavel text NOT NULL,
  servidor_responsavel_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  servidor_responsavel_nome text,
  proximo_passo text,
  historico jsonb[] DEFAULT ARRAY[]::jsonb[],
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Table: solicitacoes_cidadao
CREATE TABLE IF NOT EXISTS solicitacoes_cidadao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo text NOT NULL UNIQUE,
  tipo text NOT NULL CHECK (tipo IN ('informacao', 'requerimento', 'reclamacao', 'sugestao', 'denuncia')),
  assunto text NOT NULL,
  descricao text NOT NULL,
  cidadao_nome text NOT NULL,
  cidadao_cpf text NOT NULL,
  cidadao_email text NOT NULL,
  status text DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'respondido', 'arquivado')),
  resposta_sugerida text,
  resposta_final text,
  prazo_resposta date NOT NULL,
  servidor_responsavel_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  servidor_responsavel_nome text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Table: recursos_administrativos
CREATE TABLE IF NOT EXISTS recursos_administrativos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_recurso text NOT NULL UNIQUE,
  processo_origem text NOT NULL,
  tipo_recurso text NOT NULL CHECK (tipo_recurso IN ('recurso_hierarquico', 'recurso_revisao', 'pedido_reconsideracao', 'impugnacao')),
  recorrente text NOT NULL,
  fundamentacao text NOT NULL,
  analise_ia jsonb DEFAULT '{}'::jsonb,
  teoria_juridica_aplicavel text,
  sugestao_posicionamento text,
  status text DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'deferido', 'indeferido', 'parcialmente_deferido')),
  prazo_decisao date NOT NULL,
  servidor_responsavel_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  servidor_responsavel_nome text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_base_normativa_tipo ON base_normativa(tipo);
CREATE INDEX IF NOT EXISTS idx_base_normativa_status ON base_normativa(status);
CREATE INDEX IF NOT EXISTS idx_base_normativa_user_id ON base_normativa(user_id);
CREATE INDEX IF NOT EXISTS idx_base_normativa_data_publicacao ON base_normativa(data_publicacao DESC);

CREATE INDEX IF NOT EXISTS idx_consultas_juridicas_user_id ON consultas_juridicas(user_id);
CREATE INDEX IF NOT EXISTS idx_consultas_juridicas_created_at ON consultas_juridicas(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analises_documentos_user_id ON analises_documentos(user_id);
CREATE INDEX IF NOT EXISTS idx_analises_documentos_tipo ON analises_documentos(tipo_documento);
CREATE INDEX IF NOT EXISTS idx_analises_documentos_status ON analises_documentos(status);

CREATE INDEX IF NOT EXISTS idx_documentos_oficiais_user_id ON documentos_oficiais(user_id);
CREATE INDEX IF NOT EXISTS idx_documentos_oficiais_tipo ON documentos_oficiais(tipo);
CREATE INDEX IF NOT EXISTS idx_documentos_oficiais_status ON documentos_oficiais(status);
CREATE INDEX IF NOT EXISTS idx_documentos_oficiais_is_template ON documentos_oficiais(is_template);

CREATE INDEX IF NOT EXISTS idx_processos_numero ON processos_administrativos(numero_processo);
CREATE INDEX IF NOT EXISTS idx_processos_status ON processos_administrativos(status);
CREATE INDEX IF NOT EXISTS idx_processos_prioridade ON processos_administrativos(prioridade);
CREATE INDEX IF NOT EXISTS idx_processos_user_id ON processos_administrativos(user_id);

CREATE INDEX IF NOT EXISTS idx_solicitacoes_protocolo ON solicitacoes_cidadao(protocolo);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_status ON solicitacoes_cidadao(status);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_user_id ON solicitacoes_cidadao(user_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_prazo ON solicitacoes_cidadao(prazo_resposta);

CREATE INDEX IF NOT EXISTS idx_recursos_numero ON recursos_administrativos(numero_recurso);
CREATE INDEX IF NOT EXISTS idx_recursos_status ON recursos_administrativos(status);
CREATE INDEX IF NOT EXISTS idx_recursos_user_id ON recursos_administrativos(user_id);

-- Enable RLS
ALTER TABLE base_normativa ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas_juridicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE analises_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_oficiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE processos_administrativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitacoes_cidadao ENABLE ROW LEVEL SECURITY;
ALTER TABLE recursos_administrativos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for base_normativa
CREATE POLICY "Users can view all norms"
  ON base_normativa FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create norms"
  ON base_normativa FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own norms"
  ON base_normativa FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own norms"
  ON base_normativa FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for consultas_juridicas
CREATE POLICY "Users can view own consultations"
  ON consultas_juridicas FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create consultations"
  ON consultas_juridicas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own consultations"
  ON consultas_juridicas FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for analises_documentos
CREATE POLICY "Users can view own analyses"
  ON analises_documentos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create analyses"
  ON analises_documentos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON analises_documentos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON analises_documentos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for documentos_oficiais
CREATE POLICY "Users can view own documents"
  ON documentos_oficiais FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_template = true);

CREATE POLICY "Users can create documents"
  ON documentos_oficiais FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON documentos_oficiais FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON documentos_oficiais FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for processos_administrativos
CREATE POLICY "Users can view own processes"
  ON processos_administrativos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = servidor_responsavel_id);

CREATE POLICY "Users can create processes"
  ON processos_administrativos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own processes"
  ON processos_administrativos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = servidor_responsavel_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = servidor_responsavel_id);

CREATE POLICY "Users can delete own processes"
  ON processos_administrativos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for solicitacoes_cidadao
CREATE POLICY "Users can view own requests"
  ON solicitacoes_cidadao FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = servidor_responsavel_id);

CREATE POLICY "Users can create requests"
  ON solicitacoes_cidadao FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requests"
  ON solicitacoes_cidadao FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = servidor_responsavel_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = servidor_responsavel_id);

CREATE POLICY "Users can delete own requests"
  ON solicitacoes_cidadao FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for recursos_administrativos
CREATE POLICY "Users can view own appeals"
  ON recursos_administrativos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = servidor_responsavel_id);

CREATE POLICY "Users can create appeals"
  ON recursos_administrativos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appeals"
  ON recursos_administrativos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = servidor_responsavel_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = servidor_responsavel_id);

CREATE POLICY "Users can delete own appeals"
  ON recursos_administrativos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);