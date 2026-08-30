export const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY || 'YOUR_LOCATIONIQ_API_KEY';

export interface LiveRider {
  riderId: string;
  riderName: string;
  phone: string;
  vehicleNumber: string;
  lat: number;
  lon: number;
  speed: number;
  status: string;
  orderId?: string;
  batteryLevel?: number;
  updatedAt: string;
}

const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE = `http://${hostname}:4000/api`;

export const fetchLiveRidersApi = async (): Promise<LiveRider[]> => {
  try {
    const res = await fetch(`${API_BASE}/locationiq/all-riders`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.riders || [];
  } catch {
    return [];
  }
};

export const triggerSimulateMovementApi = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/locationiq/simulate-movement`, { method: 'POST' });
    return res.ok;
  } catch {
    return false;
  }
};
