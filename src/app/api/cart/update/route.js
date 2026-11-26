import { requireUser } from '@/lib/auth';
import { loadCart, updateCartItem } from '@/lib/cart';
import { handleError, json, readJson } from '@/lib/http';

export const dynamic = 'force-dynamic';

// body: { productId, action: 'increase' | 'decrease' | 'remove' }
export async function POST(req) {
  try {
    const user = await requireUser();
    const { productId, action } = await readJson(req);
    const userId = String(user._id);

    await updateCartItem(userId, productId, action);
    return json({ cart: await loadCart(userId) });
  } catch (err) {
    return handleError(err);
  }
}
