export const API_BASE = import.meta.env.VITE_API_BASE_URL || (
  typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:4000/api'
    : 'https://cartcraze-95gt.onrender.com/api'
);

export const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY || '';

export const SESSION_DURATION_MS = 72 * 60 * 60 * 1000; // 72 hours

export const RIDER_STORAGE_KEY = 'cartcraze_rider_data';
export const RIDER_SESSION_KEY = 'cartcraze_rider_login_timestamp';

export interface LocationCoords {
  lat: number;
  lon: number;
  address?: string;
  speed?: number | null;
  heading?: number | null;
}

export const DEFAULT_COORDS: LocationCoords = {
  lat: 20.3533,
  lon: 85.8178,
  address: 'KIIT Road, Patia, Bhubaneswar',
};

