import { requireAdmin } from '@/lib/auth';
import { ApiError, handleError, json, readJson } from '@/lib/http';
import { deleteProduct, updateProduct, validateProductInput } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
  try {
    await requireAdmin();
    const input = validateProductInput(await readJson(req));
    const product = await updateProduct(params.id, input);
    if (!product) throw new ApiError(404, 'Product not found.');
    return json(product);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin();
    const deleted = await deleteProduct(params.id);
    if (!deleted) throw new ApiError(404, 'Product not found.');
    return json({ message: 'Product deleted.' });
  } catch (err) {
    return handleError(err);
  }
}
