import { pgTable, serial, text, timestamp, boolean, integer, real } from 'drizzle-orm/pg-core';

// ─── Site Settings ────────────────────────────────────────────────────────────
export const siteSettings = pgTable('site_settings', {
    id: serial('id').primaryKey(),
    logoText: text('logo_text').default('DANANJAYA'),
    email: text('email').default('dhananjayasurankumara@gmail.com'),
    whatsapp: text('whatsapp').default('94702096510'),
    linkedin: text('linkedin').default('https://linkedin.com/in/dananjaya-suran-kumara'),
    twitter: text('twitter'),
    instagram: text('instagram'),
    github: text('github'),
    phone: text('phone'),
    address: text('address'),
    metaDescription: text('meta_description'),
    metaKeywords: text('meta_keywords'),
    footerText: text('footer_text'),
    themeColor: text('theme_color').default('#ff3333'),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const navLinks = pgTable('nav_links', {
    id: serial('id').primaryKey(),
    label: text('label').notNull(),
    href: text('href').notNull(),
    type: text('type').default('internal'), // 'internal', 'hash', 'external'
    displayOrder: integer('display_order').default(0),
    active: boolean('active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
});

export const backgroundImages = pgTable('background_images', {
    id: serial('id').primaryKey(),
    section: text('section').notNull().unique(), // 'hero', 'about', etc.
    imageUrl: text('image_url'),
    imagePosition: text('image_position').default('center'),
    overlayOpacity: real('overlay_opacity').default(0.5),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── Hero Section ─────────────────────────────────────────────────────────────
export const heroContent = pgTable('hero_content', {
    id: serial('id').primaryKey(),
    headline: text('headline').default('DESIGNING VISUAL STORIES.'),
    subheadline: text('subheadline').default('DEVELOPING DIGITAL EXPERIENCES.'),
    ctaText: text('cta_text').default("Let's Talk"),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── About Section ────────────────────────────────────────────────────────────
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

// ─── Projects ─────────────────────────────────────────────────────────────────
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

// ─── Philosophy Section ───────────────────────────────────────────────────────
export const philosophyContent = pgTable('philosophy_content', {
    id: serial('id').primaryKey(),
    label: text('label').default('Digital Alchemy / Creative Engineering'),
    line1: text('line1').default("I don't just build pixels."),
    line2: text('line2').default('I architect digital souls.'),
    bio: text('bio').default('Architecture is the silence between the code. I operate at the intersection of aesthetic authority and technical precision.'),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── Technical Skills ─────────────────────────────────────────────────────────
export const technicalSkills = pgTable('technical_skills', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    order: serial('order'),
    createdAt: timestamp('created_at').defaultNow(),
});

// ─── Presence Links ───────────────────────────────────────────────────────────
export const presenceLinks = pgTable('presence_links', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    platformId: text('platform_id').notNull(),
    url: text('url').notNull(),
    color: text('color'),
    tagline: text('tagline'),
    order: serial('order'),
    createdAt: timestamp('created_at').defaultNow(),
});

// ─── Support Items ────────────────────────────────────────────────────────────
export const supportItems = pgTable('support_items', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    icon: text('icon'),
    url: text('url').notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviews = pgTable('reviews', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().unique(),
    userName: text('user_name').notNull(),
    userAvatar: text('user_avatar'),
    rating: integer('rating').notNull().default(5),
    body: text('body').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});


// ─── Contacts ─────────────────────────────────────────────────────────────────
export const contacts = pgTable('contacts', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    message: text('message').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// PORTFOLIO AUTH — uses a dedicated table (portfolio_users) to avoid
// conflicts with the legacy NextAuth "users" table already in the DB.
// ─────────────────────────────────────────────────────────────────────────────
export const portfolioUsers = pgTable('portfolio_users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    avatar: text('avatar'),
    bio: text('bio'),
    role: text('role').default('user'), // 'user' | 'admin'
    createdAt: timestamp('created_at').defaultNow(),
});

// ─── Products ─────────────────────────────────────────────────────────────────
export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    price: real('price').notNull().default(0),
    imageUrl: text('image_url'),
    category: text('category'),
    stock: integer('stock').default(0),
    featured: boolean('featured').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    items: text('items').notNull(), // JSON: [{productId, title, qty, price}]
    total: real('total').notNull(),
    status: text('status').default('pending'),
    createdAt: timestamp('created_at').defaultNow(),
});

// ─── Cart Items ───────────────────────────────────────────────────────────────
export const cartItems = pgTable('cart_items', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    productId: integer('product_id').notNull(),
    quantity: integer('quantity').notNull().default(1),
    createdAt: timestamp('created_at').defaultNow(),
});
