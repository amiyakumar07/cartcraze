const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE = `http://${hostname}:4000/api`;

export const fetchAssignedOrdersApi = async () => {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  const all = await res.json();
  return all.filter((o: any) => o.status === 'DISPATCHED' || o.status === 'PACKING');
};

export const updateOrderStatusApi = async (orderId: string, status: string) => {
  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update order');
  return res.json();
};
