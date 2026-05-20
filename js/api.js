const BASE_URL = "http://localhost:5000/api"; // Ganti saat deploy

export async function getProducts() {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) throw new Error('Gagal ambil data produk');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
