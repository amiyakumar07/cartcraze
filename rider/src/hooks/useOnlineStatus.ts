import { useState, useEffect, useCallback } from 'react';
import type { DutyStatus } from '../types';

const STORAGE_KEY = 'cartcraze_duty_status';

export function useOnlineStatus() {
  const [dutyStatus, setDutyStatus] = useState<DutyStatus>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved as DutyStatus) || 'OFF_DUTY';
  });

  const isOnDuty = dutyStatus === 'ON_DUTY';

  const toggleDuty = useCallback(() => {
    setDutyStatus((prev) => {
      const next = prev === 'ON_DUTY' ? 'OFF_DUTY' : 'ON_DUTY';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const setDuty = useCallback((status: DutyStatus) => {
    setDutyStatus(status);
    localStorage.setItem(STORAGE_KEY, status);
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setDutyStatus(e.newValue as DutyStatus);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return { dutyStatus, isOnDuty, toggleDuty, setDuty };
}
