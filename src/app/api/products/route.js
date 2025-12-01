import { getAllProducts } from '@/lib/models/product';

export async function GET() {
  try {
    const products = await getAllProducts();
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
