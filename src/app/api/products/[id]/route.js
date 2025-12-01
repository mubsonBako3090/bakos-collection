import { getProductById } from '@/lib/models/product';

export async function GET(req, { params }) {
  try {
    const product = await getProductById(params.id);

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
