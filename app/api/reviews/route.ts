import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reviews } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

// Helper: get current session user
async function getMe() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('portfolio_token')?.value;
        if (!token) return null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/me`, {
            headers: { Cookie: `portfolio_token=${token}` },
        });
        if (!res.ok) return null;
        return await res.json();
    } catch { return null; }
}

// GET — all reviews (public)
export async function GET() {
    try {
        const data = await db.select().from(reviews).orderBy(reviews.createdAt);
        return NextResponse.json(data);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}

// POST — create or upsert review
export async function POST(req: NextRequest) {
    const user = await getMe();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { rating, body } = await req.json();
    if (!body?.trim()) return NextResponse.json({ error: 'Review text required' }, { status: 400 });
    if (rating < 1 || rating > 5) return NextResponse.json({ error: 'Rating 1-5 required' }, { status: 400 });

    try {
        // Check if user already has a review
        const existing = await db.select().from(reviews).where(eq(reviews.userId, user.id)).limit(1);
        if (existing.length > 0) {
            // Update
            await db.update(reviews)
                .set({ rating, body: body.trim(), updatedAt: new Date() })
                .where(eq(reviews.userId, user.id));
        } else {
            // Insert
            await db.insert(reviews).values({
                userId: user.id,
                userName: user.name,
                userAvatar: user.avatar ?? null,
                rating,
                body: body.trim(),
            });
        }
        const updated = await db.select().from(reviews).where(eq(reviews.userId, user.id)).limit(1);
        return NextResponse.json(updated[0]);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// DELETE — delete own review
export async function DELETE() {
    const user = await getMe();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await db.delete(reviews).where(eq(reviews.userId, user.id));
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
