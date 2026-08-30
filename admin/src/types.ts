export type AdminRole = 'SUPER_ADMIN' | 'SECURITY_OFFICER' | 'SYSTEM_AUDITOR';

export interface AdminUser {
  email: string;
  name: string;
  role: AdminRole;
  lastLogin: string;
  sessionToken: string;
  ipAddress: string;
  is2FAVerified: boolean;
}

export type SecuritySeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface SecurityLog {
  id: string;
  timestamp: string;
  eventType: string;
  ipAddress: string;
  location: string;
  severity: SecuritySeverity;
  details: string;
}

export interface DarkstoreNode {
  id: string;
  name: string;
  city: string;
  status: 'ONLINE' | 'MAINTENANCE' | 'PAUSED';
  dailyOrders: number;
  revenue: number;
  managerName: string;
  managerPhone: string;
  uptimePercent: number;
}

export interface PlatformSettings {
  commissionRatePercent: number;
  deliveryFeeThreshold: number;
  platformFee: number;
  fraudProtectionStrictness: 'LOW' | 'MEDIUM' | 'STRICT_MAX';
  maintenanceMode: boolean;
}

export type AdminActiveTab = 'overview' | 'darkstores' | 'approvals' | 'locationiq' | 'security_logs' | 'users' | 'settings';
