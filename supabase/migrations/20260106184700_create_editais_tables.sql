/*
  # Sistema de Gestão de Editais

  1. Nova Tabela: editais
    - `id` (uuid, primary key) - Identificador único
    - `numero_edital` (text) - Número do edital
    - `orgao` (text) - Órgão responsável
    - `objeto` (text) - Objeto da licitação
    - `modalidade` (text) - Modalidade (Pregão, Concorrência, etc)
    - `valor_estimado` (numeric) - Valor estimado da licitação
    - `data_publicacao` (date) - Data de publicação
    - `data_abertura` (timestamptz) - Data e hora de abertura
    - `status` (text) - Status do edital
    - `descricao` (text) - Descrição detalhada
    - `arquivo_url` (text, nullable) - URL do arquivo PDF no storage
    - `usuario_responsavel_id` (uuid, nullable) - Usuário responsável
    - `usuario_responsavel_nome` (text, nullable) - Nome do usuário responsável
    - `tags` (text[], nullable) - Tags para categorização
    - `created_at` (timestamptz) - Data de criação
    - `updated_at` (timestamptz) - Data de atualização
    - `user_id` (uuid) - Usuário criador (para RLS)

  2. Nova Tabela: analises_editais
    - `id` (uuid, primary key)
    - `edital_id` (uuid, foreign key) - Referência ao edital
    - `tipo_analise` (text) - Tipo: estrutural, jurídica, técnica, completa
    - `resultado` (jsonb) - Resultado estruturado da análise
    - `criticidade_geral` (text) - Criticidade geral: baixa, média, alta, crítica
    - `pontos_criticos` (jsonb[]) - Array de pontos críticos identificados
    - `pontos_importantes` (jsonb[]) - Array de pontos importantes
    - `sugestoes` (jsonb[]) - Array de sugestões
    - `modelo_ia` (text) - Modelo de IA utilizado
    - `usuario_id` (uuid) - Usuário que realizou a análise
    - `usuario_nome` (text) - Nome do usuário
    - `created_at` (timestamptz)

  3. Nova Tabela: comentarios_editais
    - `id` (uuid, primary key)
    - `edital_id` (uuid, foreign key)
    - `usuario_id` (uuid)
    - `usuario_nome` (text)
    - `comentario` (text)
    - `tipo` (text) - Tipo: comentário, observação, alerta
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  4. Segurança
    - Enable RLS em todas as tabelas
    - Políticas para operações CRUD baseadas em autenticação
*/

-- Criar tabela de editais
CREATE TABLE IF NOT EXISTS editais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_edital text NOT NULL,
  orgao text NOT NULL,
  objeto text NOT NULL,
  modalidade text NOT NULL,
  valor_estimado numeric(15, 2),
  data_publicacao date,
  data_abertura timestamptz,
  status text NOT NULL DEFAULT 'em_analise',
  descricao text,
  arquivo_url text,
  usuario_responsavel_id uuid,
  usuario_responsavel_nome text,
  tags text[],
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_editais_numero ON editais(numero_edital);
CREATE INDEX IF NOT EXISTS idx_editais_orgao ON editais(orgao);
CREATE INDEX IF NOT EXISTS idx_editais_status ON editais(status);
CREATE INDEX IF NOT EXISTS idx_editais_data_abertura ON editais(data_abertura);
CREATE INDEX IF NOT EXISTS idx_editais_user_id ON editais(user_id);

-- Criar tabela de análises de editais
CREATE TABLE IF NOT EXISTS analises_editais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  edital_id uuid NOT NULL REFERENCES editais(id) ON DELETE CASCADE,
  tipo_analise text NOT NULL,
  resultado jsonb DEFAULT '{}'::jsonb,
  criticidade_geral text DEFAULT 'média',
  pontos_criticos jsonb[] DEFAULT ARRAY[]::jsonb[],
  pontos_importantes jsonb[] DEFAULT ARRAY[]::jsonb[],
  sugestoes jsonb[] DEFAULT ARRAY[]::jsonb[],
  modelo_ia text,
  usuario_id uuid NOT NULL,
  usuario_nome text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analises_edital_id ON analises_editais(edital_id);
CREATE INDEX IF NOT EXISTS idx_analises_usuario_id ON analises_editais(usuario_id);

-- Criar tabela de comentários
CREATE TABLE IF NOT EXISTS comentarios_editais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  edital_id uuid NOT NULL REFERENCES editais(id) ON DELETE CASCADE,
  usuario_id uuid NOT NULL,
  usuario_nome text NOT NULL,
  comentario text NOT NULL,
  tipo text DEFAULT 'comentario',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comentarios_edital_id ON comentarios_editais(edital_id);

-- Enable Row Level Security
ALTER TABLE editais ENABLE ROW LEVEL SECURITY;
ALTER TABLE analises_editais ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios_editais ENABLE ROW LEVEL SECURITY;

-- Policies para editais
CREATE POLICY "Usuários autenticados podem visualizar editais"
  ON editais FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar editais"
  ON editais FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios editais"
  ON editais FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios editais"
  ON editais FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies para análises
CREATE POLICY "Usuários autenticados podem visualizar análises"
  ON analises_editais FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar análises"
  ON analises_editais FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar suas próprias análises"
  ON analises_editais FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem deletar suas próprias análises"
  ON analises_editais FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Policies para comentários
CREATE POLICY "Usuários autenticados podem visualizar comentários"
  ON comentarios_editais FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar comentários"
  ON comentarios_editais FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar seus próprios comentários"
  ON comentarios_editais FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem deletar seus próprios comentários"
  ON comentarios_editais FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at em editais
DROP TRIGGER IF EXISTS update_editais_updated_at ON editais;
CREATE TRIGGER update_editais_updated_at
  BEFORE UPDATE ON editais
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar updated_at em comentários
DROP TRIGGER IF EXISTS update_comentarios_updated_at ON comentarios_editais;
CREATE TRIGGER update_comentarios_updated_at
  BEFORE UPDATE ON comentarios_editais
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();