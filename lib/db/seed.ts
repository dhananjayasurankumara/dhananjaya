import { db } from './index';
import {
    presenceLinks, technicalSkills, projects,
    heroContent, aboutContent, philosophyContent, siteSettings
} from './schema';

export async function ensureDefaults() {
    try {
        // 1. Presence Links
        const existingPresence = await db.select().from(presenceLinks);
        if (existingPresence.length === 0) {
            const defaultPlatforms = [
                { name: 'Instagram',     platformId: 'instagram', tagline: 'Visual Influence',       url: 'https://instagram.com/dhananjaya' },
                { name: 'Behance',       platformId: 'behance',   tagline: 'Creative Portfolio',     url: 'https://behance.net/dhananjaya' },
                { name: 'Dribbble',      platformId: 'dribbble',  tagline: 'Design Inspiration',     url: 'https://dribbble.com/dhananjaya' },
                { name: 'TikTok',        platformId: 'tiktok',    tagline: 'Trend-Driven Motion',    url: 'https://tiktok.com/@dhananjaya' },
                { name: 'YouTube',       platformId: 'youtube',   tagline: 'Moving Stories',         url: 'https://youtube.com/@dhananjaya' },
                { name: 'LinkedIn',      platformId: 'linkedin',  tagline: 'Executive Networking',   url: 'https://linkedin.com/in/dhananjaya' },
                { name: 'GitHub',        platformId: 'github',    tagline: 'Code Mastery',           url: 'https://github.com/dhananjaya' },
                { name: 'Facebook',      platformId: 'facebook',  tagline: 'Social Ecosystem',       url: 'https://facebook.com/dhananjaya' },
                { name: 'X',             platformId: 'x',         tagline: 'Real-time Authority',    url: 'https://x.com/dhananjaya' },
                { name: 'Telegram',      platformId: 'telegram',  tagline: 'Encrypted Networks',     url: 'https://t.me/dhananjaya' },
                { name: 'WhatsApp',      platformId: 'whatsapp',  tagline: 'Instant Communication',  url: 'https://wa.me/94702096510' },
                { name: 'Fiverr',        platformId: 'fiverr',    tagline: 'Global Freelancing',     url: 'https://fiverr.com/dhananjaya' },
                { name: 'Upwork',        platformId: 'upwork',    tagline: 'Enterprise Solutions',   url: 'https://upwork.com/users/~dhananjaya' },
                { name: 'PeoplePerHour', platformId: 'pph',       tagline: 'Hourly Innovation',      url: 'https://peopleperhour.com/freelancer/dhananjaya' },
            ];
            await db.insert(presenceLinks).values(defaultPlatforms);
        }

        // 2. Technical Skills
        const existingSkills = await db.select().from(technicalSkills);
        if (existingSkills.length === 0) {
            const defaultTech = [
                { name: 'JavaScript',   type: 'Language' },
                { name: 'TypeScript',   type: 'Language' },
                { name: 'React',        type: 'Framework' },
                { name: 'Next.js',      type: 'Framework' },
                { name: 'GSAP',         type: 'Motion' },
                { name: 'Three.js',     type: '3D / WebGL' },
                { name: 'Tailwind CSS', type: 'CSS' },
                { name: 'Figma',        type: 'Design' },
                { name: 'Photoshop',    type: 'Design' },
                { name: 'After Effects',type: 'Motion' },
                { name: 'Illustrator',  type: 'Vector' },
                { name: 'Node.js',      type: 'Backend' },
                { name: 'PostgreSQL',   type: 'Database' },
                { name: 'Drizzle ORM',  type: 'Database' },
            ];
            await db.insert(technicalSkills).values(defaultTech);
        }

        // 3. Projects
        const existingProjects = await db.select().from(projects);
        if (existingProjects.length === 0) {
            const defaultProjects = [
                {
                    title: 'Precision Timepiece',
                    tags: 'Motion Branding / GSAP',
                    description: 'A cinematic brand identity built around the art of precision engineering.',
                    imageUrl: '/images/project-1.png',
                    link: '',
                    featured: true,
                },
                {
                    title: 'Architectural Void',
                    tags: 'Visual Identity / Editorial',
                    description: 'Minimal editorial design exploring negative space and typographic tension.',
                    imageUrl: '/images/project-2.png',
                    link: '',
                    featured: true,
                },
                {
                    title: 'Technological Glow',
                    tags: 'Cinematic Design / WebGL',
                    description: 'An immersive WebGL experience that blurs the line between art and technology.',
                    imageUrl: '/images/project-3.png',
                    link: '',
                    featured: true,
                },
            ];
            await db.insert(projects).values(defaultProjects);
        }

        // 4. Hero Content
        const existingHero = await db.select().from(heroContent);
        if (existingHero.length === 0) {
            await db.insert(heroContent).values({
                headline: 'DESIGNING VISUAL STORIES.',
                subheadline: 'DEVELOPING DIGITAL EXPERIENCES.',
                ctaText: "Let's Talk"
            });
        }

        // 5. About Content
        const existingAbout = await db.select().from(aboutContent);
        if (existingAbout.length === 0) {
            await db.insert(aboutContent).values({
                title: 'Architect of Digital Experiences',
                bio: 'I am a graphic designer and creative developer crafting high-fidelity digital experiences that merge aesthetic precision with technical mastery.',
                stat1Label: 'Years Experience', stat1Value: '5+',
                stat2Label: 'Projects Completed', stat2Value: '50+',
                stat3Label: 'Clients Worldwide', stat3Value: '20+'
            });
        }

        // 6. Philosophy
        const existingPhilo = await db.select().from(philosophyContent);
        if (existingPhilo.length === 0) {
            await db.insert(philosophyContent).values({
                label: 'Digital Alchemy / Creative Engineering',
                line1: "I don't just build pixels.",
                line2: 'I architect digital souls.',
                bio: 'Architecture is the silence between the code. I operate at the intersection of aesthetic authority and technical precision.'
            });
        }

        // 7. Site Settings
        const existingSettings = await db.select().from(siteSettings);
        if (existingSettings.length === 0) {
            await db.insert(siteSettings).values({
                logoText: 'DANANJAYA',
                email: 'dhananjayasurankumara@gmail.com',
                whatsapp: '94702096510',
                themeColor: '#ff3333'
            });
        }
    } catch (error) {
        console.error('Error ensuring defaults:', error);
    }
}
