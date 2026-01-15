/*
  # Sistema OpenRouter - Infraestrutura de Modelos de IA

  1. Nova Tabela: ai_models
    - Catálogo de modelos de IA disponíveis
    - Informações de preço, contexto, capabilities
    - Tags para filtros e recomendações
    
  2. Nova Tabela: user_model_preferences
    - Preferências de modelo por usuário e agente
    - Permite personalização da experiência
    
  3. Nova Tabela: usage_stats
    - Estatísticas agregadas de uso por dia
    - Tracking de custos e consumo de tokens
    - Base para dashboards e relatórios
    
  4. Modificações: messages
    - Adicionar informações de modelo usado
    - Tracking de tokens e custos por mensagem
    - Métricas de performance
    
  5. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas restritivas para acesso autenticado
    - Proteção de dados por usuário
*/

-- Tabela de modelos de IA disponíveis
CREATE TABLE IF NOT EXISTS ai_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  model_id text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  context_length integer,
  pricing_input numeric(10, 6),
  pricing_output numeric(10, 6),
  supports_json boolean DEFAULT false,
  supports_streaming boolean DEFAULT true,
  supports_vision boolean DEFAULT false,
  is_available boolean DEFAULT true,
  is_recommended boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_models_provider ON ai_models(provider);
CREATE INDEX IF NOT EXISTS idx_ai_models_available ON ai_models(is_available);
CREATE INDEX IF NOT EXISTS idx_ai_models_recommended ON ai_models(is_recommended);

ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;

-- Todos usuários autenticados podem ver modelos disponíveis
CREATE POLICY "Users can view available models"
  ON ai_models FOR SELECT
  TO authenticated
  USING (is_available = true);

-- Tabela de preferências de modelo por usuário
CREATE TABLE IF NOT EXISTS user_model_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid,
  preferred_model_id text REFERENCES ai_models(model_id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, agent_id)
);

CREATE INDEX IF NOT EXISTS idx_user_model_prefs_user ON user_model_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_model_prefs_agent ON user_model_preferences(agent_id);

ALTER TABLE user_model_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_model_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_model_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_model_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON user_model_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tabela de estatísticas de uso
CREATE TABLE IF NOT EXISTS usage_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid,
  model_id text REFERENCES ai_models(model_id) ON DELETE SET NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  total_messages integer DEFAULT 0,
  total_tokens_input integer DEFAULT 0,
  total_tokens_output integer DEFAULT 0,
  total_cost_usd numeric(10, 4) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, agent_id, model_id, date)
);

CREATE INDEX IF NOT EXISTS idx_usage_stats_user_date ON usage_stats(user_id, date);
CREATE INDEX IF NOT EXISTS idx_usage_stats_agent ON usage_stats(agent_id);
CREATE INDEX IF NOT EXISTS idx_usage_stats_model ON usage_stats(model_id);

ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats"
  ON usage_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Modificar tabela messages (se já existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'model_used'
  ) THEN
    ALTER TABLE messages ADD COLUMN model_used text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'model_provider'
  ) THEN
    ALTER TABLE messages ADD COLUMN model_provider text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'tokens_input'
  ) THEN
    ALTER TABLE messages ADD COLUMN tokens_input integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'tokens_output'
  ) THEN
    ALTER TABLE messages ADD COLUMN tokens_output integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'cost_usd'
  ) THEN
    ALTER TABLE messages ADD COLUMN cost_usd numeric(10, 6);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'processing_time_ms'
  ) THEN
    ALTER TABLE messages ADD COLUMN processing_time_ms integer;
  END IF;
END $$;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_ai_models_updated_at ON ai_models;
CREATE TRIGGER update_ai_models_updated_at
  BEFORE UPDATE ON ai_models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_model_preferences_updated_at ON user_model_preferences;
CREATE TRIGGER update_user_model_preferences_updated_at
  BEFORE UPDATE ON user_model_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_usage_stats_updated_at ON usage_stats;
CREATE TRIGGER update_usage_stats_updated_at
  BEFORE UPDATE ON usage_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();