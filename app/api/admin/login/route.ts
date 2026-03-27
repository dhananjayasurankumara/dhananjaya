import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { portfolioUsers } from '@/lib/db/schema';
import { eq, or, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json(); // 'username' field from UI

        if (!username || !password) {
            return NextResponse.json({ error: 'Identification and password are required' }, { status: 400 });
        }

        // Automate seeding if empty (including admin user)
        await (await import('@/lib/db/seed')).ensureDefaults();

        // Find user by email OR name (case-insensitive)
        const identification = username.trim();
        const [user] = await db.select().from(portfolioUsers)
            .where(
                or(
                    eq(portfolioUsers.email, identification.toLowerCase()),
                    sql`LOWER(${portfolioUsers.name}) = ${identification.toLowerCase()}`
                )
            ).limit(1);

        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid identification or password' }, { status: 401 });
        }

        const session = await getSession();
        session.id = user.id;
        session.email = user.email;
        session.name = user.name;
        session.role = 'admin';
        session.isLoggedIn = true;
        await session.save();

        return NextResponse.json({
            success: true,
            name: user.name,
            role: 'admin',
            id: user.id,
        });
    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
