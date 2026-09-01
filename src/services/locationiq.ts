export const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY || 'YOUR_LOCATIONIQ_API_KEY';

export interface LocationIQResult {
  place_id: string;
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

export type LocationSearchResult = LocationIQResult;

export interface LiveRiderLocation {
  riderId: string;
  riderName: string;
  lat: number;
  lon: number;
  speed: number;
  status: string;
  orderId?: string;
  updatedAt: string;
  battery?: number;
  distanceRemainingKm?: number;
  etaMinutes?: number;
}

const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE = import.meta.env.VITE_API_BASE_URL || (hostname === 'localhost' ? 'http://localhost:4000/api' : 'https://cartcraze-95gt.onrender.com/api');

export const fetchOrderLocationApi = async (orderId?: string): Promise<LiveRiderLocation | null> => {
  try {
    const url = orderId ? `${API_BASE}/locationiq/rider-location?orderId=${orderId}` : `${API_BASE}/locationiq/rider-location`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.location || null;
  } catch {
    return null;
  }
};

export interface DetailedLocationIQResult {
  success: boolean;
  postcode: string;
  pincode: string;
  village: string;
  suburb: string;
  street: string;
  road: string;
  houseNumber: string;
  landmark: string;
  city: string;
  state: string;
  displayName: string;
  display_name: string;
  fullAddress: string;
  lat: number;
  lon: number;
}

export const reverseGeocodeLocationIQ = async (lat: number, lon: number): Promise<string> => {
  const detailed = await reverseGeocodeDetailedLocationIQ(lat, lon);
  return detailed.displayName;
};

export const reverseGeocodeDetailedLocationIQ = async (lat: number, lon: number): Promise<DetailedLocationIQResult> => {
  try {
    const key = LOCATIONIQ_API_KEY && LOCATIONIQ_API_KEY !== 'YOUR_LOCATIONIQ_API_KEY'
      ? LOCATIONIQ_API_KEY
      : 'pk.87f2b73258797339613e6398d60d0e2e';
    const res = await fetch(`https://us1.locationiq.com/v1/reverse?key=${key}&lat=${lat}&lon=${lon}&format=json`);
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const pincode = addr.postcode || (data.display_name?.match(/\b\d{6}\b/)?.[0] || '751002');
      const village = addr.village || addr.suburb || addr.neighbourhood || addr.city_district || addr.town || addr.city || 'Old Town';
      const streetParts = [addr.house_number, addr.road || addr.street || addr.pedestrian || addr.footway].filter(Boolean).join(', ');
      const street = streetParts || (data.display_name ? data.display_name.split(',')[0] : 'Main Street');
      const city = addr.city || addr.town || addr.municipality || 'Bhubaneswar';
      const state = addr.state || 'Odisha';
      const landmark = addr.landmark || addr.suburb || addr.county || state;
      const displayName = data.display_name || `${street}, ${village}, ${city}, ${state} ${pincode}`;

      return {
        success: true,
        postcode: pincode,
        pincode: pincode,
        village: village,
        suburb: village,
        street: street,
        road: street,
        houseNumber: addr.house_number || '',
        landmark: landmark,
        city: city,
        state: state,
        displayName: displayName,
        display_name: displayName,
        fullAddress: displayName,
        lat,
        lon
      };
    }
  } catch (err) {
    console.warn('Detailed LocationIQ reverse geocode error:', err);
  }

  return {
    success: false,
    postcode: '751002',
    pincode: '751002',
    village: 'Old Town',
    suburb: 'Old Town',
    street: 'Main Road',
    road: 'Main Road',
    houseNumber: '',
    landmark: 'Near Temple',
    city: 'Bhubaneswar',
    state: 'Odisha',
    displayName: `Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
    display_name: `Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
    fullAddress: `Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
    lat,
    lon
  };
};

export const searchLocationIQ = async (query: string): Promise<LocationIQResult[]> => {
  if (!query || query.trim().length < 2) return [];
  try {
    const key = LOCATIONIQ_API_KEY;
    if (!key || key === 'YOUR_LOCATIONIQ_API_KEY') {
      return [
        {
          place_id: '1',
          lat: '12.9141',
          lon: '77.6411',
          display_name: `${query}, Sector 1, HSR Layout, Bengaluru, Karnataka 560102`
        }
      ];
    }
    const res = await fetch(`https://us1.locationiq.com/v1/search?key=${key}&q=${encodeURIComponent(query)}&format=json&limit=5`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('LocationIQ Search query failed:', err);
    return [];
  }
};

export const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export const calculateExpressSLA = (distanceKm: number): number => {
  if (distanceKm <= 1.5) return 9;
  if (distanceKm <= 3.0) return 12;
  if (distanceKm <= 5.0) return 15;
  return 19;
};

export const getLocationIQTileUrl = (token: string = LOCATIONIQ_API_KEY) => {
  return `https://a-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${token}`;
};
