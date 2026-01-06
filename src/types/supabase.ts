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
      analises_documentos: {
        Row: {
          id: string
          user_id: string
          user_name: string
          tipo_documento: string
          titulo: string
          conteudo_original: string
          resumo: string
          pontos_criticos: Json[]
          checklist: Json[]
          riscos_identificados: Json[]
          status: string
          arquivo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_name: string
          tipo_documento: string
          titulo: string
          conteudo_original: string
          resumo: string
          pontos_criticos?: Json[]
          checklist?: Json[]
          riscos_identificados?: Json[]
          status?: string
          arquivo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_name?: string
          tipo_documento?: string
          titulo?: string
          conteudo_original?: string
          resumo?: string
          pontos_criticos?: Json[]
          checklist?: Json[]
          riscos_identificados?: Json[]
          status?: string
          arquivo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      base_normativa: {
        Row: {
          id: string
          tipo: string
          numero: string
          ano: number
          ementa: string
          conteudo: string
          orgao_emissor: string
          data_publicacao: string
          status: string
          tags: string[]
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tipo: string
          numero: string
          ano: number
          ementa: string
          conteudo: string
          orgao_emissor: string
          data_publicacao: string
          status?: string
          tags?: string[]
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tipo?: string
          numero?: string
          ano?: number
          ementa?: string
          conteudo?: string
          orgao_emissor?: string
          data_publicacao?: string
          status?: string
          tags?: string[]
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      consultas_juridicas: {
        Row: {
          id: string
          user_id: string
          user_name: string
          pergunta: string
          resposta: string
          normas_relacionadas: Json[]
          confiabilidade: string
          feedback: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_name: string
          pergunta: string
          resposta: string
          normas_relacionadas?: Json[]
          confiabilidade?: string
          feedback?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_name?: string
          pergunta?: string
          resposta?: string
          normas_relacionadas?: Json[]
          confiabilidade?: string
          feedback?: string | null
          created_at?: string
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
      documentos_oficiais: {
        Row: {
          id: string
          user_id: string
          user_name: string
          tipo: string
          titulo: string
          conteudo: string
          destinatario: string | null
          numero_documento: string | null
          is_template: boolean
          status: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_name: string
          tipo: string
          titulo: string
          conteudo: string
          destinatario?: string | null
          numero_documento?: string | null
          is_template?: boolean
          status?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_name?: string
          tipo?: string
          titulo?: string
          conteudo?: string
          destinatario?: string | null
          numero_documento?: string | null
          is_template?: boolean
          status?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
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
      processos_administrativos: {
        Row: {
          id: string
          numero_processo: string
          tipo: string
          assunto: string
          requerente: string
          status: string
          prioridade: string
          prazo_limite: string | null
          orgao_responsavel: string
          servidor_responsavel_id: string | null
          servidor_responsavel_nome: string | null
          proximo_passo: string | null
          historico: Json[]
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero_processo: string
          tipo: string
          assunto: string
          requerente: string
          status?: string
          prioridade?: string
          prazo_limite?: string | null
          orgao_responsavel: string
          servidor_responsavel_id?: string | null
          servidor_responsavel_nome?: string | null
          proximo_passo?: string | null
          historico?: Json[]
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero_processo?: string
          tipo?: string
          assunto?: string
          requerente?: string
          status?: string
          prioridade?: string
          prazo_limite?: string | null
          orgao_responsavel?: string
          servidor_responsavel_id?: string | null
          servidor_responsavel_nome?: string | null
          proximo_passo?: string | null
          historico?: Json[]
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      recursos_administrativos: {
        Row: {
          id: string
          numero_recurso: string
          processo_origem: string
          tipo_recurso: string
          recorrente: string
          fundamentacao: string
          analise_ia: Json
          teoria_juridica_aplicavel: string | null
          sugestao_posicionamento: string | null
          status: string
          prazo_decisao: string
          servidor_responsavel_id: string | null
          servidor_responsavel_nome: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero_recurso: string
          processo_origem: string
          tipo_recurso: string
          recorrente: string
          fundamentacao: string
          analise_ia?: Json
          teoria_juridica_aplicavel?: string | null
          sugestao_posicionamento?: string | null
          status?: string
          prazo_decisao: string
          servidor_responsavel_id?: string | null
          servidor_responsavel_nome?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero_recurso?: string
          processo_origem?: string
          tipo_recurso?: string
          recorrente?: string
          fundamentacao?: string
          analise_ia?: Json
          teoria_juridica_aplicavel?: string | null
          sugestao_posicionamento?: string | null
          status?: string
          prazo_decisao?: string
          servidor_responsavel_id?: string | null
          servidor_responsavel_nome?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      solicitacoes_cidadao: {
        Row: {
          id: string
          protocolo: string
          tipo: string
          assunto: string
          descricao: string
          cidadao_nome: string
          cidadao_cpf: string
          cidadao_email: string
          status: string
          resposta_sugerida: string | null
          resposta_final: string | null
          prazo_resposta: string
          servidor_responsavel_id: string | null
          servidor_responsavel_nome: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          protocolo: string
          tipo: string
          assunto: string
          descricao: string
          cidadao_nome: string
          cidadao_cpf: string
          cidadao_email: string
          status?: string
          resposta_sugerida?: string | null
          resposta_final?: string | null
          prazo_resposta: string
          servidor_responsavel_id?: string | null
          servidor_responsavel_nome?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          protocolo?: string
          tipo?: string
          assunto?: string
          descricao?: string
          cidadao_nome?: string
          cidadao_cpf?: string
          cidadao_email?: string
          status?: string
          resposta_sugerida?: string | null
          resposta_final?: string | null
          prazo_resposta?: string
          servidor_responsavel_id?: string | null
          servidor_responsavel_nome?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
