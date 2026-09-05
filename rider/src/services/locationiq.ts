import { LOCATIONIQ_API_KEY, API_BASE } from '../config/api';
import type { RiderLocationUpdate } from '../types';

export const reverseGeocodeLocationIQ = async (lat: number, lon: number): Promise<string> => {
  try {
    if (!LOCATIONIQ_API_KEY) {
      return `HSR Layout Sector 1, Bengaluru (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    }
    const res = await fetch(`https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`);
    if (!res.ok) return `Sector 1, HSR Layout, Bengaluru`;
    const data = await res.json();
    return data.display_name || `HSR Layout, Bengaluru`;
  } catch {
    return `Sector 1, HSR Layout, Bengaluru (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
  }
};

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
