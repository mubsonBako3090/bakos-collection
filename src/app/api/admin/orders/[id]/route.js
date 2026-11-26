import { requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/database';
import { ApiError, handleError, json, readJson, toObjectId } from '@/lib/http';
import { ORDER_STATUSES } from '@/lib/orders';

export const dynamic = 'force-dynamic';

export async function PATCH(req, { params }) {
  try {
    await requireAdmin();
    const { status } = await readJson(req);
    if (!ORDER_STATUSES.includes(status)) throw new ApiError(400, 'Invalid status.');

    const db = await getDb();
    const order = await db
      .collection('orders')
      .findOneAndUpdate(
        { _id: toObjectId(params.id, 'order id') },
        { $set: { status, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
    if (!order) throw new ApiError(404, 'Order not found.');
    return json(order);
  } catch (err) {
    return handleError(err);
  }
}
