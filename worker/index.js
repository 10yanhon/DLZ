export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const jsonHeaders = { 'Content-Type': 'application/json;charset=UTF-8' };
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    if (path === '/api/products' && request.method === 'GET') {
      const products = [
        { id: 'p1', title: 'Comfort Tee', price: 29.99, image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=60', description: 'Soft cotton t-shirt.' },
        { id: 'p2', title: 'Classic Hoodie', price: 59.99, image: 'https://images.unsplash.com/photo-1520975912700-3a7f2a9f2f3f?w=800&q=60', description: 'Warm and cozy hoodie.' },
        { id: 'p3', title: 'Everyday Sneakers', price: 89.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=60', description: 'Comfortable daily sneakers.' },
        { id: 'p4', title: 'Minimalist Watch', price: 129.99, image: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=800&q=60', description: 'Sleek and modern watch.' }
      ];
      return new Response(JSON.stringify({ ok:true, products }), { headers: { ...jsonHeaders, ...cors } });
    }

    if (path === '/api/orders' && request.method === 'POST') {
      const body = await request.json().catch(()=>null);
      if(!body || !Array.isArray(body.items) || body.items.length===0){
        return new Response(JSON.stringify({ ok:false, error:'no items' }), { status:400, headers:{...jsonHeaders,...cors} });
      }
      const id = 'ord_' + Math.floor(Math.random()*900000 + 100000);
      const order = { id, items: body.items, total: body.total || 0, createdAt: new Date().toISOString(), status: 'paid (mock)' };
      return new Response(JSON.stringify({ ok:true, order }), { headers:{...jsonHeaders,...cors} });
    }

    if (path === '/api/pay' && request.method === 'POST') {
      const body = await request.json().catch(()=>null);
      return new Response(JSON.stringify({ ok:true, provider:'mock', status:'success', details: body }), { headers:{...jsonHeaders,...cors} });
    }

    if (path === '/api/user/register' && request.method === 'POST') {
      const body = await request.json().catch(()=>null);
      if(!body || !body.email) return new Response(JSON.stringify({ ok:false, error:'email required' }), { status:400, headers:{...jsonHeaders,...cors} });
      const id = 'u_' + Math.floor(Math.random()*900000 + 100000);
      return new Response(JSON.stringify({ ok:true, user:{ id, email: body.email } }), { headers:{...jsonHeaders,...cors} });
    }

    return new Response(JSON.stringify({ ok:false, error:'Not Found' }), { status:404, headers:{...jsonHeaders,...cors} });
  }
};
