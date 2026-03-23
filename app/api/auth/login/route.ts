import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { portfolioUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const [user] = await db.select().from(portfolioUsers).where(eq(portfolioUsers.email, email)).limit(1);
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const session = await getSession();
        session.id = user.id;
        session.email = user.email ?? email;
        session.name = user.name ?? '';
        session.role = user.role ?? 'user';
        session.isLoggedIn = true;
        await session.save();

        return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
