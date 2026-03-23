import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { portfolioUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        // Check if email already exists
        const [existing] = await db.select().from(portfolioUsers).where(eq(portfolioUsers.email, email)).limit(1);
        if (existing) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const [newUser] = await db.insert(portfolioUsers).values({
            name,
            email,
            passwordHash,
            role: 'user',
        }).returning();

        // Create session
        const session = await getSession();
        session.id = newUser.id;
        session.email = newUser.email ?? email;
        session.name = newUser.name ?? name;
        session.role = newUser.role ?? 'user';
        session.isLoggedIn = true;
        await session.save();

        return NextResponse.json({ id: newUser.id, name: newUser.name, email: newUser.email });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
