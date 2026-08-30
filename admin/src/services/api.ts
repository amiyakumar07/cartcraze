const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE_URL = `http://${hostname}:4000/api`;

export async function fetchSecurityLogsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/security-logs`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch security logs from central API:', err);
    return null;
  }
}

export async function fetchDarkstoresApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/darkstores`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch darkstores from central API:', err);
    return null;
  }
}

export async function updateDarkstoreStatusApi(darkstoreId: string, status: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/darkstores/${darkstoreId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to update darkstore status on central API:', err);
    return null;
  }
}

export async function fetchAdminMetricsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/metrics`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch admin metrics from central API:', err);
    return null;
  }
}

export async function updatePlatformSettingsApi(settings: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to update platform settings on central API:', err);
    return null;
  }
}
