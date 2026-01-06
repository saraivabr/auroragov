export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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
          created_at: string
          updated_at: string
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
          created_at?: string
          updated_at?: string
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
          created_at?: string
          updated_at?: string
        }
      }
      app_users: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          status: string
          last_login: string
          projects_count: number
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role?: string
          status?: string
          last_login?: string
          projects_count?: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          status?: string
          last_login?: string
          projects_count?: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
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
          created_at: string
          updated_at: string
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
          created_at?: string
          updated_at?: string
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
          created_at?: string
          updated_at?: string
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
          timestamp: string
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
          timestamp?: string
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
          timestamp?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
