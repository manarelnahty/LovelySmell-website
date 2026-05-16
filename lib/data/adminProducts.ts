// NOTE: Product CRUD is handled by Supabase server actions in lib/actions/adminProducts.ts
// This file only retains Order-related helpers (still localStorage-based).
export type OrderStatus = 'جديد' | 'قيد التجهيز' | 'تم الشحن' | 'تم التسليم' | 'ملغي';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  grandTotal: number;
  paymentMethod: 'cod' | 'card';
  status: OrderStatus;
}

const ORDERS_KEY = 'ls_admin_orders';

export function getAdminOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): void {
  if (typeof window === 'undefined') return;
  try {
    const orders = getAdminOrders();
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {}
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  if (typeof window === 'undefined') return;
  try {
    const orders = getAdminOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx >= 0) {
      orders[idx].status = status;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  } catch {}
}
