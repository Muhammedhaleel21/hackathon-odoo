CREATE TYPE "public"."maintenance_status" AS ENUM('active', 'completed', 'cancelled');--> statement-breakpoint
ALTER TYPE "public"."vehicle_status" ADD VALUE IF NOT EXISTS 'in_shop';--> statement-breakpoint
CREATE TABLE "maintenance_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicleId" uuid NOT NULL,
	"description" varchar(500) NOT NULL,
	"status" "maintenance_status" DEFAULT 'active' NOT NULL,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"endedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_vehicleId_vehicles_id_fk" FOREIGN KEY ("vehicleId") REFERENCES "public"."vehicles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint