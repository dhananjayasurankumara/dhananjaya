import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { portfolioUsers } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const users = await db.select({
            id: portfolioUsers.id,
            name: portfolioUsers.name,
            email: portfolioUsers.email,
            role: portfolioUsers.role,
        }).from(portfolioUsers);

        return NextResponse.json({
            status: 'ok',
            database_connected: true,
            user_count: users.length,
            users: users.map(u => ({
                name: u.name,
                email_masked: u.email.replace(/(.).*(@.*)/, '$1***$2'),
                role: u.role
            }))
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            database_connected: false,
            error: error.message
        }, { status: 500 });
    }
}
