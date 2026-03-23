import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getSession } from '@/lib/session';

const sql = neon(process.env.DATABASE_URL!);

async function requireAdmin() {
    const session = await getSession();
    return session.isLoggedIn && session.role === 'admin';
}

// GET — list all commands
export async function GET() {
    const ok = await requireAdmin();
    if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    try {
        const commands = await sql`SELECT * FROM chatbot_commands ORDER BY category, trigger`;
        return NextResponse.json(commands);
    } catch {
        return NextResponse.json({ error: 'Table not found' }, { status: 500 });
    }
}

// POST — create command
export async function POST(req: NextRequest) {
    const ok = await requireAdmin();
    if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { trigger, response, category } = await req.json();
    if (!trigger || !response) return NextResponse.json({ error: 'Trigger and response required' }, { status: 400 });

    const [cmd] = await sql`
        INSERT INTO chatbot_commands (trigger, response, category)
        VALUES (${trigger.toLowerCase()}, ${response}, ${category || 'general'})
        RETURNING *
    `;
    return NextResponse.json(cmd);
}

// PUT — update command
export async function PUT(req: NextRequest) {
    const ok = await requireAdmin();
    if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id, trigger, response, category, active } = await req.json();
    const [cmd] = await sql`
        UPDATE chatbot_commands 
        SET trigger=${trigger}, response=${response}, category=${category || 'general'}, active=${active ?? true}
        WHERE id=${id}
        RETURNING *
    `;
    return NextResponse.json(cmd);
}

// DELETE — remove command
export async function DELETE(req: NextRequest) {
    const ok = await requireAdmin();
    if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await req.json();
    await sql`DELETE FROM chatbot_commands WHERE id=${id}`;
    return NextResponse.json({ success: true });
}
