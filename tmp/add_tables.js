// Use native fetch so we don't need ESM
const https = require('https');

const DATABASE_URL = "postgresql://neondb_owner:npg_nsv1Euo6Utdq@ep-rough-frog-ad9xp8q3-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Use the @neondatabase/serverless package with require
try {
    const { neon } = require('@neondatabase/serverless');
    const sql = neon(DATABASE_URL);

    async function run() {
        await sql`
            CREATE TABLE IF NOT EXISTS chatbot_commands (
                id SERIAL PRIMARY KEY,
                trigger TEXT NOT NULL,
                response TEXT NOT NULL,
                category TEXT DEFAULT 'general',
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `;
        console.log('✓ chatbot_commands table created');

        const existing = await sql`SELECT COUNT(*) as cnt FROM chatbot_commands`;
        if (parseInt(existing[0].cnt) === 0) {
            await sql`INSERT INTO chatbot_commands (trigger, response, category) VALUES
                (${'hello'}, ${"Hi! I'm Dananjaya's portfolio assistant. How can I help you?"}, ${'greeting'}),
                (${'contact'}, ${'You can reach Dananjaya at dhananjayasurankumara@gmail.com or via WhatsApp.'}, ${'info'}),
                (${'services'}, ${'I offer graphic design, creative development, and digital experiences.'}, ${'info'}),
                (${'hire'}, ${"I'm available for freelance projects! Please use the contact form to reach out."}, ${'business'})
            `;
            console.log('✓ Seeded default commands');
        }
        console.log('Done!');
    }
    run().catch(e => console.error('Error:', e.message));
} catch(e) {
    console.error('Require error:', e.message);
}
