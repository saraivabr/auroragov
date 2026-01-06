export interface Invoice {
  id: string
  invoice_number: string
  status: 'paid' | 'pending' | 'unpaid'
  payment_method: string
  amount: number
  date: string
  customer_name: string
  customer_email: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface AppUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'developer' | 'designer' | 'manager'
  status: 'active' | 'inactive'
  last_login: string
  projects_count: number
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Product {
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

export interface AuditLog {
  id: string
  user_id: string | null
  user_name: string
  action: string
  entity_type: string
  entity_id: string | null
  details: string
  metadata: Record<string, any> | null
  timestamp: string
}

export type InvoiceInsert = Omit<Invoice, 'id' | 'created_at' | 'updated_at'>
export type InvoiceUpdate = Partial<InvoiceInsert>

export type AppUserInsert = Omit<AppUser, 'id' | 'created_at' | 'updated_at' | 'last_login'>
export type AppUserUpdate = Partial<Omit<AppUser, 'id' | 'created_at' | 'updated_at'>>

export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at'>
export type ProductUpdate = Partial<ProductInsert>

export type AuditLogInsert = Omit<AuditLog, 'id' | 'timestamp'>

export interface Edital {
  id: string
  numero_edital: string
  orgao: string
  objeto: string
  modalidade: string
  valor_estimado: number | null
  data_publicacao: string | null
  data_abertura: string | null
  status: 'em_analise' | 'aprovado' | 'rejeitado' | 'enviado' | 'cancelado'
  descricao: string | null
  arquivo_url: string | null
  usuario_responsavel_id: string | null
  usuario_responsavel_nome: string | null
  tags: string[] | null
  user_id: string
  created_at: string
  updated_at: string
}

export interface PontoAnalise {
  titulo: string
  descricao: string
  referencia_legal?: string
  localizacao?: string
  impacto?: string
}

export interface AnaliseEdital {
  id: string
  edital_id: string
  tipo_analise: 'estrutural' | 'juridica' | 'tecnica' | 'completa'
  resultado: Record<string, any>
  criticidade_geral: 'baixa' | 'media' | 'alta' | 'critica'
  pontos_criticos: PontoAnalise[]
  pontos_importantes: PontoAnalise[]
  sugestoes: PontoAnalise[]
  modelo_ia: string | null
  usuario_id: string
  usuario_nome: string
  created_at: string
}

export interface ComentarioEdital {
  id: string
  edital_id: string
  usuario_id: string
  usuario_nome: string
  comentario: string
  tipo: 'comentario' | 'observacao' | 'alerta'
  created_at: string
  updated_at: string
}

export type EditalInsert = Omit<Edital, 'id' | 'created_at' | 'updated_at'>
export type EditalUpdate = Partial<EditalInsert>

export type AnaliseEditalInsert = Omit<AnaliseEdital, 'id' | 'created_at'>
export type AnaliseEditalUpdate = Partial<AnaliseEditalInsert>

export type ComentarioEditalInsert = Omit<ComentarioEdital, 'id' | 'created_at' | 'updated_at'>
export type ComentarioEditalUpdate = Partial<Omit<ComentarioEdital, 'id' | 'created_at' | 'updated_at'>>
