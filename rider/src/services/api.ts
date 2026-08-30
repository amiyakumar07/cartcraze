const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE = import.meta.env.VITE_API_BASE_URL || (hostname === 'localhost' ? 'http://localhost:4000/api' : 'https://cartcraze-95gt.onrender.com/api');

export async function fetchAvailableOrdersApi() {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export const fetchAssignedOrdersApi = fetchAvailableOrdersApi;

export async function updateOrderStatusApi(orderId: string, status: string, driverData?: any) {
  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, ...driverData }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}
