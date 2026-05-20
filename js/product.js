import { getProducts } from './api.js';
import { addToCart } from './cart.js';
import { formatRupiah } from './utils.js';

export async function renderProducts() {
  const products = await getProducts();
  const container = document.getElementById('product-list');
  
  if (!products.length) {
    container.innerHTML = '<p>Produk belum tersedia</p>';
    return;
  }

  container.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image || '/assets/images/placeholder.jpg'}" alt="${p.name}">
      <div class="info">
        <h3>${p.name}</h3>
        <p class="price">${formatRupiah(p.price)}</p>
        <p>Stok: ${p.stock}</p>
        <button class="btn-add" data-id="${p._id}">Tambah ke Keranjang</button>
      </div>
    </div>
  `).join('');

  // Event listener untuk tombol
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const product = products.find(p => p._id === e.target.dataset.id);
      addToCart(product);
      alert(`${product.name} ditambah ke keranjang`);
    });
  });
}
