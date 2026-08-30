export const LOCATIONIQ_API_KEY = 'pk.77659b64212a8f223301cab1faf0a37a';

export interface LocationSearchResult {
  displayName: string;
  lat: number;
  lon: number;
  placeId: string;
}

export interface GeocodeResult {
  success: boolean;
  address: string;
  lat: number;
  lon: number;
  postcode?: string;
  suburb?: string;
  village?: string;
  neighbourhood?: string;
  road?: string;
  houseNumber?: string;
  city?: string;
  displayName?: string;
}

// Reverse Geocode: Lat/Lon -> Detailed Address
export const reverseGeocodeLocationIQ = async (lat: number, lon: number): Promise<GeocodeResult> => {
  try {
    const res = await fetch(`https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`);
    if (!res.ok) throw new Error('LocationIQ reverse failed');
    const data = await res.json();
    const addr = data.address || {};

    const postcode = addr.postcode || addr.postal_code || '';
    const suburb = addr.suburb || addr.subdistrict || addr.district || addr.county || '';
    const village = addr.village || addr.neighbourhood || addr.residential || addr.suburb || addr.hamlet || '';
    const road = addr.road || addr.street || addr.pedestrian || addr.footway || addr.path || '';
    const houseNumber = addr.house_number || addr.building || addr.house || '';
    const city = addr.city || addr.town || addr.municipality || addr.state_district || '';

    return {
      success: true,
      address: data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      lat,
      lon,
      postcode,
      suburb,
      village,
      neighbourhood: addr.neighbourhood || suburb,
      road,
      houseNumber,
      city,
      displayName: data.display_name
    };
  } catch (err: any) {
    return {
      success: false,
      address: `GPS Pin (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
      lat,
      lon
    };
  }
};

// Address Search Autocomplete
export const searchLocationIQ = async (query: string): Promise<LocationSearchResult[]> => {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(`https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(query)}&format=json&limit=5`);
    if (!res.ok) throw new Error('LocationIQ search failed');
    const data = await res.json();
    return data.map((item: any) => ({
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      placeId: item.place_id
    }));
  } catch {
    return [
      { displayName: `${query}, HSR Layout, Bengaluru`, lat: 12.9141, lon: 77.6411, placeId: 'fallback-1' },
      { displayName: `${query}, Koramangala 5th Block, Bengaluru`, lat: 12.9344, lon: 77.6101, placeId: 'fallback-2' }
    ];
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
  lastUpdated?: string;
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

// LocationIQ Tile Layer URL Template
export const getLocationIQTileUrl = (token: string = LOCATIONIQ_API_KEY) => {
  return `https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${token}`;
};
