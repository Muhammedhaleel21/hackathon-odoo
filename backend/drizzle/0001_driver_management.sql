CREATE TYPE "public"."driver_status" AS ENUM('available', 'on_trip', 'off_duty', 'suspended');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "licenseNumber" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "licenseCategory" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "licenseExpiryDate" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "safetyScore" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "driver_status";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_licenseNumber_unique" UNIQUE("licenseNumber");--> statement-breakpoint