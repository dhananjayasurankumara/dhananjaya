const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { pgTable, serial, text, timestamp } = require('drizzle-orm/pg-core');
const { eq } = require('drizzle-orm');

const DATABASE_URL ="postgresql://neondb_owner:npg_nsv1Euo6Utdq@ep-rough-frog-ad9xp8q3-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
});

async function test() {
    try {
        const sql = neon(DATABASE_URL);
        const db = drizzle(sql);
        console.log('Connecting to DB...');
        const result = await db.select().from(users).limit(1);
        console.log('Success! Result:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('DB Error:', err.message);
        console.error(err.stack);
    }
}

test();
