import { renderProducts } from './product.js';
import { updateCartCount } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartCount();
});
