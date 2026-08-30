const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE_URL = `http://${hostname}:4000/api`;

export async function fetchOrdersApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch orders from central API:', err);
    return null;
  }
}

export async function updateOrderStatusApi(orderId: string, status: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to update order status on central API:', err);
    return null;
  }
}

export async function updateProductStockApi(productId: string, stockData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stockData)
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to update product stock on central API:', err);
    return null;
  }
}

export async function addNewProductApi(product: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to add product to central API:', err);
    return null;
  }
}
