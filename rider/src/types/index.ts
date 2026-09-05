export type DutyStatus = 'ON_DUTY' | 'OFF_DUTY';
export type AppTab = 'orders' | 'earnings' | 'ratings' | 'profile' | 'delivery';
export type DeliveryStep = 'PICKUP' | 'DELIVERING' | 'DONE';
export type RiderStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'BLOCKED';
export type PaymentMethod = 'UPI' | 'COD' | 'CARD';
export type PaymentStatus = 'PAID' | 'UNPAID';

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
  customerLat: number;
  customerLon: number;
  pincode: string;
  village: string;
  street: string;
  landmark: string;
  restaurantName: string;
  restaurantAddress: string;
  itemsCount: number;
  payoutAmount: number;
  finalTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  otp: string;
  estimatedTime: string;
  status: string;
  items: OrderItem[];
}

export interface RiderProfile {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  rating: number;
  totalDeliveries: number;
  todayDeliveries: number;
  todayEarnings: number;
  isLoggedIn: boolean;
  photo: string;
}

export interface RiderApprovalData {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleNumber: string;
  drivingLicenseProof: string;
  idProofType: string;
  idProofNumber: string;
  idProofProof: string;
  lat: number;
  lon: number;
  status: RiderStatus;
  createdAt?: string;
}

export interface LocationCoords {
  lat: number;
  lon: number;
  address: string;
}

export interface EarningsBreakdown {
  day: string;
  amount: number;
  deliveries: number;
  isToday?: boolean;
}

export interface RatingBreakdown {
  stars: number;
  percentage: number;
  count: number;
}

export interface CustomerReview {
  id: string;
  rating: number;
  comment: string;
  date: string;
  tags: string[];
  customerName: string;
}

export interface PerformanceBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose';
}


export interface RiderLocationUpdate {
  riderId: string;
  riderName: string;
  phone?: string;
  vehicleNumber?: string;
  lat: number;
  lon: number;
  speed?: number;
  heading?: number;
  battery?: number;
  status?: string;
  orderId?: string;
}
