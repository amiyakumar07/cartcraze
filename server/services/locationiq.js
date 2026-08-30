const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY || 'YOUR_LOCATIONIQ_API_KEY';

export const reverseGeocodeServer = async (lat, lon) => {
  try {
    if (!LOCATIONIQ_API_KEY || LOCATIONIQ_API_KEY === 'YOUR_LOCATIONIQ_API_KEY') {
      return `HSR Layout Sector 1, Bengaluru (${lat}, ${lon})`;
    }
    const url = `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url);
    if (!res.ok) {
      return `Sector 1, HSR Layout, Bengaluru (${lat}, ${lon})`;
    }
    const data = await res.json();
    return data.display_name || `HSR Layout, Bengaluru (${lat}, ${lon})`;
  } catch (err) {
    console.warn('LocationIQ server reverse geocode error:', err.message);
    return `Sector 1, HSR Layout, Bengaluru (${lat}, ${lon})`;
  }
};

export const searchGeocodeServer = async (query) => {
  try {
    if (!LOCATIONIQ_API_KEY || LOCATIONIQ_API_KEY === 'YOUR_LOCATIONIQ_API_KEY') {
      return [{ place_id: '1', lat: '12.9141', lon: '77.6411', display_name: `${query}, HSR Layout, Bengaluru` }];
    }
    const url = `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(query)}&format=json&limit=5`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('LocationIQ server search geocode error:', err.message);
    return [];
  }
};
