// Shared types used across multiple screens

export type AppTab = 'orders' | 'earnings' | 'ratings' | 'profile' | 'delivery';

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
