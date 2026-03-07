import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { sessionOptions, SessionData } from '@/lib/session';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const users = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
        const user = users[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
        session.userId = user.id;
        session.username = user.username;
        session.isLoggedIn = true;
        await session.save();

        return NextResponse.json({ success: true, username: user.username });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
