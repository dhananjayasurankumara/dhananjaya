const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);

async function run() {
    console.log('🚀 Direct SQL Seeding...');
    try {
        // Presence Links
        await sql`
            INSERT INTO presence_links (name, platform_id, tagline, url)
            VALUES 
                ('Instagram', 'instagram', 'Visual Influence', 'https://instagram.com/dhananjaya'),
                ('Behance', 'behance', 'Creative Portfolio', 'https://behance.net/dhananjaya'),
                ('Dribbble', 'dribbble', 'Design Inspiration', 'https://dribbble.com/dhananjaya'),
                ('TikTok', 'tiktok', 'Trend-Driven Motion', 'https://tiktok.com/@dhananjaya'),
                ('YouTube', 'youtube', 'Moving Stories', 'https://youtube.com/@dhananjaya'),
                ('LinkedIn', 'linkedin', 'Executive Networking', 'https://linkedin.com/in/dhananjaya'),
                ('GitHub', 'github', 'Code Mastery', 'https://github.com/dhananjaya'),
                ('Facebook', 'facebook', 'Social Ecosystem', 'https://facebook.com/dhananjaya'),
                ('X', 'x', 'Real-time Authority', 'https://x.com/dhananjaya'),
                ('Telegram', 'telegram', 'Encrypted Networks', 'https://t.me/dhananjaya'),
                ('WhatsApp', 'whatsapp', 'Instant Communication', 'https://wa.me/94702096510'),
                ('Fiverr', 'fiverr', 'Global Freelancing', 'https://fiverr.com/dhananjaya'),
                ('Upwork', 'upwork', 'Enterprise Solutions', 'https://upwork.com/users/~dhananjaya'),
                ('PeoplePerHour', 'pph', 'Hourly Innovation', 'https://peopleperhour.com/freelancer/dhananjaya')
            ON CONFLICT DO NOTHING;
        `;
        console.log('✅ Presence links seeded');

        // Technical Skills
        await sql`
            INSERT INTO technical_skills (name, type)
            VALUES 
                ('JavaScript', 'Language'),
                ('TypeScript', 'Language'),
                ('React', 'Framework'),
                ('Next.js', 'Framework'),
                ('GSAP', 'Motion'),
                ('Three.js', '3D / WebGL'),
                ('Tailwind CSS', 'CSS'),
                ('Figma', 'Design'),
                ('Photoshop', 'Design'),
                ('After Effects', 'Motion'),
                ('Illustrator', 'Vector'),
                ('Node.js', 'Backend'),
                ('PostgreSQL', 'Database'),
                ('Drizzle ORM', 'Database')
            ON CONFLICT DO NOTHING;
        `;
        console.log('✅ Technical skills seeded');

        // Projects
        await sql`
            INSERT INTO projects (title, tags, description, image_url, featured)
            VALUES 
                ('Precision Timepiece', 'Motion Branding / GSAP', 'A cinematic brand identity built around the art of precision engineering.', '/images/project-1.png', true),
                ('Architectural Void', 'Visual Identity / Editorial', 'Minimal editorial design exploring negative space and typographic tension.', '/images/project-2.png', true),
                ('Technological Glow', 'Cinematic Design / WebGL', 'An immersive WebGL experience that blurs the line between art and technology.', '/images/project-3.png', true)
            ON CONFLICT DO NOTHING;
        `;
        console.log('✅ Projects seeded');

        // Core Sections (limited to 1 row each)
        await sql`INSERT INTO hero_content (headline, subheadline, cta_text) VALUES ('DESIGNING VISUAL STORIES.', 'DEVELOPING DIGITAL EXPERIENCES.', 'Let''s Talk') ON CONFLICT DO NOTHING;`;
        await sql`INSERT INTO about_content (title, bio, stat1_label, stat1_value, stat2_label, stat2_value, stat3_label, stat3_value) VALUES ('Architect of Digital Experiences', 'I am a graphic designer and creative developer crafting high-fidelity digital experiences that merge aesthetic precision with technical mastery.', 'Years Experience', '5+', 'Projects Completed', '50+', 'Clients Worldwide', '20+') ON CONFLICT DO NOTHING;`;
        await sql`INSERT INTO philosophy_content (label, line1, line2, bio) VALUES ('Digital Alchemy / Creative Engineering', 'I don''t just build pixels.', 'I architect digital souls.', 'Architecture is the silence between the code. I operate at the intersection of aesthetic authority and technical precision.') ON CONFLICT DO NOTHING;`;
        await sql`INSERT INTO site_settings (logo_text, email, whatsapp, theme_color) VALUES ('DANANJAYA', 'dhananjayasurankumara@gmail.com', '94702096510', '#ff3333') ON CONFLICT DO NOTHING;`;

        console.log('✨ Database Seeded Successfully!');
        process.exit(0);
    } catch (e) {
        console.error('❌ Seeding Error:', e);
        process.exit(1);
    }
}

run();
