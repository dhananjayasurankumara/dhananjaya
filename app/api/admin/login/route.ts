import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { portfolioUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (
            username !== process.env.ADMIN_USERNAME ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
        }

        const adminEmail = 'ohansani@portfolio.local';

        // Find or create the admin user in portfolio_users
        let [adminUser] = await db
            .select()
            .from(portfolioUsers)
            .where(eq(portfolioUsers.email, adminEmail))
            .limit(1);

        if (!adminUser) {
            const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 12);
            [adminUser] = await db.insert(portfolioUsers).values({
                name: 'OHansani',
                email: adminEmail,
                passwordHash,
                role: 'admin',
                bio: 'Portfolio Administrator',
            }).returning();
        }

        const session = await getSession();
        session.id = adminUser.id;
        session.email = adminUser.email ?? adminEmail;
        session.name = adminUser.name ?? 'OHansani';
        session.role = 'admin';
        session.isLoggedIn = true;
        await session.save();

        return NextResponse.json({
            success: true,
            name: adminUser.name,
            role: 'admin',
            id: adminUser.id,
        });
    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
