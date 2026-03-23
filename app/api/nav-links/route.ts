import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = () => neon(process.env.DATABASE_URL!);

// Public endpoint — no auth required. Returns only active nav links.
export async function GET() {
    try {
        const links = await sql()`
            SELECT id, label, href, type, display_order AS "displayOrder"
            FROM nav_links
            WHERE active = true
            ORDER BY display_order ASC
        `;
        return NextResponse.json(links);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}
