const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (hostname === 'localhost' ? 'http://localhost:4000/api' : 'https://cartcraze-95gt.onrender.com/api');

export async function fetchSecurityLogsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/security-logs`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch security logs:', err);
    return null;
  }
}

export async function fetchAdminDarkstoresApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/darkstores`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch admin darkstores:', err);
    return null;
  }
}

export const fetchDarkstoresApi = fetchAdminDarkstoresApi;

export async function updateDarkstoreStatusApi(darkstoreId: string, status: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/darkstores/${darkstoreId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to update darkstore status:', err);
    return null;
  }
}

export async function fetchAdminMetricsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/metrics`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch admin metrics:', err);
    return null;
  }
}

export async function updateAdminSettingsApi(settings: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to update admin settings:', err);
    return null;
  }
}

export const updatePlatformSettingsApi = updateAdminSettingsApi;
