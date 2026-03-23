import { pgTable, serial, text, timestamp, boolean, foreignKey, integer, unique, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const siteSettings = pgTable("site_settings", {
	id: serial().primaryKey().notNull(),
	logoText: text("logo_text").default('DANANJAYA'),
	email: text().default('dhananjayasurankumara@gmail.com'),
	whatsapp: text().default('94702096510'),
	linkedin: text().default('https://linkedin.com/in/dananjaya-suran-kumara'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const heroContent = pgTable("hero_content", {
	id: serial().primaryKey().notNull(),
	headline: text().default('DESIGNING VISUAL STORIES.'),
	subheadline: text().default('DEVELOPING DIGITAL EXPERIENCES.'),
	ctaText: text("cta_text").default('Let\'s Talk'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const aboutContent = pgTable("about_content", {
	id: serial().primaryKey().notNull(),
	title: text().default('Architect of Digital Experiences'),
	bio: text().default('I am a graphic designer and creative developer crafting high-fidelity digital experiences that merge aesthetic precision with technical mastery.'),
	stat1Label: text("stat1_label").default('Years Experience'),
	stat1Value: text("stat1_value").default('5+'),
	stat2Label: text("stat2_label").default('Projects Completed'),
	stat2Value: text("stat2_value").default('50+'),
	stat3Label: text("stat3_label").default('Clients Worldwide'),
	stat3Value: text("stat3_value").default('20+'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const projects = pgTable("projects", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	tags: text(),
	link: text(),
	imageUrl: text("image_url"),
	featured: boolean().default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const contacts = pgTable("contacts", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	message: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const philosophyContent = pgTable("philosophy_content", {
	id: serial().primaryKey().notNull(),
	label: text().default('Digital Alchemy / Creative Engineering'),
	line1: text().default('I don\'t just build pixels.'),
	line2: text().default('I architect digital souls.'),
	bio: text().default('Architecture is the silence between the code. I operate at the intersection of aesthetic authority and technical precision.'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const presenceLinks = pgTable("presence_links", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	platformId: text("platform_id").notNull(),
	url: text().notNull(),
	color: text(),
	tagline: text(),
	order: serial().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const shopOrders = pgTable("shop_orders", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id"),
	productId: integer("product_id"),
	status: text().default('pending'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "shop_orders_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [shopProducts.id],
			name: "shop_orders_product_id_shop_products_id_fk"
		}),
]);

export const sessions = pgTable("sessions", {
	sessionToken: text("session_token").primaryKey().notNull(),
	userId: text("user_id").notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const shopProducts = pgTable("shop_products", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	price: text().default('0').notNull(),
	imageUrl: text("image_url"),
	category: text().default('Digital'),
	stock: integer().default(99),
	featured: boolean().default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const supportItems = pgTable("support_items", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	icon: text(),
	url: text().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const technicalSkills = pgTable("technical_skills", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	type: text().notNull(),
	order: serial().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text(),
	emailVerified: timestamp("email_verified", { mode: 'string' }),
	image: text(),
	role: text().default('user'),
	bio: text(),
	phone: text(),
	website: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const verificationTokens = pgTable("verification_tokens", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.identifier, table.token], name: "verification_tokens_identifier_token_pk"}),
]);

export const accounts = pgTable("accounts", {
	userId: text("user_id").notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text("provider_account_id").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_user_id_users_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.provider, table.providerAccountId], name: "accounts_provider_provider_account_id_pk"}),
]);
