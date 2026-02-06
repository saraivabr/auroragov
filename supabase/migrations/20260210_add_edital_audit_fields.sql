-- Adicionar campos especializados para auditoria de editais
ALTER TABLE analises_documentos
  ADD COLUMN IF NOT EXISTS diagnostico_geral jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS pontos_defensaveis jsonb[] DEFAULT ARRAY[]::jsonb[],
  ADD COLUMN IF NOT EXISTS score_impugnacao jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS agent_type text DEFAULT 'generic';
