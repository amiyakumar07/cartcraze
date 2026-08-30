export interface OrderItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  quantity: number;
  image: string;
  picked?: boolean;
}

export type OrderStatus = 'NEW' | 'PACKING' | 'READY' | 'DISPATCHED' | 'DELIVERED';

export interface StoreOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  itemTotal: number;
  deliveryFee: number;
  finalTotal: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'COD';
  status: OrderStatus;
  orderTime: string;
  estimatedPackingTime: string;
  assignedRider?: {
    id: string;
    name: string;
    phone: string;
    photo: string;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  weight: string;
  stockCount: number;
  inStock: boolean;
  image: string;
  barcode: string;
  shelfLocation: string;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  rating: number;
  status: 'AVAILABLE' | 'DELIVERING' | 'OFFLINE';
  deliveriesToday: number;
  currentOrderId?: string;
  photo: string;
}

export type ShopActiveTab = 'orders' | 'inventory' | 'riders' | 'analytics' | 'settings';
