import { ObjectId } from 'mongodb';
import { getCurrentUser, publicUser, requireUser } from '@/lib/auth';
import { getDb } from '@/lib/database';
import { ApiError, handleError, json, readJson } from '@/lib/http';
import { cleanText, isValidPhone } from '@/lib/validate';

export const dynamic = 'force-dynamic';

// Returns { user: null } (HTTP 200) for guests so the browser console isn't full of 401s.
export async function GET() {
  try {
    const user = await getCurrentUser();
    return json({ user: user ? publicUser(user) : null });
  } catch (err) {
    return handleError(err);
  }
}

// Update the profile. Only whitelisted fields can change (never role/password/email).
export async function PUT(req) {
  try {
    const user = await requireUser();
    const body = await readJson(req);

    const update = {
      name: cleanText(body.name, 100),
      phone: cleanText(body.phone, 20),
      address: cleanText(body.address),
      city: cleanText(body.city, 100),
      state: cleanText(body.state, 100),
      zip: cleanText(body.zip, 20),
    };
    if (!update.name) throw new ApiError(400, 'Name cannot be empty.');
    if (update.phone && !isValidPhone(update.phone)) throw new ApiError(400, 'Please enter a valid phone number.');

    const db = await getDb();
    const updated = await db
      .collection('users')
      .findOneAndUpdate(
        { _id: new ObjectId(user._id) },
        { $set: update },
        { returnDocument: 'after', projection: { password: 0 } }
      );
    return json({ user: publicUser(updated) });
  } catch (err) {
    return handleError(err);
  }
}
