import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let query = db.select().from(products);
    const allProducts = await query;
    if (category && category !== 'all') {
        return NextResponse.json(allProducts.filter(p => p.category === category));
    }
    return NextResponse.json(allProducts);
}
