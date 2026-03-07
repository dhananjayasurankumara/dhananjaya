import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// Site-wide settings
export const siteSettings = pgTable('site_settings', {
    id: serial('id').primaryKey(),
    logoText: text('logo_text').default('DANANJAYA'),
    email: text('email').default('dhananjayasurankumara@gmail.com'),
    whatsapp: text('whatsapp').default('94702096510'),
    linkedin: text('linkedin').default('https://linkedin.com/in/dananjaya-suran-kumara'),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Hero section
export const heroContent = pgTable('hero_content', {
    id: serial('id').primaryKey(),
    headline: text('headline').default('DESIGNING VISUAL STORIES.'),
    subheadline: text('subheadline').default('DEVELOPING DIGITAL EXPERIENCES.'),
    ctaText: text('cta_text').default("Let's Talk"),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// About section
export const aboutContent = pgTable('about_content', {
    id: serial('id').primaryKey(),
    title: text('title').default('Architect of Digital Experiences'),
    bio: text('bio').default('I am a graphic designer and creative developer crafting high-fidelity digital experiences that merge aesthetic precision with technical mastery.'),
    stat1Label: text('stat1_label').default('Years Experience'),
    stat1Value: text('stat1_value').default('5+'),
    stat2Label: text('stat2_label').default('Projects Completed'),
    stat2Value: text('stat2_value').default('50+'),
    stat3Label: text('stat3_label').default('Clients Worldwide'),
    stat3Value: text('stat3_value').default('20+'),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Projects
export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    tags: text('tags'), // comma-separated
    link: text('link'),
    imageUrl: text('image_url'),
    featured: boolean('featured').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

// Philosophy section
export const philosophyContent = pgTable('philosophy_content', {
    id: serial('id').primaryKey(),
    label: text('label').default('Digital Alchemy / Creative Engineering'),
    line1: text('line1').default("I don't just build pixels."),
    line2: text('line2').default('I architect digital souls.'),
    bio: text('bio').default('Architecture is the silence between the code. I operate at the intersection of aesthetic authority and technical precision.'),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Technical Mastery (Skills)
export const technicalSkills = pgTable('technical_skills', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(), // Language, Framework, Motion, etc.
    order: serial('order'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Presence (Social Links)
export const presenceLinks = pgTable('presence_links', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    platformId: text('platform_id').notNull(), // for icon mapping
    url: text('url').notNull(),
    color: text('color'),
    tagline: text('tagline'),
    order: serial('order'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Support items
export const supportItems = pgTable('support_items', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    icon: text('icon'), // coffee, pizza, etc.
    url: text('url').notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Contact form submissions
export const contacts = pgTable('contacts', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    message: text('message').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});
