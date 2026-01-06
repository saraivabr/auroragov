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
