const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY || 'pk.77659b64212a8f223301cab1faf0a37a';

export const reverseGeocodeServer = async (lat, lon) => {
  try {
    const url = `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('LocationIQ reverse geocode failed');
    const data = await res.json();
    return {
      success: true,
      address: data.display_name,
      details: data.address
    };
  } catch (error) {
    return {
      success: false,
      address: `Lat ${lat}, Lon ${lon} (HSR Layout, Bengaluru)`,
      error: error.message
    };
  }
};

export const searchLocationServer = async (query) => {
  try {
    const url = `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(query)}&format=json&limit=5`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('LocationIQ search failed');
    const data = await res.json();
    return {
      success: true,
      results: data.map(item => ({
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        placeId: item.place_id
      }))
    };
  } catch (error) {
    return {
      success: false,
      results: [],
      error: error.message
    };
  }
};
