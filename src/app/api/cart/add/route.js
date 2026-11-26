import { requireUser } from '@/lib/auth';
import { addToCart, loadCart } from '@/lib/cart';
import { handleError, json, readJson } from '@/lib/http';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const user = await requireUser();
    const { productId } = await readJson(req);
    const userId = String(user._id);

    await addToCart(userId, productId);
    return json({ message: 'Added to cart.', cart: await loadCart(userId) });
  } catch (err) {
    return handleError(err);
  }
}
