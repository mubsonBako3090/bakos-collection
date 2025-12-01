import { getProductsByCategory } from '@/lib/models/product';

export async function GET(req, { params }) {
  try {
    const products = await getProductsByCategory(params.category);
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
