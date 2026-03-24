import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { portfolioUsers } from '@/lib/db/schema';
import { eq, or, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json(); // 'email' field in UI can be name or email

        if (!email || !password) {
            return NextResponse.json({ error: 'Identification and password are required' }, { status: 400 });
        }

        // Find by email OR name (case-insensitive for both)
        const identification = email.trim();
        const [user] = await db.select().from(portfolioUsers)
            .where(
                or(
                    eq(portfolioUsers.email, identification.toLowerCase()),
                    sql`LOWER(${portfolioUsers.name}) = ${identification.toLowerCase()}`
                )
            ).limit(1);

        if (!user) {
            console.log('Login failed: Identification not found', identification);
            return NextResponse.json({ error: 'Invalid identification or password' }, { status: 401 });
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
