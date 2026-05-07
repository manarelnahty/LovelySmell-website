import { Product, mockProducts } from './products';

const STORAGE_KEY = 'ls_admin_products';

export function getAdminProducts(): Product[] {
  if (typeof window === 'undefined') return mockProducts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved: Product[] = raw ? JSON.parse(raw) : [];
    // Merge: saved products override mock ones with same id
    const mockFiltered = mockProducts.filter(
      (m) => !saved.find((s) => s.id === m.id)
    );
    return [...saved, ...mockFiltered];
  } catch {
    return mockProducts;
  }
}

export function saveAdminProduct(product: Product): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved: Product[] = raw ? JSON.parse(raw) : [];
    const idx = saved.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      saved[idx] = product;
    } else {
      saved.unshift(product);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {}
}

export function deleteAdminProduct(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved: Product[] = raw ? JSON.parse(raw) : [];
    const filtered = saved.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {}
}

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
