// Run this ONCE after setting DATABASE_URL to create the admin user
// Command: DATABASE_URL="your_neon_url" npx tsx scripts/seed-admin.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import bcrypt from 'bcryptjs';
import * as schema from '../lib/db/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = await bcrypt.hash(password, 12);

    await db.insert(schema.adminUsers).values({ username, password: hash }).onConflictDoNothing();
    console.log(`✅ Admin user '${username}' created. Password: ${password}`);
    process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
