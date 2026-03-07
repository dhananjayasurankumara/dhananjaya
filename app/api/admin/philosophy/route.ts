import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { philosophyContent } from '@/lib/db/schema';
import { sessionOptions, SessionData } from '@/lib/session';

async function requireAuth() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) throw new Error('Unauthorized');
}

export async function GET() {
    const rows = await db.select().from(philosophyContent).limit(1);
    return NextResponse.json(rows[0] || {});
}

export async function PUT(req: Request) {
    try {
        await requireAuth();
        const data = await req.json();
        const existing = await db.select().from(philosophyContent).limit(1);

        if (existing.length === 0) {
            await db.insert(philosophyContent).values({ ...data, updatedAt: new Date() });
        } else {
            await db.update(philosophyContent).set({ ...data, updatedAt: new Date() });
        }
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}
