export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface RiderOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  customerLat?: number;
  customerLon?: number;
  pincode?: string;
  village?: string;
  street?: string;
  landmark?: string;
  items: OrderItem[];
  finalTotal?: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  orderTime?: string;
  otp?: string;
  restaurantName?: string;
  restaurantAddress?: string;
  itemsCount?: number;
  payoutAmount?: number;
  estimatedTime?: string;
}

export type DutyStatus = 'ON_DUTY' | 'OFF_DUTY';
