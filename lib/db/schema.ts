import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// Admin authentication
export const adminUsers = pgTable('admin_users', {
    id: serial('id').primaryKey(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(), // bcrypt hash
    createdAt: timestamp('created_at').defaultNow(),
});

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

// Contact form submissions
export const contacts = pgTable('contacts', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    message: text('message').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});
