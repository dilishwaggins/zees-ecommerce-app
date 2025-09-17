const api = (path, opts = {}) => {
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

// Load products
async function loadProducts(){
  const products = await api('/api/products');
  const out = document.getElementById('products');
  if (!out) return; // not on shop page
  out.innerHTML = '';
  (products || []).forEach(p => {
    const el = document.createElement('div'); el.className='product';
    el.innerHTML = `<div>
        <strong>${p.name}</strong>
        <div>${p.description || ''}</div>
        <div>$${p.price}</div>
      </div>`;
    const btn = document.createElement('button'); btn.textContent='Add to cart';
    btn.onclick = async () => {
      const res = await api('/api/cart/add', { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify({ productId: p._id, quantity: 1 }) 
      });
      if (res.message) alert(res.message);
      loadCart();
    };
    el.appendChild(btn);
    out.appendChild(el);
  });
}

// Load cart
async function loadCart(){
  const out = document.getElementById('cart');
  if (!out) return; // not on shop page
  const cart = await api('/api/cart');
  out.innerHTML = '';
  if (!cart || !cart.items || cart.items.length===0) { 
    out.textContent='Cart is empty'; 
    return; 
  }
  cart.items.forEach(i => {
    const el = document.createElement('div');
    el.textContent = `${i.product.name} x ${i.quantity} ($${(i.product.price * i.quantity).toFixed(2)})`;
    out.appendChild(el);
  });
}

// Register
const btnRegister = document.getElementById('btnRegister');
if (btnRegister) {
  btnRegister.onclick = async () => {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const res = await api('/api/register', { 
      method:'POST', 
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify({ name, email, password }) 
    });
    alert(res.message || 'Registered');
    if (!res.message?.includes("error")) {
      window.location = "index.html"; // redirect to shop
    }
  };
}

// Login
const btnLogin = document.getElementById('btnLogin');
if (btnLogin) {
  btnLogin.onclick = async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const res = await api('/api/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });

    if (res.token) {
      localStorage.setItem('token', res.token);
      alert('Login successful');
      window.location = "index.html"; // redirect to shop
    } else {
      alert(res.message || 'Login failed');
    }
  };
}

// Checkout
const btnCheckout = document.getElementById('btnCheckout');
if (btnCheckout) {
  btnCheckout.onclick = async () => {
    const res = await api('/api/orders/checkout', { method:'POST' });
    if (res._id) {
      alert('Order placed! total: $' + res.totalPrice);
      loadCart();
    } else alert(res.message || 'Checkout failed');
  };
}

// If already logged in and on shop page, show products + cart
if (localStorage.getItem('token')) {
  loadProducts();
  loadCart();
} else {
  // Products should still load even if not logged in
  loadProducts();
}
