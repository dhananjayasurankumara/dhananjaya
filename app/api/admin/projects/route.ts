import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { sessionOptions, SessionData } from '@/lib/session';
import { eq } from 'drizzle-orm';

async function requireAuth() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) throw new Error('Unauthorized');
}

export async function GET() {
    const rows = await db.select().from(projects).orderBy(projects.createdAt);
    return NextResponse.json(rows);
}

export async function POST(req: Request) {
    try {
        await requireAuth();
        const data = await req.json();
        const result = await db.insert(projects).values(data).returning();
        return NextResponse.json(result[0]);
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}

export async function DELETE(req: Request) {
    try {
        await requireAuth();
        const { id } = await req.json();
        await db.delete(projects).where(eq(projects.id, id));
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}

export async function PUT(req: Request) {
    try {
        await requireAuth();
        const { id, ...data } = await req.json();
        await db.update(projects).set(data).where(eq(projects.id, id));
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}
