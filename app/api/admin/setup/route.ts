import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
    const sql = neon(process.env.DATABASE_URL!);

    await sql`CREATE TABLE IF NOT EXISTS nav_links (
        id SERIAL PRIMARY KEY,
        label TEXT NOT NULL,
        href TEXT NOT NULL,
        type TEXT DEFAULT 'internal',
        display_order INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
    )`;

    const navCount = await sql`SELECT COUNT(*) as cnt FROM nav_links`;
    if (parseInt(navCount[0].cnt) === 0) {
        await sql`INSERT INTO nav_links (label, href, type, display_order) VALUES
            (${'Philosophy'}, ${'#philosophy'}, ${'hash'}, ${1}),
            (${'About'}, ${'#about'}, ${'hash'}, ${2}),
            (${'Tech'}, ${'#tech'}, ${'hash'}, ${3}),
            (${'Work'}, ${'#work'}, ${'hash'}, ${4}),
            (${'Shop'}, ${'/shop'}, ${'internal'}, ${5}),
            (${'Login'}, ${'/login'}, ${'internal'}, ${6})
        `;
    }

    await sql`CREATE TABLE IF NOT EXISTS background_images (
        id SERIAL PRIMARY KEY,
        section TEXT NOT NULL UNIQUE,
        image_url TEXT,
        image_position TEXT DEFAULT 'center',
        overlay_opacity REAL DEFAULT 0.5,
        updated_at TIMESTAMP DEFAULT NOW()
    )`;

    const bgCount = await sql`SELECT COUNT(*) as cnt FROM background_images`;
    if (parseInt(bgCount[0].cnt) === 0) {
        await sql`INSERT INTO background_images (section, image_url, overlay_opacity) VALUES
            (${'hero'}, ${null}, ${0.7}),
            (${'about'}, ${null}, ${0.5}),
            (${'philosophy'}, ${null}, ${0.6}),
            (${'shop'}, ${null}, ${0.5})
        `;
    }

    await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS twitter TEXT`;
    await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS instagram TEXT`;
    await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS github TEXT`;
    await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS phone TEXT`;
    await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS address TEXT`;
    await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS meta_description TEXT`;
    await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS meta_keywords TEXT`;
    await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_text TEXT`;
    await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#ff3333'`;

    return NextResponse.json({ success: true, message: 'All tables created and seeded!' });
}
