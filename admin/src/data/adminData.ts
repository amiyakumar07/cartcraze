import type { SecurityLog, DarkstoreNode, PlatformSettings } from '../types';

export const INITIAL_DARKSTORES: DarkstoreNode[] = [];

export const INITIAL_SECURITY_LOGS: SecurityLog[] = [];

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  commissionRatePercent: 5.5,
  deliveryFeeThreshold: 199,
  platformFee: 5,
  fraudProtectionStrictness: 'STRICT_MAX',
  maintenanceMode: false
};
