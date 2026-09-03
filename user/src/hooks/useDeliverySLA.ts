import { useMemo } from 'react';

export interface DeliverySLAResult {
  slaMinutes: number;
  slaText: string;
  isExpressAvailable: boolean;
}

export const useDeliverySLA = (distanceKm: number = 1.2): DeliverySLAResult => {
  return useMemo(() => {
    let minutes = 9;
    if (distanceKm <= 1.5) minutes = 9;
    else if (distanceKm <= 3.0) minutes = 12;
    else if (distanceKm <= 5.0) minutes = 15;
    else minutes = 19;

    return {
      slaMinutes: minutes,
      slaText: `${minutes} Mins`,
      isExpressAvailable: distanceKm <= 5.0
    };
  }, [distanceKm]);
};
