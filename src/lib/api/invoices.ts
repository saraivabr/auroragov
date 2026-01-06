import { supabase } from '@/lib/supabase'
import type { Invoice, InvoiceInsert, InvoiceUpdate } from '@/types/database'

export async function createInvoice(invoice: InvoiceInsert): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .insert(invoice)
    .select()
    .single()

  if (error) throw error
  return data as Invoice
}

export async function updateInvoice(id: string, updates: InvoiceUpdate): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Invoice
}

export async function deleteInvoice(id: string): Promise<void> {
  const { error } = await supabase.from('invoices').delete().eq('id', id)

  if (error) throw error
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data as Invoice | null
}

export async function bulkDeleteInvoices(ids: string[]): Promise<void> {
  const { error } = await supabase.from('invoices').delete().in('id', ids)

  if (error) throw error
}
