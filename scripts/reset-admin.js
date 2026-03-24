const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

const sql = neon('postgresql://neondb_owner:npg_VucFt10lXTHs@ep-falling-river-a44rzaff-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function run() {
    const password = 'OHansani@1114';
    const hash = await bcrypt.hash(password, 10);
    
    // Update OHansani admin user
    const result = await sql`
        UPDATE portfolio_users 
        SET password_hash = ${hash} 
        WHERE email = 'admin@dhananjaya.me'
    `;
    
    console.log('Admin password reset successful:', result);
    
    // Also verify what's there now
    const users = await sql`SELECT name, email, role FROM portfolio_users`;
    console.log('Current Users:', JSON.stringify(users, null, 2));
}

run().catch(console.error);
