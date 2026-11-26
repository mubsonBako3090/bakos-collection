import { findCategory } from '@/lib/categories';
import { handleError, json } from '@/lib/http';
import { listProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const category = findCategory(decodeURIComponent(params.category));
    if (!category) return json([]);
    return json(await listProducts({ category: category.name }));
  } catch (err) {
    return handleError(err);
  }
}
