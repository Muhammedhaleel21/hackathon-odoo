CREATE TYPE "public"."role" AS ENUM('admin', 'fleet_manager', 'driver');--> statement-breakpoint
CREATE TYPE "public"."vehicle_status" AS ENUM('available', 'on_trip', 'on_maintenance');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(15) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'driver' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"registrationNumber" varchar(20) NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	"capacity" integer NOT NULL,
	"driverId" uuid,
	"status" "vehicle_status" DEFAULT 'available' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_registrationNumber_unique" UNIQUE("registrationNumber")
);
--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_driverId_users_id_fk" FOREIGN KEY ("driverId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;