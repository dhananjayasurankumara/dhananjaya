import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contacts } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { getSession } from '@/lib/session';

export async function GET() {
    const session = await getSession();
    if (!session.isLoggedIn || session.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const messages = await db.select().from(contacts).orderBy(desc(contacts.createdAt));
        return NextResponse.json(messages);
    } catch (err) {
        console.error('Messages GET error:', err);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}
