import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/session';

async function requireAdmin(req: NextRequest) {
    const session = await getSession();
    if (!session.isLoggedIn || session.role !== 'admin') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    return null;
}

export async function GET(req: NextRequest) {
    const err = await requireAdmin(req);
    if (err) return err;
    const allProducts = await db.select().from(products);
    return NextResponse.json(allProducts);
}

export async function POST(req: NextRequest) {
    const err = await requireAdmin(req);
    if (err) return err;
    const body = await req.json();
    const [product] = await db.insert(products).values(body).returning();
    return NextResponse.json(product);
}

export async function PUT(req: NextRequest) {
    const err = await requireAdmin(req);
    if (err) return err;
    const { id, ...data } = await req.json();
    const [product] = await db.update(products).set(data).where(eq(products.id, id)).returning();
    return NextResponse.json(product);
}

export async function DELETE(req: NextRequest) {
    const err = await requireAdmin(req);
    if (err) return err;
    const { id } = await req.json();
    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true });
}
