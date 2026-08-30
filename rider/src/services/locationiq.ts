export const LOCATIONIQ_API_KEY = 'pk.77659b64212a8f223301cab1faf0a37a';
const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const SERVER_URL = `http://${hostname}:4000/api`;

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
      address: `HSR Layout, Bengaluru (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
      lat,
      lon
    };
  }
};

export interface TelemetryData {
  riderId: string;
  riderName: string;
  phone?: string;
  vehicleNumber?: string;
  lat: number;
  lon: number;
  heading?: number;
  speed?: number;
  battery?: number;
  status?: string;
  orderId?: string;
  darkstoreLat?: number;
  darkstoreLon?: number;
  customerLat?: number;
  customerLon?: number;
}

export const pushRiderLocationApi = async (data: TelemetryData) => {
  try {
    const res = await fetch(`${SERVER_URL}/locationiq/update-rider-location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        riderId: data.riderId || 'rider-001',
        riderName: data.riderName || 'Alex Mercer',
        phone: data.phone || '+91 98765 11111',
        vehicleNumber: data.vehicleNumber || 'KA-05-EV-4829',
        lat: data.lat,
        lon: data.lon,
        heading: data.heading ?? 45,
        speed: data.speed ?? 32,
        battery: data.battery ?? 88,
        status: data.status || 'EN_ROUTE',
        orderId: data.orderId || 'QM-849201',
        darkstoreLat: data.darkstoreLat ?? 12.9100,
        darkstoreLon: data.darkstoreLon ?? 77.6400,
        customerLat: data.customerLat ?? 12.9250,
        customerLon: data.customerLon ?? 77.6500
      })
    });
    return await res.json();
  } catch (err) {
    console.warn('LocationIQ Telemetry Push Error:', err);
    return null;
  }
};

export const triggerSimulateMovementApi = async (riderId: string = 'rider-001', stepPercent: number = 5) => {
  try {
    const res = await fetch(`${SERVER_URL}/locationiq/simulate-movement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ riderId, stepPercent })
    });
    return await res.json();
  } catch (err) {
    console.warn('LocationIQ Movement Simulation Error:', err);
    return null;
  }
};
