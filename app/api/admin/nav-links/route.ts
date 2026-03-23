import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getSession } from '@/lib/session';

const sql = () => neon(process.env.DATABASE_URL!);

async function requireAdmin() {
    const session = await getSession();
    return session.isLoggedIn && session.role === 'admin';
}

export async function GET() {
    const ok = await requireAdmin();
    if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    try {
        const links = await sql()`SELECT * FROM nav_links ORDER BY display_order`;
        return NextResponse.json(links);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(req: NextRequest) {
    const ok = await requireAdmin();
    if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { label, href, type, display_order } = await req.json();
    const [link] = await sql()`
        INSERT INTO nav_links (label, href, type, display_order)
        VALUES (${label}, ${href}, ${type || 'internal'}, ${display_order || 0})
        RETURNING *
    `;
    return NextResponse.json(link);
}

export async function PUT(req: NextRequest) {
    const ok = await requireAdmin();
    if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id, label, href, type, display_order, active } = await req.json();
    const [link] = await sql()`
        UPDATE nav_links SET label=${label}, href=${href}, type=${type}, display_order=${display_order}, active=${active}
        WHERE id=${id} RETURNING *
    `;
    return NextResponse.json(link);
}

export async function DELETE(req: NextRequest) {
    const ok = await requireAdmin();
    if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await req.json();
    await sql()`DELETE FROM nav_links WHERE id=${id}`;
    return NextResponse.json({ success: true });
}
