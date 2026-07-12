CREATE TYPE "public"."trip_status" AS ENUM('draft', 'dispatched', 'completed', 'cancelled');--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "maxLoadCapacity" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "odometer" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE TABLE "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" varchar(255) NOT NULL,
	"destination" varchar(255) NOT NULL,
	"vehicleId" uuid NOT NULL,
	"driverId" uuid NOT NULL,
	"cargoWeight" integer NOT NULL,
	"plannedDistance" integer NOT NULL,
	"status" "trip_status" DEFAULT 'draft' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_vehicleId_vehicles_id_fk" FOREIGN KEY ("vehicleId") REFERENCES "public"."vehicles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_driverId_users_id_fk" FOREIGN KEY ("driverId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint