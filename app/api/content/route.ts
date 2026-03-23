import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { backgroundImages, siteSettings } from '@/lib/db/schema';

export async function GET(req: NextRequest) {
    try {
        const bgRes = await db.select().from(backgroundImages);
        const settingsRes = await db.select().from(siteSettings).limit(1);

        return NextResponse.json({
            backgrounds: bgRes,
            settings: settingsRes[0] || null
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch public content' }, { status: 500 });
    }
}
