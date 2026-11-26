import { findCategory } from '@/lib/categories';
import { handleError, json } from '@/lib/http';
import { listProducts } from '@/lib/products';

// Without this, `next build` caches the response and new products never show up.
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    let category;
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const match = findCategory(categoryParam);
      if (!match) return json([]);
      category = match.name;
    }

    const limitParam = parseInt(searchParams.get('limit'), 10);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : undefined;

    return json(await listProducts({ category, limit }));
  } catch (err) {
    return handleError(err);
  }
}
