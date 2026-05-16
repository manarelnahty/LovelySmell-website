'use server'

import { createClient } from '@/utils/supabase/server'
import { Product } from '@/lib/data/products'

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name_ar')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data
}

export async function getProducts(params: {
  category?: string | null
  query?: string | null
  isFeatured?: boolean
  isBestseller?: boolean
  limit?: number
  offset?: number
  minPrice?: number | null
  maxPrice?: number | null
} = {}) {
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories${params.category && params.category !== 'الكل' ? '!inner' : ''}(name_ar),
      images:product_images(image_url, is_primary),
      variations:product_variations(*)
    `, { count: 'exact' })
    .eq('is_active', true)

  // ... existing filter logic ...
  
  if (params.category && params.category !== 'الكل') {
    query = query.filter('categories.name_ar', 'eq', params.category)
  }

  if (params.query) {
    query = query.or(`name_ar.ilike.%${params.query}%,description_ar.ilike.%${params.query}%`)
  }

  if (params.minPrice) {
    query = query.gte('price', params.minPrice)
  }

  if (params.maxPrice) {
    query = query.lte('price', params.maxPrice)
  }

  if (params.isFeatured) {
    query = query.eq('is_bestseller', true)
  }

  if (params.isBestseller) {
    query = query.eq('is_bestseller', true)
  }

  // Apply limits and pagination
  if (params.limit) {
    const from = params.offset || 0
    const to = from + params.limit - 1
    query = query.range(from, to)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .returns<any[]>()

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], totalCount: 0 }
  }

  // Map database results to the Product interface
  const products = data.map((p: any) => ({
    id: p.id,
    name: p.name_ar,
    price: p.price ? parseFloat(p.price) : 0,
    stock: p.stock ?? 0,
    category: p.category 
      ? (Array.isArray(p.category) ? p.category.map((c: any) => c.name_ar) : [p.category.name_ar]) 
      : [],
    image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || '',
    description: p.description_ar || '',
    isFeatured: p.is_bestseller,
    isEditorial: p.is_editorial,
    isMonthPerfume: p.is_month_perfume,
    variations: p.variations?.map((v: any) => ({
      id: v.id,
      volume: v.volume,
      unit: v.unit,
      price: parseFloat(v.price),
      stock: v.stock
    })).sort((a: any, b: any) => a.volume - b.volume) || []
  })) as Product[]


  return { products, totalCount: count || 0 }
}

export async function getProductById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name_ar),
      images:product_images(*),
      variations:product_variations(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return {
    id: data.id,
    name: data.name_ar,
    price: data.price ? parseFloat(data.price) : 0,
    category: data.category 
      ? (Array.isArray(data.category) ? data.category.map((c: any) => c.name_ar) : [data.category.name_ar]) 
      : [],
    image: data.images?.find((img: any) => img.is_primary)?.image_url || data.images?.[0]?.image_url || '',
    description: data.description_ar || '',
    images: data.images?.map((img: any) => img.image_url) || [],
    stock: data.stock,
    top_notes: data.top_notes,
    heart_notes: data.heart_notes,
    base_notes: data.base_notes,
    isFeatured: data.is_bestseller,
    isEditorial: data.is_editorial,
    isMonthPerfume: data.is_month_perfume,
    variations: data.variations?.map((v: any) => ({
      id: v.id,
      volume: v.volume,
      unit: v.unit,
      price: parseFloat(v.price),
      stock: v.stock
    })).sort((a: any, b: any) => a.volume - b.volume) || []
  }
}
