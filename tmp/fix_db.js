const { neon } = require('@neondatabase/serverless');

const DATABASE_URL ="postgresql://neondb_owner:npg_nsv1Euo6Utdq@ep-rough-frog-ad9xp8q3-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function fixSchema() {
    const sql = neon(DATABASE_URL);
    try {
        console.log('Adding password_hash column...');
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;`;
        console.log('Adding role column...');
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';`;
        console.log('Success!');
    } catch (err) {
        console.error('SQL Error:', err.message);
    }
}

fixSchema();
