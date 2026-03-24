const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

const sql = neon('postgresql://neondb_owner:npg_VucFt10lXTHs@ep-falling-river-a44rzaff-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function check() {
    const email = 'admin@dhananjaya.me';
    const password = 'OHansani@1114';
    
    // 1. Get user from DB
    const [user] = await sql`SELECT * FROM portfolio_users WHERE email = ${email}`;
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) return;
    
    // 2. Compare password
    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log('Password valid:', isValid ? 'Yes' : 'No');
    
    // 3. Check name
    console.log('User Name:', user.name);
}

check().catch(console.error);
