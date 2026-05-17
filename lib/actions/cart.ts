'use server'

import { createClient } from '@/utils/supabase/server'
import { CartItem } from '@/lib/context/CartContext'

export async function getDbCart(): Promise<CartItem[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  // Fetch cart items joined with products, variations, and images
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products (
        *,
        category:categories(name_ar),
        images:product_images(image_url, is_primary),
        variations:product_variations(*)
      )
    `)
    .eq('user_id', user.id)

  if (error || !data) {
    console.error('Error fetching DB cart:', error)
    return []
  }

  // Map to local CartItem structure
  return data.map((item: any) => {
    const p = item.product
    return {
      quantity: item.quantity,
      variationId: item.variation_id,
      product: {
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
      }
    }
  })
}

export async function syncLocalCartToDb(localItems: CartItem[]): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || localItems.length === 0) return

  // Merge items into DB. We do this by inserting, if conflict, we update quantity.
  // Wait, cart_items doesn't have a unique constraint on (user_id, product_id, variation_id).
  // We need to fetch existing cart items first to manually merge.
  
  const { data: existingItems } = await supabase
    .from('cart_items')
    .select('id, product_id, variation_id, quantity')
    .eq('user_id', user.id)

  const toInsert = []
  const toUpdate = []

  for (const local of localItems) {
    const existing = existingItems?.find(e => 
      e.product_id === local.product.id && 
      (e.variation_id === local.variationId || (!e.variation_id && !local.variationId))
    )

    if (existing) {
      toUpdate.push({
        id: existing.id,
        quantity: existing.quantity + local.quantity
      })
    } else {
      toInsert.push({
        user_id: user.id,
        product_id: local.product.id,
        variation_id: local.variationId || null,
        quantity: local.quantity
      })
    }
  }

  if (toInsert.length > 0) {
    await supabase.from('cart_items').insert(toInsert)
  }

  for (const item of toUpdate) {
    await supabase.from('cart_items').update({ quantity: item.quantity }).eq('id', item.id)
  }
}

export async function updateDbCartItem(productId: string, quantity: number, variationId?: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  // Check if item exists
  let query = supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)

  if (variationId) {
    query = query.eq('variation_id', variationId)
  } else {
    query = query.is('variation_id', null)
  }

  const { data: existing } = await query.single()

  if (existing) {
    await supabase
      .from('cart_items')
      .update({ quantity: quantity })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        product_id: productId,
        variation_id: variationId || null,
        quantity: quantity
      })
  }
}

export async function removeDbCartItem(productId: string, variationId?: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  let query = supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId)

  if (variationId) {
    query = query.eq('variation_id', variationId)
  } else {
    query = query.is('variation_id', null)
  }

  await query
}

export async function clearDbCart(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)
}
