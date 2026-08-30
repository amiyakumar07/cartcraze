const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE_URL = `http://${hostname}:4000/api`;

export async function createOrderApi(orderData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to post order to central API:', err);
    return null;
  }
}

export async function fetchProductsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch products from central API:', err);
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
