import Cart from '@/models/Cart';
import { connectDB } from '@/lib/database';
import { verifyAuth } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectDB();

    const token = await verifyAuth(req);
    if (!token) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const userId = token.id;
    const { productId, action } = await req.json();
    // action: 'increase' | 'decrease' | 'remove'

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return new Response(JSON.stringify({ message: 'Cart not found' }), { status: 404 });

    const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
    if (itemIndex === -1) return new Response(JSON.stringify({ message: 'Item not in cart' }), { status: 404 });

    if (action === 'increase') {
      cart.items[itemIndex].quantity += 1;
    } else if (action === 'decrease') {
      cart.items[itemIndex].quantity -= 1;
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
    } else if (action === 'remove') {
      cart.items.splice(itemIndex, 1);
    } else {
      return new Response(JSON.stringify({ message: 'Invalid action' }), { status: 400 });
    }

    await cart.save();
    return new Response(JSON.stringify({ cart }), { status: 200 });
  } catch (err) {
    console.error('Update cart error:', err);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
} 
