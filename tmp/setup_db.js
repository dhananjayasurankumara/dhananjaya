const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = "postgresql://neondb_owner:npg_nsv1Euo6Utdq@ep-rough-frog-ad9xp8q3-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function setup() {
    const sql = neon(DATABASE_URL);
    try {
        console.log('Creating portfolio_users table...');
        await sql`
            CREATE TABLE IF NOT EXISTS portfolio_users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                avatar TEXT,
                bio TEXT,
                role TEXT DEFAULT 'user',
                created_at TIMESTAMP DEFAULT NOW()
            )
        `;
        console.log('✓ portfolio_users table ready');

        console.log('Creating products table...');
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL DEFAULT 0,
                image_url TEXT,
                category TEXT,
                stock INTEGER DEFAULT 0,
                featured BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;
        console.log('✓ products table ready');

        console.log('Creating orders table...');
        await sql`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                items TEXT NOT NULL,
                total REAL NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT NOW()
            )
        `;
        console.log('✓ orders table ready');

        console.log('Creating cart_items table...');
        await sql`
            CREATE TABLE IF NOT EXISTS cart_items (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `;
        console.log('✓ cart_items table ready');

        console.log('\nAll tables created successfully!');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

setup();
