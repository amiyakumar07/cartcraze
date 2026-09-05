import { API_BASE } from '../config/api';

export async function fetchAvailableOrdersApi() {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export const fetchAssignedOrdersApi = fetchAvailableOrdersApi;

export async function updateOrderStatusApi(orderId: string, status: string, driverData?: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, ...driverData }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}
