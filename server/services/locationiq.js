const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY || 'YOUR_LOCATIONIQ_API_KEY';

export const reverseGeocodeServer = async (lat, lon) => {
  try {
    const key = (process.env.LOCATIONIQ_API_KEY && process.env.LOCATIONIQ_API_KEY !== 'YOUR_LOCATIONIQ_API_KEY')
      ? process.env.LOCATIONIQ_API_KEY
      : 'pk.87f2b73258797339613e6398d60d0e2e';
    const url = `https://us1.locationiq.com/v1/reverse?key=${key}&lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        return data.display_name;
      }
    }
    return `Location (${lat}, ${lon})`;
  } catch (err) {
    console.warn('LocationIQ server reverse geocode error:', err.message);
    return `Location (${lat}, ${lon})`;
  }
};

export const searchGeocodeServer = async (query) => {
  try {
    const key = (process.env.LOCATIONIQ_API_KEY && process.env.LOCATIONIQ_API_KEY !== 'YOUR_LOCATIONIQ_API_KEY')
      ? process.env.LOCATIONIQ_API_KEY
      : 'pk.87f2b73258797339613e6398d60d0e2e';
    const url = `https://us1.locationiq.com/v1/search?key=${key}&q=${encodeURIComponent(query)}&format=json&limit=5`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('LocationIQ server search geocode error:', err.message);
    return [];
  }
};

export const searchLocationServer = searchGeocodeServer;
