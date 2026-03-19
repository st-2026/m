ALTER TABLE "rooms" ADD COLUMN "min_players" integer DEFAULT 2;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "bot_allowed" boolean DEFAULT false NOT NULL;