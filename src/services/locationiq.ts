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

export const reverseGeocodeLocationIQ = async (lat: number, lon: number): Promise<string> => {
  try {
    const key = LOCATIONIQ_API_KEY;
    if (!key || key === 'YOUR_LOCATIONIQ_API_KEY') {
      return `HSR Layout Sector 1, Bengaluru (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    }
    const res = await fetch(`https://us1.locationiq.com/v1/reverse?key=${key}&lat=${lat}&lon=${lon}&format=json`);
    if (!res.ok) {
      return `Sector 1, HSR Layout, Bengaluru (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    }
    const data: LocationIQResult = await res.json();
    if (data.display_name) {
      return data.display_name;
    }
    return `HSR Layout, Bengaluru (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
  } catch (err) {
    console.warn('LocationIQ Reverse Geocoding offline, using fallback:', err);
    return `Sector 1, HSR Layout, Bengaluru (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
  }
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
