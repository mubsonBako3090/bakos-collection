import { ApiError, handleError, json } from '@/lib/http';
import { getProductById } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const product = await getProductById(params.id);
    if (!product) throw new ApiError(404, 'Product not found.');
    return json(product);
  } catch (err) {
    return handleError(err);
  }
}
