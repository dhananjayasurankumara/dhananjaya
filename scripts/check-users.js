const { neon } = require('@neondatabase/serverless');

const sql = neon('postgresql://neondb_owner:npg_VucFt10lXTHs@ep-falling-river-a44rzaff-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function run() {
    const users = await sql`SELECT id, name, email, role FROM portfolio_users`;
    console.log('Current Users:', JSON.stringify(users, null, 2));
}

run().catch(console.error);
