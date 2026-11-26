import { requireAdmin } from '@/lib/auth';
import { handleError, json, readJson } from '@/lib/http';
import { createProduct, validateProductInput } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await requireAdmin();
    const input = validateProductInput(await readJson(req));
    return json(await createProduct(input), 201);
  } catch (err) {
    return handleError(err);
  }
}
