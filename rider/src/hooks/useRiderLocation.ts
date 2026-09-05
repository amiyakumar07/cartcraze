import { useState, useEffect, useCallback, useRef } from 'react';
import { DEFAULT_COORDS } from '../config/api';
import type { LocationCoords } from '../config/api';

interface UseRiderLocationOptions {
  enabled?: boolean;
  highAccuracy?: boolean;
  maxAge?: number;
  onError?: (error: GeolocationPositionError) => void;
}

export function useRiderLocation(options: UseRiderLocationOptions = {}) {
  const { enabled = true, highAccuracy = true, maxAge = 5000, onError } = options;
  const [coords, setCoords] = useState<LocationCoords | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const startWatching = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported');
      return;
    }

    setIsWatching(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          address: '', // Will be resolved by reverse geocoding
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
        onError?.(err);
      },
      { enableHighAccuracy: highAccuracy, maximumAge: maxAge }
    );
  }, [highAccuracy, maxAge, onError]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsWatching(false);
  }, []);

  const getCurrentPosition = useCallback((): Promise<LocationCoords> => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        resolve(DEFAULT_COORDS);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          address: '',
        }),
        () => resolve(DEFAULT_COORDS),
        { enableHighAccuracy: highAccuracy, maximumAge: maxAge }
      );
    });
  }, [highAccuracy, maxAge]);

  useEffect(() => {
    if (enabled) {
      startWatching();
    }
    return () => stopWatching();
  }, [enabled, startWatching, stopWatching]);

  return { coords, isWatching, error, startWatching, stopWatching, getCurrentPosition };
}
