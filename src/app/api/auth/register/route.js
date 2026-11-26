import { createUser } from '@/lib/users';
import { handleError, json, readJson } from '@/lib/http';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { name, email, password } = await readJson(req);
    const user = await createUser({ name, email, password });
    return json({ message: 'Registration successful.', user }, 201);
  } catch (err) {
    return handleError(err);
  }
}
