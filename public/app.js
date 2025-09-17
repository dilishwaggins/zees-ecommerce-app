const api = (path, opts = {}) => {
  // Use current window origin (http://localhost:5000) + path
  const base = window.location.origin;
  const token = localStorage.getItem('token');
  opts.headers = opts.headers || {};
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  return fetch(base + path, opts).then(async r => {
    const text = await r.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error("❌ Non-JSON response:", text);
      throw new Error("Invalid JSON response");
    }
  });
};


async function loadProducts(){
  const products = await api('/api/products');
  const out = document.getElementById('products');
  out.innerHTML = '';
  (products || []).forEach(p => {
    const el = document.createElement('div'); el.className='product';
    el.innerHTML = `<div><strong>${p.name}</strong><div>${p.description || ''}</div><div>$${p.price}</div></div>`;
    const btn = document.createElement('button'); btn.textContent='Add to cart';
    btn.onclick = async () => {
      const res = await api('/api/cart/add', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ productId: p._id, quantity: 1 }) });
      alert('Added to cart');
      loadCart();
    };
    el.appendChild(btn);
    out.appendChild(el);
  });
}

async function loadCart(){
  const cart = await api('/api/cart');
  const out = document.getElementById('cart');
  out.innerHTML = '';
  if (!cart || !cart.items || cart.items.length===0) { out.textContent='Cart is empty'; return; }
  cart.items.forEach(i => {
    const el = document.createElement('div');
    el.textContent = `${i.product.name} x ${i.quantity} ($${(i.product.price * i.quantity).toFixed(2)})`;
    out.appendChild(el);
  });
}

document.getElementById('btnRegister').onclick = async () => {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const res = await api('/api/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, email, password }) });
  alert(res.message || 'Registered');
};

document.getElementById('btnLogin').onclick = async () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const res = await api('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
  if (res.token) {
    localStorage.setItem('token', res.token);
    document.getElementById('who').textContent = 'Logged in as ' + (res.user?.name || res.user?.email || '');
    await loadProducts();
    await loadCart();
  } else alert(res.message || 'Login failed');
};

document.getElementById('btnCheckout').onclick = async () => {
  const res = await api('/api/orders/checkout', { method:'POST' });
  if (res._id) {
    alert('Order placed! total: $' + res.totalPrice);
    loadCart();
  } else alert(res.message || 'Checkout failed');
};

// initial load
loadProducts();
