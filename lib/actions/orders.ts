"use server";

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper to generate a random order token
function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Helper to generate a unique order number
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LS-${year}${month}-${randomStr}`;
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_governorate: string;
  customer_address: string;
  shipping_fee: number;
  total_amount: number;
  payment_method: string;
  items: {
    product_id: string;
    variation_id?: string | null;
    quantity: number;
    unit_price: number;
    volume?: number | null;
    unit?: string | null;
  }[];
}

export async function createOrder(payload: CreateOrderPayload) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return { success: false, error: "Unauthorized. You must be logged in to place an order." };
  }

  // 1. Validate Stock Before Proceeding
  for (const item of payload.items) {
    if (item.variation_id) {
      const { data: variation } = await supabase
        .from('product_variations')
        .select('stock')
        .eq('id', item.variation_id)
        .single();
        
      if (!variation || variation.stock < item.quantity) {
        return { success: false, error: `عذراً، الكمية المطلوبة من أحد المنتجات غير متوفرة في المخزون حالياً.` };
      }
    } else {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();
        
      if (!product || product.stock < item.quantity) {
        return { success: false, error: `عذراً، الكمية المطلوبة من أحد المنتجات غير متوفرة في المخزون حالياً.` };
      }
    }
  }

  const orderNumber = generateOrderNumber();

  // 2. Insert into orders table
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: session.user.id,
      order_number: orderNumber,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      customer_governorate: payload.customer_governorate,
      customer_address: payload.customer_address,
      shipping_fee: payload.shipping_fee,
      total_amount: payload.total_amount,
      payment_method: payload.payment_method,
      status: 'جديد' // Default status
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("Error creating order:", orderError);
    return { success: false, error: orderError?.message || "Failed to create order" };
  }

  // 3. Insert order items
  const orderItemsData = payload.items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    variation_id: item.variation_id || null,
    quantity: item.quantity,
    unit_price: item.unit_price,
    volume: item.volume || null,
    unit: item.unit || null
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData);

  if (itemsError) {
    console.error("Error creating order items:", itemsError);
    return { success: false, error: "Failed to create order items" };
  }

  // 4. Deduct Stock (Using secure RPC to bypass RLS restrictions)
  for (const item of payload.items) {
    const { data: success, error: rpcError } = await supabase.rpc('decrement_stock', {
      p_product_id: item.product_id,
      p_variation_id: item.variation_id || null,
      p_quantity: item.quantity
    });
    
    if (rpcError || !success) {
      console.error(`Failed to deduct stock for item ${item.product_id}:`, rpcError);
    }
  }

  // 5. Create tracking token
  const token = generateToken();
  const { error: tokenError } = await supabase
    .from('order_tokens')
    .insert({
      order_id: order.id,
      token: token,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

  if (tokenError) {
    console.error("Error creating order token:", tokenError);
  }

  // 6. Clear the user's DB cart upon successful checkout
  try {
    const { clearDbCart } = await import('@/lib/actions/cart');
    await clearDbCart();
  } catch (err) {
    console.error("Failed to clear DB cart post-checkout", err);
  }

  return { success: true, orderId: order.id, orderNumber: order.order_number, trackingToken: token };
}

export async function adminGetOrders() {
  const supabase = await createClient();
  
  // Fetch orders with their related items, products, and variations
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        volume,
        unit,
        variation_id,
        products (
          id,
          name_ar,
          product_images (
            image_url,
            is_primary
          )
        ),
        product_variations (
          id,
          volume,
          unit
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching admin orders:", error);
    return { success: false, data: [] };
  }

  // Map data to match expected shape
  const mappedData = data.map((order: any) => ({
    ...order,
    order_items: order.order_items?.map((item: any) => ({
      ...item,
      products: item.products ? {
        id: item.products.id,
        name: item.products.name_ar,
        name_en: item.products.name_ar,
        image: item.products.product_images?.find((img: any) => img.is_primary)?.image_url || item.products.product_images?.[0]?.image_url || ''
      } : null
    }))
  }));

  return { success: true, data: mappedData };
}

export async function adminUpdateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/orders');
  return { success: true };
}

export async function getOrderDetailsByToken(token: string) {
  const supabase = await createClient();
  
  // 1. Validate token
  const { data: tokenData, error: tokenError } = await supabase
    .from('order_tokens')
    .select('order_id, expires_at')
    .eq('token', token)
    .single();

  if (tokenError || !tokenData) {
    console.error("Token error:", tokenError);
    return { success: false, error: "Invalid tracking token" };
  }

  // 2. Fetch order details
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        volume,
        unit,
        products (
          id,
          name_ar,
          product_images (
            image_url,
            is_primary
          )
        )
      )
    `)
    .eq('id', tokenData.order_id)
    .single();

  if (orderError || !order) {
    console.error("Order error:", orderError);
    return { success: false, error: `Order error: ${orderError?.message || JSON.stringify(orderError)}` };
  }

  // Map data to match expected shape
  const mappedOrder = {
    ...order,
    order_items: order.order_items?.map((item: any) => ({
      ...item,
      products: item.products ? {
        id: item.products.id,
        name: item.products.name_ar,
        image: item.products.product_images?.find((img: any) => img.is_primary)?.image_url || item.products.product_images?.[0]?.image_url || ''
      } : null
    }))
  };

  return { success: true, data: mappedOrder };
}

export async function getUserOrders() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        volume,
        unit,
        variation_id,
        products (
          id,
          name_ar,
          product_images (
            image_url,
            is_primary
          )
        )
      )
    `)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching user orders:", error);
    return { success: false, data: [] };
  }

  const mappedData = data.map((order: any) => ({
    ...order,
    order_items: order.order_items?.map((item: any) => ({
      ...item,
      products: item.products ? {
        id: item.products.id,
        name: item.products.name_ar,
        image: item.products.product_images?.find((img: any) => img.is_primary)?.image_url || item.products.product_images?.[0]?.image_url || ''
      } : null
    }))
  }));

  return { success: true, data: mappedData };
}

export async function trackOrder(orderNumber: string, phone: string) {
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        volume,
        unit,
        variation_id,
        products (
          id,
          name_ar,
          product_images (
            image_url,
            is_primary
          )
        )
      )
    `)
    .eq('order_number', orderNumber)
    .eq('customer_phone', phone)
    .single();

  if (error || !order) {
    console.error("Order tracking error:", error);
    return { success: false, error: "لم يتم العثور على طلب بهذا الرقم. تأكد من الرقم وحاول مرة أخرى." };
  }

  // Map to the shape expected by tracking page
  let status = 'placed';
  if (order.status === 'جاري التحضير') status = 'preparing';
  else if (order.status === 'في الطريق') status = 'shipped';
  else if (order.status === 'مكتمل' || order.status === 'تم التسليم') status = 'delivered';

  const mappedOrder = {
    orderNumber: order.order_number,
    date: new Date(order.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
    total: `${order.total_amount.toLocaleString('ar-EG')} ج.م`,
    payment: order.payment_method,
    status: status,
    address: order.customer_address,
    items: order.order_items?.map((item: any) => ({
      name: item.products?.name_ar || 'عطر غير معروف',
      qty: `${item.quantity} × ${item.volume ? item.volume + item.unit : ''}`.trim()
    })) || []
  };

  return { success: true, data: mappedOrder };
}
