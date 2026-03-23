const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

const DATABASE_URL = "postgresql://neondb_owner:npg_nsv1Euo6Utdq@ep-rough-frog-ad9xp8q3-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function verify() {
    const sql = neon(DATABASE_URL);
    try {
        // 1. Verify portfolio_users table exists
        console.log('\n=== 1. Checking portfolio_users table ===');
        const tableCheck = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'portfolio_users'
            ORDER BY ordinal_position
        `;
        if (tableCheck.length === 0) {
            console.log('❌ Table does NOT exist');
        } else {
            console.log('✓ Table exists with columns:');
            tableCheck.forEach(c => console.log(`  - ${c.column_name} (${c.data_type})`));
        }

        // 2. Check existing users
        console.log('\n=== 2. Existing portfolio_users ===');
        const existingUsers = await sql`SELECT id, name, email, role FROM portfolio_users LIMIT 5`;
        if (existingUsers.length === 0) {
            console.log('  (no users yet)');
        } else {
            existingUsers.forEach(u => console.log(`  - [${u.id}] ${u.name} <${u.email}> (${u.role})`));
        }

        // 3. Test inserting admin user
        console.log('\n=== 3. Testing admin user upsert ===');
        const passwordHash = await bcrypt.hash('OHansani@1114', 12);
        
        // Check if admin exists
        const [existing] = await sql`SELECT id FROM portfolio_users WHERE email = 'ohansani@portfolio.local' LIMIT 1`;
        
        if (existing) {
            console.log(`✓ Admin already exists with id: ${existing.id}`);
        } else {
            const [inserted] = await sql`
                INSERT INTO portfolio_users (name, email, password_hash, role, bio)
                VALUES ('OHansani', 'ohansani@portfolio.local', ${passwordHash}, 'admin', 'Portfolio Administrator')
                RETURNING id, name, email
            `;
            console.log(`✓ Admin created with id: ${inserted.id}`);
        }

        console.log('\n=== All checks passed! ===\n');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

verify();
