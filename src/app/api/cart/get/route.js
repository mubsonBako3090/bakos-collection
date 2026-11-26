import { getCurrentUser } from '@/lib/auth';
import { loadCart } from '@/lib/cart';
import { handleError, json } from '@/lib/http';

export const dynamic = 'force-dynamic';

// Guests just get an empty cart (HTTP 200) rather than an error.
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return json({ cart: { items: [], count: 0, total: 0 } });
    return json({ cart: await loadCart(String(user._id)) });
  } catch (err) {
    return handleError(err);
  }
}
