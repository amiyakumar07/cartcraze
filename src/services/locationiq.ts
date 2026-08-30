export const LOCATIONIQ_API_KEY = 'pk.a283b8bfa98234857b649d0124376c88';

export interface LocationSearchResult {
  placeId: string;
  displayName: string;
  lat: number;
  lon: number;
}

export interface LiveRiderLocation {
  lat: number;
  lon: number;
  speed: number;
  riderName: string;
  phone: string;
  distanceRemainingKm: number;
  etaMinutes: number;
}

export const searchLocationIQ = async (query: string): Promise<LocationSearchResult[]> => {
  if (!query.trim()) return [];
  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
        query
      )}&format=json`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((item: any) => ({
      placeId: item.place_id,
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error('LocationIQ search error:', error);
    return [];
  }
};

export const reverseGeocodeLocationIQ = async (
  lat: number,
  lon: number
): Promise<{
  address: string;
  postcode?: string;
  suburb?: string;
  village?: string;
  road?: string;
  houseNumber?: string;
  city?: string;
  displayName?: string;
}> => {
  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`
    );
    if (!response.ok) return { address: `GPS Pin (${lat.toFixed(4)}, ${lon.toFixed(4)})` };
    const data = await response.json();
    const addr = data.address || {};

    return {
      address: data.display_name || `GPS Pin (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
      postcode: addr.postcode || addr.postal_code || '',
      suburb: addr.suburb || addr.subdistrict || addr.district || addr.county || '',
      village: addr.village || addr.neighbourhood || addr.residential || addr.suburb || '',
      road: addr.road || addr.street || addr.pedestrian || addr.footway || '',
      houseNumber: addr.house_number || addr.building || '',
      city: addr.city || addr.town || addr.municipality || '',
      displayName: data.display_name
    };
  } catch (error) {
    console.error('LocationIQ reverse geocode error:', error);
    return { address: `GPS Pin (${lat.toFixed(4)}, ${lon.toFixed(4)})` };
  }
};

export const fetchOrderLocationApi = async (orderId: string): Promise<LiveRiderLocation | null> => {
  try {
    const res = await fetch(`http://localhost:4000/api/orders/${orderId}/location`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};
