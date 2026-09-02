export interface Product {
  id: string;
  name: string;
  shopId?: string;
  shopName?: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice: number;
  weight: string;
  image: string;
  images?: string[];
  discountPercentage: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  deliveryTimeMinutes: number;
  description: string;
  hasBuy2Offer?: boolean;
  buy2DiscountPercent?: number;
  buy2OfferLabel?: string;
  shelfLife?: string;
  origin?: string;
  storage?: string;
  nutrition?: {
    calories: string;
    carbs: string;
    protein: string;
    fat: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  iconImage: string;
  subCategories: string[];
}

export interface OrderTimelineStep {
  title: string;
  description: string;
  time: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  handlingFee: number;
  discountAmount: number;
  tipAmount: number;
  finalTotal: number;
  status: 'PLACED' | 'PACKING' | 'ON_THE_WAY' | 'DELIVERED';
  deliveryAddress: string;
  paymentMethod: string;
  deliveryInstruction?: string;
  otp?: string;
  estimatedDeliveryMinutes: number;
  timeline: OrderTimelineStep[];
  driverName?: string;
  driverPhone?: string;
  driverRating?: number;
  driverPhoto?: string;
}

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  flatNo: string;
  area: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  walletBalance: number;
  freshCoins: number;
  savedAddresses: SavedAddress[];
  isLoggedIn: boolean;
}

export interface DriverChatMessage {
  id: string;
  sender: 'driver' | 'user';
  text: string;
  time: string;
}

export type ActiveTab = 'home' | 'categories' | 'cart' | 'account' | 'category_detail' | 'track' | 'track_order' | 'order_confirmed' | 'login' | 'onboarding';
