import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';

export async function GET() {
    try {
        const data = await db.select().from(projects);
        return NextResponse.json(data);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}
