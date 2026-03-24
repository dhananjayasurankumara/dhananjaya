import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reviews } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/session';

async function requireAdmin() {
    const session = await getSession();
    if (!session.isLoggedIn || session.role !== 'admin') return null;
    return session;
}

// GET — all reviews (admin)
export async function GET() {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const data = await db.select().from(reviews).orderBy(reviews.createdAt);
        return NextResponse.json(data);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}

// DELETE — delete any review by id (admin)
export async function DELETE(req: NextRequest) {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        await db.delete(reviews).where(eq(reviews.id, id));
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
