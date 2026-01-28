
const API_URL = "http://localhost:5000/api"; // CHANGE THIS to your actual .NET port

export async function fetchNearbyShops(city: string = "Pune") {
  const res = await fetch(`${API_URL}/Merchants/nearby?city=${city}`);
  if (!res.ok) throw new Error("Failed to fetch shops");
  return res.json();
}

export async function fetchShopProducts(merchantId: string) {
  const res = await fetch(`${API_URL}/Merchants/${merchantId}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}