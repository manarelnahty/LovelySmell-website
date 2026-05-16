'use server';

import { createClient } from '@/utils/supabase/server';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdminProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

export interface AdminProduct {
  id: string;
  name_ar: string;
  slug: string;
  description_ar: string | null;
  price: number;
  stock: number;
  is_active: boolean;
  is_bestseller: boolean;
  is_editorial: boolean;
  is_month_perfume: boolean;
  top_notes: string | null;
  heart_notes: string | null;
  base_notes: string | null;
  category_id: string | null;
  category_name: string | null;
  image_url: string | null;          // primary image
  images: AdminProductImage[];
}

export type AdminProductUpdate = Partial<Omit<AdminProduct, 'id' | 'images' | 'category_name' | 'image_url'>>;

// ─── READ ─────────────────────────────────────────────────────────────────────

export async function adminGetProducts(): Promise<AdminProduct[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name_ar,
      slug,
      description_ar,
      price,
      stock,
      is_active,
      is_bestseller,
      is_editorial,
      is_month_perfume,
      top_notes,
      heart_notes,
      base_notes,
      category_id,
      category:categories(name_ar),
      images:product_images(id, image_url, is_primary, display_order)
    `)
    .order('created_at', { ascending: false })
    .returns<any[]>();

  if (error) {
    console.error('[adminGetProducts]', error);
    return [];
  }

  return data.map((p): AdminProduct => ({
    id: p.id,
    name_ar: p.name_ar,
    slug: p.slug ?? '',
    description_ar: p.description_ar,
    price: parseFloat(p.price),
    stock: p.stock ?? 0,
    is_active: p.is_active ?? true,
    is_bestseller: p.is_bestseller ?? false,
    is_editorial: p.is_editorial ?? false,
    is_month_perfume: p.is_month_perfume ?? false,
    top_notes: p.top_notes,
    heart_notes: p.heart_notes,
    base_notes: p.base_notes,
    category_id: p.category_id,
    category_name: p.category?.name_ar ?? null,
    image_url:
      p.images?.find((img: AdminProductImage) => img.is_primary)?.image_url ??
      p.images?.[0]?.image_url ??
      null,
    images: (p.images ?? []).sort(
      (a: AdminProductImage, b: AdminProductImage) => a.display_order - b.display_order,
    ),
  }));
}

export async function adminGetProductCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });

  if (error) {
    console.error('[adminGetProductCount]', error);
    return 0;
  }
  return count ?? 0;
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export async function adminUpdateProduct(
  id: string,
  updates: AdminProductUpdate,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Strip out any undefined / read-only fields
  const payload: Record<string, unknown> = {};
  const allowed: (keyof AdminProductUpdate)[] = [
    'name_ar', 'slug', 'description_ar', 'price', 'stock',
    'is_active', 'is_bestseller', 'is_editorial', 'is_month_perfume',
    'top_notes', 'heart_notes', 'base_notes', 'category_id',
  ];
  for (const key of allowed) {
    if (updates[key] !== undefined) {
      payload[key] = updates[key];
    }
  }

  const { error } = await supabase.from('products').update(payload).eq('id', id);

  if (error) {
    console.error('[adminUpdateProduct]', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

// ─── CREATE ───────────────────────────────────────────────────────────────────

export interface AdminProductCreate {
  name_ar: string;
  description_ar?: string | null;
  price: number;
  stock?: number;
  category_id?: string | null;
  is_active?: boolean;
  is_bestseller?: boolean;
  is_editorial?: boolean;
  is_month_perfume?: boolean;
  image_url?: string | null;
}

export async function adminCreateProduct(
  data: AdminProductCreate,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = await createClient();

  // Generate a URL-safe slug from name + timestamp to guarantee uniqueness
  const slugBase = data.name_ar
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FF\w-]/g, '')
    .toLowerCase()
    .slice(0, 60);
  const slug = `${slugBase}-${Date.now()}`;

  const { data: inserted, error } = await supabase
    .from('products')
    .insert({
      name_ar: data.name_ar,
      slug,
      description_ar: data.description_ar ?? null,
      price: data.price,
      stock: data.stock ?? 0,
      category_id: data.category_id ?? null,
      is_active: data.is_active ?? true,
      is_bestseller: data.is_bestseller ?? false,
      is_editorial: data.is_editorial ?? false,
      is_month_perfume: data.is_month_perfume ?? false,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[adminCreateProduct]', error);
    return { success: false, error: error.message };
  }

  const newId = inserted.id as string;

  // Insert primary image into product_images if provided
  if (data.image_url) {
    const { error: imgError } = await supabase.from('product_images').insert({
      product_id: newId,
      image_url: data.image_url,
      is_primary: true,
      display_order: 0,
    });
    if (imgError) {
      console.error('[adminCreateProduct] image insert', imgError);
      // Non-fatal — product was created, just log
    }
  }

  return { success: true, id: newId };
}


// ─── UPDATE PRIMARY IMAGE URL ─────────────────────────────────────────────────

export async function adminUpdateProductImage(
  productId: string,
  imageUrl: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Check if a primary image row already exists for this product
  const { data: existing } = await supabase
    .from('product_images')
    .select('id')
    .eq('product_id', productId)
    .eq('is_primary', true)
    .maybeSingle();

  if (existing) {
    // Update the existing primary image row
    const { error } = await supabase
      .from('product_images')
      .update({ image_url: imageUrl })
      .eq('id', existing.id);

    if (error) {
      console.error('[adminUpdateProductImage] update', error);
      return { success: false, error: error.message };
    }
  } else {
    // Upsert: insert a new primary image row
    const { error } = await supabase.from('product_images').insert({
      product_id: productId,
      image_url: imageUrl,
      is_primary: true,
      display_order: 0,
    });

    if (error) {
      console.error('[adminUpdateProductImage] insert', error);
      return { success: false, error: error.message };
    }
  }

  return { success: true };
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

/**
 * Soft-delete: marks the product as inactive (is_active = false).
 * This preserves referential integrity with order_items, cart_items, etc.
 */
export async function adminDeleteProduct(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('[adminDeleteProduct]', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function adminRestoreProduct(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .update({ is_active: true })
    .eq('id', id);

  if (error) {
    console.error('[adminRestoreProduct]', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}


// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export interface AdminCategory {
  id: string;
  name_ar: string;
  slug: string;
}

export async function adminGetCategories(): Promise<AdminCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id, name_ar, slug')
    .order('name_ar');

  if (error) {
    console.error('[adminGetCategories]', error);
    return [];
  }
  return data as AdminCategory[];
}
