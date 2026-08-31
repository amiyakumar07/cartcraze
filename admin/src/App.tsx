import { useState, useEffect } from 'react';
import type { AdminUser, AdminActiveTab, DarkstoreNode, SecurityLog, PlatformSettings } from './types';
import { INITIAL_DARKSTORES, INITIAL_SECURITY_LOGS, DEFAULT_PLATFORM_SETTINGS } from './data/adminData';
import { SecurityGate } from './components/SecurityGate';
import { AdminNavbar } from './components/AdminNavbar';
import { PlatformOverview } from './pages/PlatformOverview';
import { DarkstoreControlView } from './pages/DarkstoreControlView';
import { SecurityAuditView } from './pages/SecurityAuditView';
import { PlatformFeeSettingsView } from './pages/PlatformFeeSettingsView';
import { UserFraudControlView } from './pages/UserFraudControlView';
import { AdminLocationIQMap } from './components/AdminLocationIQMap';
import { PartnerApprovalView } from './pages/PartnerApprovalView';
import { fetchSecurityLogsApi, fetchDarkstoresApi, updateDarkstoreStatusApi, updatePlatformSettingsApi } from './services/api';

export default function App() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('cartcraze_admin_user');
    const savedTs = localStorage.getItem('cartcraze_admin_login_timestamp');
    if (saved && savedTs) {
      if (Date.now() - Number(savedTs) <= 72 * 60 * 60 * 1000) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return null;
  });

  const handleAdminAuthenticated = (user: AdminUser) => {
    localStorage.setItem('cartcraze_admin_user', JSON.stringify(user));
    localStorage.setItem('cartcraze_admin_login_timestamp', Date.now().toString());
    setAdminUser(user);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('cartcraze_admin_user');
    localStorage.removeItem('cartcraze_admin_login_timestamp');
    setAdminUser(null);
  };

  const [activeTab, setActiveTab] = useState<AdminActiveTab>('overview');
  const [darkstores, setDarkstores] = useState<DarkstoreNode[]>(INITIAL_DARKSTORES);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(INITIAL_SECURITY_LOGS);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(DEFAULT_PLATFORM_SETTINGS);

  // Poll central REST API server every 4 seconds for live security logs and darkstore status
  useEffect(() => {
    if (!adminUser) return;

    const fetchData = async () => {
      const logs = await fetchSecurityLogsApi();
      if (logs && Array.isArray(logs)) {
        setSecurityLogs(logs);
      }

      const stores = await fetchDarkstoresApi();
      if (stores && Array.isArray(stores) && stores.length > 0) {
        setDarkstores(stores);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [adminUser]);

  // Handle Master Darkstore Status Toggle
  const handleToggleStoreStatus = (storeId: string) => {
    const targetStore = darkstores.find((s) => s.id === storeId);
    if (!targetStore) return;

    const nextStatus = targetStore.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';

    setDarkstores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, status: nextStatus } : s))
    );

    // Call Central API Server
    updateDarkstoreStatusApi(storeId, nextStatus);
  };

  const handleUpdatePlatformSettings = (newSettings: PlatformSettings) => {
    setPlatformSettings(newSettings);
    updatePlatformSettingsApi(newSettings);
  };

  // If not authenticated, force high security gate
  if (!adminUser) {
    return <SecurityGate onAuthenticated={handleAdminAuthenticated} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <PlatformOverview />;
      case 'darkstores':
        return (
          <DarkstoreControlView
            darkstores={darkstores}
            onToggleStoreStatus={handleToggleStoreStatus}
          />
        );
      case 'approvals':
        return <PartnerApprovalView />;
      case 'locationiq':
        return <AdminLocationIQMap />;
      case 'security_logs':
        return <SecurityAuditView logs={securityLogs} />;
      case 'users':
        return <UserFraudControlView />;
      case 'settings':
        return (
          <PlatformFeeSettingsView
            settings={platformSettings}
            onUpdateSettings={handleUpdatePlatformSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans">
      <AdminNavbar
        admin={adminUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLockSession={handleAdminLogout}
        onLogout={handleAdminLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {renderContent()}
      </main>
    </div>
  );
}
