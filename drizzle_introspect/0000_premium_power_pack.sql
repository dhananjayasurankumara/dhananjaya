-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"logo_text" text DEFAULT 'DANANJAYA',
	"email" text DEFAULT 'dhananjayasurankumara@gmail.com',
	"whatsapp" text DEFAULT '94702096510',
	"linkedin" text DEFAULT 'https://linkedin.com/in/dananjaya-suran-kumara',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hero_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"headline" text DEFAULT 'DESIGNING VISUAL STORIES.',
	"subheadline" text DEFAULT 'DEVELOPING DIGITAL EXPERIENCES.',
	"cta_text" text DEFAULT 'Let''s Talk',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "about_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text DEFAULT 'Architect of Digital Experiences',
	"bio" text DEFAULT 'I am a graphic designer and creative developer crafting high-fidelity digital experiences that merge aesthetic precision with technical mastery.',
	"stat1_label" text DEFAULT 'Years Experience',
	"stat1_value" text DEFAULT '5+',
	"stat2_label" text DEFAULT 'Projects Completed',
	"stat2_value" text DEFAULT '50+',
	"stat3_label" text DEFAULT 'Clients Worldwide',
	"stat3_value" text DEFAULT '20+',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"tags" text,
	"link" text,
	"image_url" text,
	"featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "philosophy_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text DEFAULT 'Digital Alchemy / Creative Engineering',
	"line1" text DEFAULT 'I don''t just build pixels.',
	"line2" text DEFAULT 'I architect digital souls.',
	"bio" text DEFAULT 'Architecture is the silence between the code. I operate at the intersection of aesthetic authority and technical precision.',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "presence_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"platform_id" text NOT NULL,
	"url" text NOT NULL,
	"color" text,
	"tagline" text,
	"order" serial NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shop_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"product_id" integer,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shop_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"price" text DEFAULT '0' NOT NULL,
	"image_url" text,
	"category" text DEFAULT 'Digital',
	"stock" integer DEFAULT 99,
	"featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "support_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"icon" text,
	"url" text NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "technical_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"order" serial NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"email_verified" timestamp,
	"image" text,
	"role" text DEFAULT 'user',
	"bio" text,
	"phone" text,
	"website" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
ALTER TABLE "shop_orders" ADD CONSTRAINT "shop_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_orders" ADD CONSTRAINT "shop_orders_product_id_shop_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."shop_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
*/