export async function onRequestGet(context) {
  const products = [
    { id: 'p1', title: 'Comfort Tee', price: 29.99, image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=60', description: 'Soft cotton t-shirt.' },
    { id: 'p2', title: 'Classic Hoodie', price: 59.99, image: 'https://images.unsplash.com/photo-1520975912700-3a7f2a9f2f3f?w=800&q=60', description: 'Warm and cozy hoodie.' },
    { id: 'p3', title: 'Everyday Sneakers', price: 89.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=60', description: 'Comfortable daily sneakers.' },
    { id: 'p4', title: 'Minimalist Watch', price: 129.99, image: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=800&q=60', description: 'Sleek and modern watch.' }
  ];
  return new Response(JSON.stringify({ ok:true, products }), {
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}
