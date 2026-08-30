const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (hostname === 'localhost' ? 'http://localhost:4000/api' : 'https://cartcraze-95gt.onrender.com/api');

export async function fetchStoreOrdersApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch store orders:', err);
    return null;
  }
}

export async function updateOrderStatusApi(orderId: string, status: string, driverInfo?: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...driverInfo })
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to update order status:', err);
    return null;
  }
}

export async function updateStockApi(productId: string, inStock: boolean, stockCount?: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock, stockCount })
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to update product stock:', err);
    return null;
  }
}

export async function addProductApi(productData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to add new product:', err);
    return null;
  }
}
