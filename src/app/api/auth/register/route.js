import { createUser } from '@/lib/models/user';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const user = await createUser({ name, email, password });

    return new Response(JSON.stringify({ message: 'User registered successfully', user }), {
      status: 201
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

