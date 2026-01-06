export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analises_editais: {
        Row: {
          id: string
          edital_id: string
          tipo_analise: string
          resultado: Json | null
          criticidade_geral: string | null
          pontos_criticos: Json[] | null
          pontos_importantes: Json[] | null
          sugestoes: Json[] | null
          modelo_ia: string | null
          usuario_id: string
          usuario_nome: string
          created_at: string | null
        }
        Insert: {
          id?: string
          edital_id: string
          tipo_analise: string
          resultado?: Json | null
          criticidade_geral?: string | null
          pontos_criticos?: Json[] | null
          pontos_importantes?: Json[] | null
          sugestoes?: Json[] | null
          modelo_ia?: string | null
          usuario_id: string
          usuario_nome: string
          created_at?: string | null
        }
        Update: {
          id?: string
          edital_id?: string
          tipo_analise?: string
          resultado?: Json | null
          criticidade_geral?: string | null
          pontos_criticos?: Json[] | null
          pontos_importantes?: Json[] | null
          sugestoes?: Json[] | null
          modelo_ia?: string | null
          usuario_id?: string
          usuario_nome?: string
          created_at?: string | null
        }
      }
      app_users: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          status: string
          last_login: string | null
          projects_count: number
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          role?: string
          status?: string
          last_login?: string | null
          projects_count?: number
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          status?: string
          last_login?: string | null
          projects_count?: number
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          user_name: string
          action: string
          entity_type: string
          entity_id: string | null
          details: string
          metadata: Json | null
          timestamp: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          user_name: string
          action: string
          entity_type: string
          entity_id?: string | null
          details: string
          metadata?: Json | null
          timestamp?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          user_name?: string
          action?: string
          entity_type?: string
          entity_id?: string | null
          details?: string
          metadata?: Json | null
          timestamp?: string | null
        }
      }
      comentarios_editais: {
        Row: {
          id: string
          edital_id: string
          usuario_id: string
          usuario_nome: string
          comentario: string
          tipo: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          edital_id: string
          usuario_id: string
          usuario_nome: string
          comentario: string
          tipo?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          edital_id?: string
          usuario_id?: string
          usuario_nome?: string
          comentario?: string
          tipo?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
      }
      editais: {
        Row: {
          id: string
          numero_edital: string
          orgao: string
          objeto: string
          modalidade: string
          valor_estimado: number | null
          data_publicacao: string | null
          data_abertura: string | null
          status: string
          descricao: string | null
          arquivo_url: string | null
          usuario_responsavel_id: string | null
          usuario_responsavel_nome: string | null
          tags: string[] | null
          user_id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          numero_edital: string
          orgao: string
          objeto: string
          modalidade: string
          valor_estimado?: number | null
          data_publicacao?: string | null
          data_abertura?: string | null
          status?: string
          descricao?: string | null
          arquivo_url?: string | null
          usuario_responsavel_id?: string | null
          usuario_responsavel_nome?: string | null
          tags?: string[] | null
          user_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          numero_edital?: string
          orgao?: string
          objeto?: string
          modalidade?: string
          valor_estimado?: number | null
          data_publicacao?: string | null
          data_abertura?: string | null
          status?: string
          descricao?: string | null
          arquivo_url?: string | null
          usuario_responsavel_id?: string | null
          usuario_responsavel_nome?: string | null
          tags?: string[] | null
          user_id?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          status: string
          payment_method: string
          amount: number
          date: string
          customer_name: string
          customer_email: string
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          invoice_number: string
          status?: string
          payment_method: string
          amount?: number
          date?: string
          customer_name: string
          customer_email: string
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          invoice_number?: string
          status?: string
          payment_method?: string
          amount?: number
          date?: string
          customer_name?: string
          customer_email?: string
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: string
          content: string
          model: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: string
          content: string
          model?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: string
          content?: string
          model?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          stock: number
          category: string
          sku: string
          image_url: string | null
          is_active: boolean
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string
          price?: number
          stock?: number
          category: string
          sku: string
          image_url?: string | null
          is_active?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          stock?: number
          category?: string
          sku?: string
          image_url?: string | null
          is_active?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
