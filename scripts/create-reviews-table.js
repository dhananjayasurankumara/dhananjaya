// @ts-nocheck
const { neon } = require('@neondatabase/serverless');

const db = neon('postgresql://neondb_owner:npg_VucFt10lXTHs@ep-falling-river-a44rzaff-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function run() {
    const result = await db`
        CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL UNIQUE,
            user_name TEXT NOT NULL,
            user_avatar TEXT,
            rating INTEGER NOT NULL DEFAULT 5,
            body TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `;
    console.log('Done:', result);
}

run().catch(e => { console.error(e); process.exit(1); });
