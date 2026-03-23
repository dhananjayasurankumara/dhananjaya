import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, cartItems, products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session.isLoggedIn || !session.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get cart
    const cart = await db.select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        title: products.title,
        price: products.price,
    })
        .from(cartItems)
        .where(eq(cartItems.userId, session.id))
        .leftJoin(products, eq(cartItems.productId, products.id));

    if (cart.length === 0) {
        return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const items = cart.map(c => ({ productId: c.productId, title: c.title, qty: c.quantity, price: c.price }));
    const total = items.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);

    const [order] = await db.insert(orders).values({
        userId: session.id,
        items: JSON.stringify(items),
        total,
        status: 'pending',
    }).returning();

    // Clear cart
    await db.delete(cartItems).where(eq(cartItems.userId, session.id));

    return NextResponse.json(order);
}

export async function GET() {
    const session = await getSession();
    if (!session.isLoggedIn || !session.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userOrders = await db.select().from(orders).where(eq(orders.userId, session.id));
    return NextResponse.json(userOrders);
}
