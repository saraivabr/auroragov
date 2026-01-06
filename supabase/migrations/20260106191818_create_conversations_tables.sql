/*
  # Create conversations and messages tables

  ## Overview
  Este schema cria tabelas para gerenciar conversas e mensagens em um sistema de chat tipo ChatGPT,
  adaptado para o contexto governamental.

  ## New Tables
  
  ### `conversations`
  Armazena conversas dos usuários
  - `id` (uuid, primary key) - Identificador único da conversa
  - `user_id` (uuid, foreign key) - Referência ao usuário (auth.users)
  - `title` (text) - Título da conversa (gerado automaticamente ou editável)
  - `created_at` (timestamptz) - Data de criação
  - `updated_at` (timestamptz) - Data da última atualização
  
  ### `messages`
  Armazena mensagens individuais dentro das conversas
  - `id` (uuid, primary key) - Identificador único da mensagem
  - `conversation_id` (uuid, foreign key) - Referência à conversa
  - `role` (text) - Papel do autor ('user' ou 'assistant')
  - `content` (text) - Conteúdo da mensagem
  - `model` (text) - Modelo de IA utilizado (para mensagens do assistente)
  - `created_at` (timestamptz) - Data de criação
  
  ## Security
  
  ### RLS Policies
  - Usuários só podem visualizar suas próprias conversas
  - Usuários só podem criar conversas para si mesmos
  - Usuários só podem atualizar suas próprias conversas
  - Usuários só podem deletar suas próprias conversas
  - Usuários só podem visualizar mensagens de suas conversas
  - Usuários só podem criar mensagens em suas conversas
  - Mensagens não podem ser atualizadas (histórico imutável)
  - Usuários podem deletar mensagens de suas conversas
  
  ## Indexes
  - Index em `user_id` para otimizar busca de conversas por usuário
  - Index em `conversation_id` para otimizar busca de mensagens por conversa
  - Index em `updated_at` para ordenação de conversas
  - Index em `created_at` para ordenação de mensagens
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT 'Nova conversa',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  model text DEFAULT 'gpt-4',
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at ASC);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations table

-- Users can view their own conversations
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own conversations
CREATE POLICY "Users can create own conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own conversations
CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own conversations
CREATE POLICY "Users can delete own conversations"
  ON conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for messages table

-- Users can view messages from their own conversations
CREATE POLICY "Users can view messages from own conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Users can create messages in their own conversations
CREATE POLICY "Users can create messages in own conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Users can delete messages from their own conversations
CREATE POLICY "Users can delete messages from own conversations"
  ON messages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation's updated_at when a message is added
DROP TRIGGER IF EXISTS update_conversation_timestamp ON messages;
CREATE TRIGGER update_conversation_timestamp
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversations_updated_at();