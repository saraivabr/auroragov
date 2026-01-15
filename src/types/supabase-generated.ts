export interface Database {
  public: {
    Tables: {
      ai_models: {
        Row: {
          id: string;
          provider: string;
          model_id: string;
          display_name: string;
          description: string | null;
          context_length: number | null;
          pricing_input: number | null;
          pricing_output: number | null;
          supports_json: boolean;
          supports_streaming: boolean;
          supports_vision: boolean;
          is_available: boolean;
          is_recommended: boolean;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider: string;
          model_id: string;
          display_name: string;
          description?: string | null;
          context_length?: number | null;
          pricing_input?: number | null;
          pricing_output?: number | null;
          supports_json?: boolean;
          supports_streaming?: boolean;
          supports_vision?: boolean;
          is_available?: boolean;
          is_recommended?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          provider?: string;
          model_id?: string;
          display_name?: string;
          description?: string | null;
          context_length?: number | null;
          pricing_input?: number | null;
          pricing_output?: number | null;
          supports_json?: boolean;
          supports_streaming?: boolean;
          supports_vision?: boolean;
          is_available?: boolean;
          is_recommended?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      user_model_preferences: {
        Row: {
          id: string;
          user_id: string;
          agent_id: string | null;
          preferred_model_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          agent_id?: string | null;
          preferred_model_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          agent_id?: string | null;
          preferred_model_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_stats: {
        Row: {
          id: string;
          user_id: string;
          agent_id: string | null;
          model_id: string | null;
          date: string;
          total_messages: number;
          total_tokens_input: number;
          total_tokens_output: number;
          total_cost_usd: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          agent_id?: string | null;
          model_id?: string | null;
          date?: string;
          total_messages?: number;
          total_tokens_input?: number;
          total_tokens_output?: number;
          total_cost_usd?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          agent_id?: string | null;
          model_id?: string | null;
          date?: string;
          total_messages?: number;
          total_tokens_input?: number;
          total_tokens_output?: number;
          total_cost_usd?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          agent_id: string | null;
          role: 'user' | 'assistant' | 'system';
          content: string;
          user_id: string;
          model_used: string | null;
          model_provider: string | null;
          tokens_input: number;
          tokens_output: number;
          cost_usd: number | null;
          processing_time_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          agent_id?: string | null;
          role: 'user' | 'assistant' | 'system';
          content: string;
          user_id: string;
          model_used?: string | null;
          model_provider?: string | null;
          tokens_input?: number;
          tokens_output?: number;
          cost_usd?: number | null;
          processing_time_ms?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          agent_id?: string | null;
          role?: 'user' | 'assistant' | 'system';
          content?: string;
          user_id?: string;
          model_used?: string | null;
          model_provider?: string | null;
          tokens_input?: number;
          tokens_output?: number;
          cost_usd?: number | null;
          processing_time_ms?: number | null;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      agents: {
        Row: {
          id: string;
          name: string;
          role: string;
          specialty: string;
          system_prompt: string;
          icon: string;
          color: string;
          default_model_id: string | null;
          recommended_models: string[] | null;
          max_tokens: number;
          temperature: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          specialty: string;
          system_prompt: string;
          icon: string;
          color: string;
          default_model_id?: string | null;
          recommended_models?: string[] | null;
          max_tokens?: number;
          temperature?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          specialty?: string;
          system_prompt?: string;
          icon?: string;
          color?: string;
          default_model_id?: string | null;
          recommended_models?: string[] | null;
          max_tokens?: number;
          temperature?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
