export const LOCATIONIQ_API_KEY = 'pk.77659b64212a8f223301cab1faf0a37a';

export interface GeocodeResult {
  success: boolean;
  address: string;
  lat: number;
  lon: number;
}

export const reverseGeocodeLocationIQ = async (lat: number, lon: number): Promise<GeocodeResult> => {
  try {
    const res = await fetch(`https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`);
    if (!res.ok) throw new Error('LocationIQ reverse failed');
    const data = await res.json();
    return {
      success: true,
      address: data.display_name || `Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)}`,
      lat,
      lon
    };
  } catch {
    return {
      success: false,
      address: `Darkstore DS-14, HSR Layout, Sector 1, Bengaluru`,
      lat,
      lon
    };
  }
};

const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const SERVER_URL = `http://${hostname}:4000/api`;

export interface LiveRiderLocation {
  riderId: string;
  riderName: string;
  phone?: string;
  vehicleNumber?: string;
  lat: number;
  lon: number;
  heading?: number;
  speed?: number;
  battery?: number;
  status: string;
  orderId?: string;
  darkstoreLat?: number;
  darkstoreLon?: number;
  customerLat?: number;
  customerLon?: number;
  distanceRemainingKm?: number;
  etaMinutes?: number;
}

export const fetchLiveRidersApi = async (): Promise<LiveRiderLocation[]> => {
  try {
    const res = await fetch(`${SERVER_URL}/locationiq/live-riders`);
    if (!res.ok) throw new Error('Failed to fetch live riders');
    const data = await res.json();
    return data.riders || [];
  } catch (err) {
    console.warn('LocationIQ Live Riders Fetch Error:', err);
    return [];
  }
};

export const fetchOrderLocationApi = async (orderId: string): Promise<LiveRiderLocation | null> => {
  try {
    const res = await fetch(`${SERVER_URL}/locationiq/order-location/${orderId}`);
    if (!res.ok) throw new Error('Failed to fetch order location');
    const data = await res.json();
    return data.location || null;
  } catch (err) {
    console.warn('LocationIQ Order Location Fetch Error:', err);
    return null;
  }
};
