export async function onRequestPost(context) {
  try {
    const body = await context.request.json().catch(()=>null);
    if(!body || !Array.isArray(body.items) || body.items.length === 0) {
      return new Response(JSON.stringify({ ok:false, error:'no items' }), { status:400, headers:{ 'Content-Type':'application/json' }});
    }
    const id = 'ord_' + Math.floor(Math.random()*900000 + 100000);
    const order = { id, items: body.items, total: body.total || 0, createdAt: new Date().toISOString(), status: 'paid (mock)' };
    // NOTE: This is a mock: if you later want persistence, we can add D1 (SQL) or KV wiring.
    return new Response(JSON.stringify({ ok:true, order }), { headers:{ 'Content-Type':'application/json' }});
  } catch(e) {
    return new Response(JSON.stringify({ ok:false, error: 'server' }), { status:500, headers:{ 'Content-Type':'application/json' }});
  }
}
