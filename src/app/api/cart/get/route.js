export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/mongoose'; 
import Cart from '@/models/Cart';
import { verifyAuth } from '@/lib/auth';

export async function GET(req) {
  try {
    await dbConnect(); // correct Mongoose connection

    const token = verifyAuth(req);
    const userId = token.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.productId");

    return new Response(JSON.stringify({
      cart: cart || { items: [] }
    }), { status: 200 });

  } catch (err) {
    console.error("Get cart error:", err);
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }
}
