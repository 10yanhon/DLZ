const API_BASE = (typeof API_BASE_OVERRIDE !== 'undefined') ? API_BASE_OVERRIDE : '/api';

async function apiGet(path){ const res = await fetch(API_BASE + path); return res.json(); }
async function apiPost(path, body){ const res = await fetch(API_BASE + path, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}); return res.json(); }

async function loadProducts(){ try{ const j = await apiGet('/products'); return j.products || []; }catch(e){console.error(e); return []; } }

function formatPrice(n){ return '¥' + Number(n).toFixed(2); }

async function renderProducts(selector='#productList'){ const list = await loadProducts(); const container = document.querySelector(selector); if(!container) return; container.innerHTML=''; list.forEach(p=>{ const card = document.createElement('div'); card.className='card'; card.innerHTML = `
  <img src="${p.image}" alt="${p.title}">
  <h4>${p.title}</h4>
  <div style="color:var(--muted)">${p.description || ''}</div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
    <div class="price">${formatPrice(p.price)}</div>
    <div style="display:flex;gap:8px"><button class="btn" onclick="addToCart('${p.id}')">加入购物车</button><a class="btn" href="/product.html?id=${p.id}">查看</a></div>
  </div>`; container.appendChild(card); }); document.getElementById('productCount')?.innerText = list.length + ' 件商品'; }

function getCart(){ try{ return JSON.parse(localStorage.getItem('cart')||'[]'); }catch(e){return [];} }
function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); updateCounts(); }
function updateCounts(){ const c = getCart().reduce((s,i)=>s+i.qty,0); document.getElementById('cart-count') && (document.getElementById('cart-count').innerText=c); }

async function addToCart(id){ const products = await loadProducts(); const p = products.find(x=>x.id==id); if(!p) return alert('未找到商品'); const cart = getCart(); const ex = cart.find(i=>i.id==p.id); if(ex) ex.qty++; else cart.push({id:p.id, title:p.title, price:p.price, qty:1}); saveCart(cart); alert('已加入购物车'); }

function renderCartPage(){ const cart = getCart(); const wrap = document.getElementById('cartItems'); if(!wrap) return; if(cart.length===0){ wrap.innerHTML='<div>购物车为空</div>'; return; } wrap.innerHTML=''; let total=0; cart.forEach(it=>{ const d = document.createElement('div'); d.style.display='flex'; d.style.justifyContent='space-between'; d.style.marginBottom='10px'; d.innerHTML = `<div>${it.title} × ${it.qty}</div><div>${formatPrice(it.price*it.qty)}</div>`; wrap.appendChild(d); total += it.qty*it.price; }); const totalEl = document.createElement('div'); totalEl.style.marginTop='12px'; totalEl.style.fontWeight='700'; totalEl.innerText = '合计：' + formatPrice(total); wrap.appendChild(totalEl); document.getElementById('checkoutBtn')?.addEventListener('click', async ()=>{ const res = await apiPost('/orders', { items: cart, total }); if(res.ok){ alert('下单成功，订单ID:' + res.order.id); localStorage.removeItem('cart'); renderCartPage(); updateCounts(); } else alert('下单失败'); }); }

async function renderProductDetail(){ const qs = new URLSearchParams(location.search); const id = qs.get('id'); if(!id) return; const products = await loadProducts(); const p = products.find(x=>x.id==id); if(!p){ document.getElementById('productDetail').innerText='未找到商品'; return; } const el = document.getElementById('productDetail'); el.innerHTML = `<div class="card"><img src="${p.image}"><h2>${p.title}</h2><p style="color:var(--muted)">${p.description||''}</p><div style="font-weight:700">${formatPrice(p.price)}</div><div style="margin-top:12px"><button class="btn" onclick="addToCart('${p.id}')">加入购物车</button></div></div>`; }

document.addEventListener('DOMContentLoaded', ()=>{ renderProducts('#productList'); updateCounts(); if(document.getElementById('cartItems')) renderCartPage(); if(document.getElementById('productDetail')) renderProductDetail(); });
