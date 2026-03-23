import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
    siteSettings, heroContent, aboutContent,
    philosophyContent, technicalSkills, presenceLinks, supportItems, projects
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/session';

async function requireAdmin(req: NextRequest) {
    const session = await getSession();
    if (!session.isLoggedIn || session.role !== 'admin') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    return null;
}

const tableMap: Record<string, any> = {
    siteSettings,
    heroContent,
    aboutContent,
    philosophyContent,
    technicalSkills,
    presenceLinks,
    supportItems,
    projects,
};

export async function GET(req: NextRequest) {
    const err = await requireAdmin(req);
    if (err) return err;
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');

    if (section && tableMap[section]) {
        const data = await db.select().from(tableMap[section]);
        return NextResponse.json(data);
    }

    // Return all sections
    const [hero, about, settings, philosophy, skills, presence, support, pProjects] = await Promise.all([
        db.select().from(heroContent).limit(1).then(r => r[0]),
        db.select().from(aboutContent).limit(1).then(r => r[0]),
        db.select().from(siteSettings).limit(1).then(r => r[0]),
        db.select().from(philosophyContent).limit(1).then(r => r[0]),
        db.select().from(technicalSkills).orderBy(technicalSkills.order),
        db.select().from(presenceLinks).orderBy(presenceLinks.order),
        db.select().from(supportItems),
        db.select().from(projects),
    ]);
    return NextResponse.json({ hero, about, settings, philosophy, skills, presence, support, projects: pProjects });
}

export async function PUT(req: NextRequest) {
    const err = await requireAdmin(req);
    if (err) return err;
    const { section, id, data } = await req.json();

    const table = tableMap[section];
    if (!table) return NextResponse.json({ error: 'Invalid section' }, { status: 400 });

    const rows = await db.update(table).set(data).where(eq(table.id, id)).returning();
    return NextResponse.json((rows as any[])[0]);
}

export async function POST(req: NextRequest) {
    const err = await requireAdmin(req);
    if (err) return err;
    const { section, data } = await req.json();
    const table = tableMap[section];
    if (!table) return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    const rows = await db.insert(table).values(data).returning();
    return NextResponse.json((rows as any[])[0]);
}

export async function DELETE(req: NextRequest) {
    const err = await requireAdmin(req);
    if (err) return err;
    const { section, id } = await req.json();
    const table = tableMap[section];
    if (!table) return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    await db.delete(table).where(eq(table.id, id));
    return NextResponse.json({ success: true });
}
