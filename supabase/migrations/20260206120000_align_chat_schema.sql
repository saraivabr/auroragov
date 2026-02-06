/*
  # Align chat schema with Edge Functions and generated types

  The repo currently has:
  - conversations/messages tables (basic)
  - openrouter system tables (ai_models, user_model_preferences, usage_stats)

  But the Edge Function `chat-with-agent` and `src/types/supabase-generated.ts`
  assume:
  - `agents` table exists
  - `messages` has `user_id`, `agent_id`, and `role` includes 'system'
*/

-- Agents table (used by chat-with-agent)
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  specialty text NOT NULL,
  system_prompt text NOT NULL,
  icon text NOT NULL DEFAULT 'bot',
  color text NOT NULL DEFAULT '#2670E8',
  default_model_id text REFERENCES ai_models(model_id) ON DELETE SET NULL,
  recommended_models text[] DEFAULT '{}',
  max_tokens integer NOT NULL DEFAULT 2000,
  temperature numeric(3, 2) NOT NULL DEFAULT 0.70,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_agents_active ON agents(is_active);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Users can view active agents
DROP POLICY IF EXISTS "Users can view active agents" ON agents;
CREATE POLICY "Users can view active agents"
  ON agents FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Align messages columns/constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'agent_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN agent_id uuid REFERENCES agents(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Backfill user_id from conversations for existing rows, then enforce NOT NULL.
UPDATE messages
SET user_id = conversations.user_id
FROM conversations
WHERE messages.user_id IS NULL
  AND conversations.id = messages.conversation_id;

ALTER TABLE messages
  ALTER COLUMN user_id SET NOT NULL;

-- Allow role 'system' (and keep existing roles)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'messages'
      AND constraint_type = 'CHECK'
      AND constraint_name = 'messages_role_check'
  ) THEN
    ALTER TABLE messages DROP CONSTRAINT messages_role_check;
  END IF;
END $$;

ALTER TABLE messages
  ADD CONSTRAINT messages_role_check CHECK (role IN ('user', 'assistant', 'system'));

CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_agent_id ON messages(agent_id);

-- Tighten messages INSERT policy to enforce user_id matches auth.uid()
DROP POLICY IF EXISTS "Users can create messages in own conversations" ON messages;
CREATE POLICY "Users can create messages in own conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

