import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { portfolioUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/session';

async function requireAdmin() {
    const session = await getSession();
    if (!session.isLoggedIn || session.role !== 'admin') return null;
    return session;
}

// GET /api/admin/users — list all users (with password hash for admin viewing)
export async function GET() {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    try {
        const allUsers = await db.select({
            id: portfolioUsers.id,
            name: portfolioUsers.name,
            email: portfolioUsers.email,
            role: portfolioUsers.role,
            bio: portfolioUsers.bio,
            avatar: portfolioUsers.avatar,
            passwordHash: portfolioUsers.passwordHash,
            createdAt: portfolioUsers.createdAt,
        }).from(portfolioUsers).orderBy(portfolioUsers.createdAt);
        return NextResponse.json(allUsers);
    } catch (err) {
        console.error('Admin users GET error:', err);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// PUT /api/admin/users — update user (name, email, role, password)
export async function PUT(req: NextRequest) {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    try {
        const { id, name, email, role, newPassword, bio } = await req.json();
        if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

        const updateData: Record<string, unknown> = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;
        if (bio !== undefined) updateData.bio = bio;
        if (newPassword && newPassword.length >= 6) {
            updateData.passwordHash = await bcrypt.hash(newPassword, 12);
        }

        const [updated] = await db
            .update(portfolioUsers)
            .set(updateData)
            .where(eq(portfolioUsers.id, Number(id)))
            .returning();

        return NextResponse.json({ success: true, user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role } });
    } catch (err) {
        console.error('Admin users PUT error:', err);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// POST /api/admin/users — create a new user
export async function POST(req: NextRequest) {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    try {
        const { name, email, password, role } = await req.json();
        if (!name || !email || !password) return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 });

        const passwordHash = await bcrypt.hash(password, 12);
        const [newUser] = await db.insert(portfolioUsers).values({
            name, email, passwordHash, role: role || 'user'
        }).returning();

        return NextResponse.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
    } catch (err) {
        console.error('Admin users POST error:', err);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

// DELETE /api/admin/users
export async function DELETE(req: NextRequest) {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    try {
        const { id } = await req.json();
        await db.delete(portfolioUsers).where(eq(portfolioUsers.id, Number(id)));
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Admin users DELETE error:', err);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
