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
        const imgs = await sql()`SELECT * FROM background_images ORDER BY section`;
        return NextResponse.json(imgs);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}

export async function PUT(req: NextRequest) {
    const ok = await requireAdmin();
    if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { section, image_url, overlay_opacity, image_position } = await req.json();
    const [img] = await sql()`
        INSERT INTO background_images (section, image_url, overlay_opacity, image_position, updated_at)
        VALUES (${section}, ${image_url}, ${overlay_opacity ?? 0.5}, ${image_position ?? 'center'}, NOW())
        ON CONFLICT (section) DO UPDATE
        SET image_url=${image_url}, overlay_opacity=${overlay_opacity ?? 0.5}, image_position=${image_position ?? 'center'}, updated_at=NOW()
        RETURNING *
    `;
    return NextResponse.json(img);
}
