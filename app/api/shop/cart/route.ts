import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cartItems, products } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/session';

export async function GET() {
    const session = await getSession();
    if (!session.isLoggedIn || !session.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = Number(session.id);
    const items = await db.select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        title: products.title,
        price: products.price,
        imageUrl: products.imageUrl,
    })
        .from(cartItems)
        .where(eq(cartItems.userId, userId))
        .leftJoin(products, eq(cartItems.productId, products.id));
    return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session.isLoggedIn || !session.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = Number(session.id);
    const { productId, quantity = 1 } = await req.json();

    const existing = await db.select().from(cartItems)
        .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))).limit(1);

    if (existing.length > 0) {
        const rows = await db.update(cartItems)
            .set({ quantity: existing[0].quantity + quantity })
            .where(eq(cartItems.id, existing[0].id)).returning();
        return NextResponse.json((rows as any[])[0]);
    }

    const rows = await db.insert(cartItems).values({ userId, productId, quantity }).returning();
    return NextResponse.json((rows as any[])[0]);
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session.isLoggedIn || !session.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = Number(session.id);
    const { cartItemId } = await req.json();
    await db.delete(cartItems).where(and(eq(cartItems.id, cartItemId), eq(cartItems.userId, userId)));
    return NextResponse.json({ success: true });
}
