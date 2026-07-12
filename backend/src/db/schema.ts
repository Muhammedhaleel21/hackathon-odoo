import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['admin', 'fleet_manager', 'driver']);

export const vehicleStatusEnum = pgEnum('vehicle_status', [
  'available',
  'on_trip',
  'on_maintenance',
]);

export const tripStatusEnum = pgEnum('trip_status', [
  'draft',
  'dispatched',
  'completed',
  'cancelled',
]);

export const driverStatusEnum = pgEnum('driver_status', [
  'available',
  'on_trip',
  'off_duty',
  'suspended',
]);

export const users = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  phone: varchar({ length: 15 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: roleEnum().default('driver').notNull(),
  licenseNumber: varchar({ length: 50 }).unique(),
  licenseCategory: varchar({ length: 20 }),
  licenseExpiryDate: timestamp(),
  safetyScore: integer(),
  status: driverStatusEnum(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const vehicles = pgTable('vehicles', {
  id: uuid().primaryKey().defaultRandom(),
  registrationNumber: varchar({ length: 20 }).notNull().unique(),
  name: varchar({ length: 100 }).notNull(),
  type: varchar({ length: 50 }).notNull(),
  capacity: integer().notNull(),
  maxLoadCapacity: integer().default(0).notNull(),
  odometer: integer().default(0).notNull(),
  driverId: uuid().references(() => users.id, { onDelete: 'set null' }),
  status: vehicleStatusEnum().default('available').notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const trips = pgTable('trips', {
  id: uuid().defaultRandom().primaryKey(),
  source: varchar({ length: 255 }).notNull(),
  destination: varchar({ length: 255 }).notNull(),
  vehicleId: uuid().references(() => vehicles.id, { onDelete: 'restrict' }).notNull(),
  driverId: uuid().references(() => users.id, { onDelete: 'restrict' }).notNull(),
  cargoWeight: integer().notNull(),
  plannedDistance: integer().notNull(),
  status: tripStatusEnum().default('draft').notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});


export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;

export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;