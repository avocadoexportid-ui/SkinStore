export function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

export function addToCart(product) {
  const cart = getCart();
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

export function updateCartCount() {
  const count = getCart().length;
  const el = document.getElementById('cart-count');
  if (el) el.textContent = count;
}
