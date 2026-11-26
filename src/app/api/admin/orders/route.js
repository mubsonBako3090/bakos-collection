import { requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/database';
import { handleError, json } from '@/lib/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const db = await getDb();
    const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).limit(500).toArray();
    return json(orders);
  } catch (err) {
    return handleError(err);
  }
}
