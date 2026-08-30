import type { Order } from '../types';

const API_BASE_URL = 'http://localhost:4000/api';

export const createOrderApi = async (order: Order & { customerName?: string; customerPhone?: string }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to post order to central API:', err);
    return null;
  }
};

export const fetchOrdersApi = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch orders from central API:', err);
    return [];
  }
};
