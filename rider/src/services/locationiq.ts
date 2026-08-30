export const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY || 'YOUR_LOCATIONIQ_API_KEY';

export interface RiderLocationUpdate {
  riderId: string;
  riderName: string;
  phone?: string;
  vehicleNumber?: string;
  lat: number;
  lon: number;
  speed?: number;
  status?: string;
  orderId?: string;
}

export const reverseGeocodeLocationIQ = async (lat: number, lon: number): Promise<string> => {
  try {
    const key = LOCATIONIQ_API_KEY;
    if (!key || key === 'YOUR_LOCATIONIQ_API_KEY') {
      return `HSR Layout Sector 1, Bengaluru (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    }
    const res = await fetch(`https://us1.locationiq.com/v1/reverse?key=${key}&lat=${lat}&lon=${lon}&format=json`);
    if (!res.ok) return `Sector 1, HSR Layout, Bengaluru (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    const data = await res.json();
    return data.display_name || `HSR Layout, Bengaluru (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
  } catch {
    return `Sector 1, HSR Layout, Bengaluru (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
  }
};

const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE = import.meta.env.VITE_API_BASE_URL || (hostname === 'localhost' ? 'http://localhost:4000/api' : 'https://cartcraze-95gt.onrender.com/api');

export const pushRiderLocationApi = async (update: RiderLocationUpdate): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/locationiq/update-rider-location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    return res.ok;
  } catch {
    return false;
  }
};
