import { supabase } from '@/lib/supabase'
import type { Product, ProductInsert, ProductUpdate } from '@/types/database'

export async function createProduct(product: ProductInsert): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProduct(id: string, updates: ProductUpdate): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) throw error
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function updateProductStock(id: string, quantity: number): Promise<Product> {
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('stock')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError

  const newStock = product.stock + quantity

  const { data, error } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
