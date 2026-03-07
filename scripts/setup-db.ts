// Database setup script — creates all tables and seeds the admin user
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL!;
const sql = neon(DATABASE_URL);

async function setup() {
    console.log('🔧 Creating database tables...');

    // Create all tables
    await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id serial PRIMARY KEY,
      username text UNIQUE NOT NULL,
      password text NOT NULL,
      created_at timestamp DEFAULT now()
    )
  `;

    await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      id serial PRIMARY KEY,
      logo_text text DEFAULT 'DANANJAYA',
      email text DEFAULT 'dhananjayasurankumara@gmail.com',
      whatsapp text DEFAULT '94702096510',
      linkedin text DEFAULT 'https://linkedin.com/in/dananjaya-suran-kumara',
      updated_at timestamp DEFAULT now()
    )
  `;

    await sql`
    CREATE TABLE IF NOT EXISTS hero_content (
      id serial PRIMARY KEY,
      headline text DEFAULT 'DESIGNING VISUAL STORIES.',
      subheadline text DEFAULT 'DEVELOPING DIGITAL EXPERIENCES.',
      cta_text text DEFAULT 'Let''s Talk',
      updated_at timestamp DEFAULT now()
    )
  `;

    await sql`
    CREATE TABLE IF NOT EXISTS about_content (
      id serial PRIMARY KEY,
      title text DEFAULT 'Architect of Digital Experiences',
      bio text DEFAULT 'I am a graphic designer and creative developer crafting high-fidelity digital experiences.',
      stat1_label text DEFAULT 'Years Experience',
      stat1_value text DEFAULT '5+',
      stat2_label text DEFAULT 'Projects Completed',
      stat2_value text DEFAULT '50+',
      stat3_label text DEFAULT 'Clients Worldwide',
      stat3_value text DEFAULT '20+',
      updated_at timestamp DEFAULT now()
    )
  `;

    await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id serial PRIMARY KEY,
      title text NOT NULL,
      description text,
      tags text,
      link text,
      image_url text,
      featured boolean DEFAULT false,
      created_at timestamp DEFAULT now()
    )
  `;

    await sql`
    CREATE TABLE IF NOT EXISTS contacts (
      id serial PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL,
      message text NOT NULL,
      created_at timestamp DEFAULT now()
    )
  `;

    console.log('✅ All tables created!');

    // Seed default data
    await sql`INSERT INTO site_settings (logo_text, email, whatsapp, linkedin) VALUES ('DANANJAYA', 'dhananjayasurankumara@gmail.com', '94702096510', 'https://linkedin.com/in/dananjaya-suran-kumara') ON CONFLICT DO NOTHING`;

    await sql`INSERT INTO hero_content (headline, subheadline, cta_text) VALUES ('DESIGNING VISUAL STORIES.', 'DEVELOPING DIGITAL EXPERIENCES.', 'Let''s Talk') ON CONFLICT DO NOTHING`;

    await sql`INSERT INTO about_content (title, bio, stat1_label, stat1_value, stat2_label, stat2_value, stat3_label, stat3_value) VALUES ('Architect of Digital Experiences', 'A creative force dedicated to the art of digital storytelling. With a foundation in graphic design and a passion for modern web technologies, I bridge the gap between imagination and execution.', 'Years Experience', '5+', 'Projects Completed', '50+', 'Clients Worldwide', '20+') ON CONFLICT DO NOTHING`;

    console.log('✅ Default content seeded!');

    // Create admin user
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = await bcrypt.hash(password, 12);

    await sql`INSERT INTO admin_users (username, password) VALUES (${username}, ${hash}) ON CONFLICT (username) DO NOTHING`;

    console.log(`✅ Admin user created! Username: ${username} | Password: ${password}`);
    console.log('');
    console.log('🎉 Database setup complete! Visit /admin to log in.');
    process.exit(0);
}

setup().catch(e => { console.error('❌ Setup failed:', e); process.exit(1); });
