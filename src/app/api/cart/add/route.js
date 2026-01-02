import Cart from '@/models/Cart';
import { getProductById } from '@/models/product';
import clientPromise from '@/lib/database';
import { verifyAuth } from '@/lib/auth';

export async function POST(req) {
  try {
    const token = await verifyAuth(req);
    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const userId = token.id;
    const { productId } = await req.json();

    const product = await getProductById(productId);
    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ productId, name: product.name, price: product.price }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        i => i.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({
          productId,
          name: product.name,
          price: product.price
        });
      }

      await cart.save();
    }

    return new Response(JSON.stringify({ message: "Added to cart", cart }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
