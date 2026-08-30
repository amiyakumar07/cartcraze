export const LOCATIONIQ_API_KEY = 'pk.77659b64212a8f223301cab1faf0a37a';
const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const SERVER_URL = `http://${hostname}:4000/api`;

export interface LiveRider {
  riderId: string;
  riderName: string;
  phone?: string;
  vehicleNumber?: string;
  lat: number;
  lon: number;
  heading?: number;
  speed?: number;
  battery?: number;
  lastUpdated: string;
  status: string;
  orderId?: string;
  distanceRemainingKm?: number;
  etaMinutes?: number;
}

export const fetchLiveRidersApi = async (): Promise<LiveRider[]> => {
  try {
    const res = await fetch(`${SERVER_URL}/locationiq/live-riders`);
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();
    return data.riders || [];
  } catch {
    return [
      { riderId: 'rider-001', riderName: 'Alex Mercer', phone: '+91 98765 11111', vehicleNumber: 'KA-05-EV-4829', lat: 12.9150, lon: 77.6430, speed: 32, battery: 88, lastUpdated: new Date().toISOString(), status: 'EN_ROUTE', orderId: 'QM-849201' },
      { riderId: 'rider-002', riderName: 'Rahul Kumar', phone: '+91 98765 22222', vehicleNumber: 'KA-01-MH-9901', lat: 12.9340, lon: 77.6210, speed: 28, battery: 94, lastUpdated: new Date().toISOString(), status: 'PICKUP', orderId: 'QM-901234' },
      { riderId: 'rider-003', riderName: 'Priya Sharma', phone: '+91 98765 33333', vehicleNumber: 'KA-03-EX-1204', lat: 12.9710, lon: 77.6410, speed: 35, battery: 76, lastUpdated: new Date().toISOString(), status: 'ONLINE', orderId: null },
    ];
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
