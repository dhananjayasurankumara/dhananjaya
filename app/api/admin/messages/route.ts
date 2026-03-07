import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { contacts } from '@/lib/db/schema';
import { sessionOptions, SessionData } from '@/lib/session';

export async function GET() {
    try {
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
        if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const rows = await db.select().from(contacts).orderBy(contacts.createdAt);
        return NextResponse.json(rows);
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
