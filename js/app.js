// app.js - minimal e-commerce front-end logic
const API_BASE = '/api'; // with Pages Functions, /api/* routes to functions/api/*.js

async function apiGet(path){
  const res = await fetch(API_BASE + path);
  if(!res.ok) throw new Error('network');
  return res.json();
}
async function apiPost(path, body){
  const res = await fetch(API_BASE + path, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
  });
  return res.json();
}

function formatPrice(n){ return '¥' + Number(n).toFixed(2); }

async function loadProducts(){ try{ const j = await apiGet('/products'); return j.products || j; }catch(e){ console.warn('API failed, using fallback'); return [
  { id:'p1', title:'Comfort Tee', price:29.99, image:'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=60', description:'Soft cotton t-shirt.' },
  { id:'p2', title:'Classic Hoodie', price:59.99, image:'https://images.unsplash.com/photo-1520975912700-3a7f2a9f2f3f?w=800&q=60', description:'Warm and cozy hoodie.' },
  { id:'p3', title:'Everyday Sneakers', price:89.99, image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=60', description:'Comfortable daily sneakers.' }
]; } }

async function renderProducts(selector='#productList'){
  const list = await loadProducts();
  const container = document.querySelector(selector);
  if(!container) return;
  container.innerHTML = '';
  document.getElementById('productCount')?.innerText = list.length + ' 件商品';
  list.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h4>${p.title}</h4>
      <div style="color:var(--muted)">${p.description||''}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
        <div class="price">${formatPrice(p.price)}</div>
        <div style="display:flex;gap:8px">
          <button class="btn" onclick="addToCart('${p.id}')">加入购物车</button>
          <a class="btn" href="/product.html?id=${p.id}">查看</a>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function getCart(){ try{ return JSON.parse(localStorage.getItem('cart')||'[]'); }catch(e){return []} }
function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); updateCounts(); updateMiniCart(); }
function updateCounts(){ const c = getCart().reduce((s,i)=>s+i.qty,0); document.getElementById('cart-count') && (document.getElementById('cart-count').innerText = c); }

async function addToCart(id){
  const products = await loadProducts();
  const p = products.find(x=>x.id==id);
  if(!p) return alert('商品未找到');
  const cart = getCart();
  const ex = cart.find(i=>i.id==p.id);
  if(ex) ex.qty++; else cart.push({ id:p.id, title:p.title, price:p.price, qty:1 });
  saveCart(cart);
  alert('已加入购物车');
  updateMiniCart();
}

function updateMiniCart(){
  const cart = getCart();
  const mini = document.getElementById('miniCart');
  if(!mini) return;
  if(cart.length===0){ mini.innerText='购物车为空'; return; }
  mini.innerHTML = cart.map(i=>`<div>${i.title} × ${i.qty} — ${formatPrice(i.price * i.qty)}</div>`).join('');
}

function renderCartPage(){
  const cart = getCart();
  const wrap = document.getElementById('cartItems');
  if(!wrap) return;
  if(cart.length===0){ wrap.innerHTML='购物车为空'; document.getElementById('cartTotal').innerText=''; return; }
  wrap.innerHTML = '';
  let total = 0;
  cart.forEach(it=>{
    wrap.innerHTML += `<div style="display:flex;justify-content:space-between;margin-bottom:8px">${it.title} × ${it.qty} <b>${formatPrice(it.price*it.qty)}</b></div>`;
    total += it.qty*it.price;
  });
  document.getElementById('cartTotal').innerText = '合计：' + formatPrice(total);
  document.getElementById('checkoutBtn')?.addEventListener('click', async ()=>{
    const res = await apiPost('/orders', { items: cart, total });
    if(res && res.ok){ alert('下单成功，订单ID: ' + res.order.id); localStorage.removeItem('cart'); updateCounts(); updateMiniCart(); window.location = '/'; }
    else alert('下单失败');
  });
}

async function renderProductDetail(){
  const qs = new URLSearchParams(location.search);
  const id = qs.get('id');
  const products = await loadProducts();
  const p = products.find(x=>x.id==id) || products[0];
  const el = document.getElementById('productDetail');
  if(!el) return;
  el.className = 'card';
  el.innerHTML = `<img src="${p.image}"><h2>${p.title}</h2><p style="color:var(--muted)">${p.description||''}</p><div style="font-weight:700">${formatPrice(p.price)}</div><div style="margin-top:12px"><button class="btn" onclick="addToCart('${p.id}')">加入购物车</button></div>`;
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts('#productList');
  updateCounts();
  updateMiniCart();
  if(document.getElementById('cartItems')) renderCartPage();
  if(document.getElementById('productDetail')) renderProductDetail();
});
