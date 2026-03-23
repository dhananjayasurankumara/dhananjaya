import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { portfolioUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/session';

export async function GET() {
    try {
        const session = await getSession();
        if (!session.isLoggedIn) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let user;
        if (session.id) {
            [user] = await db.select({
                id: portfolioUsers.id,
                name: portfolioUsers.name,
                email: portfolioUsers.email,
                avatar: portfolioUsers.avatar,
                bio: portfolioUsers.bio,
                role: portfolioUsers.role,
                createdAt: portfolioUsers.createdAt,
            }).from(portfolioUsers).where(eq(portfolioUsers.id, Number(session.id))).limit(1);
        }
        
        // Fallback: look up by email if ID lookup missed
        if (!user && session.email) {
            [user] = await db.select({
                id: portfolioUsers.id,
                name: portfolioUsers.name,
                email: portfolioUsers.email,
                avatar: portfolioUsers.avatar,
                bio: portfolioUsers.bio,
                role: portfolioUsers.role,
                createdAt: portfolioUsers.createdAt,
            }).from(portfolioUsers).where(eq(portfolioUsers.email, session.email!)).limit(1);
        }

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Profile GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session.isLoggedIn || !session.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, bio, avatar } = await req.json();
        const updateData: Record<string, string> = {};
        if (name) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (avatar !== undefined) updateData.avatar = avatar;

        const [updated] = await db
            .update(portfolioUsers)
            .set(updateData)
            .where(eq(portfolioUsers.id, Number(session.id)))
            .returning();

        if (name) {
            session.name = name;
            await session.save();
        }

        return NextResponse.json({
            id: updated.id,
            name: updated.name,
            email: updated.email,
            avatar: updated.avatar,
            bio: updated.bio,
        });
    } catch (error) {
        console.error('Profile PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
