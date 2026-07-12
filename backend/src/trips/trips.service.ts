import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/database.module';
import * as schema from '../db/schema';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(dto: CreateTripDto) {
    await this.assertVehicleAndDriverExist(dto.vehicleId, dto.driverId);

    const [trip] = await this.db
      .insert(schema.trips)
      .values({
        source: dto.source,
        destination: dto.destination,
        vehicleId: dto.vehicleId,
        driverId: dto.driverId,
        cargoWeight: dto.cargoWeight,
        plannedDistance: dto.plannedDistance,
        status: 'draft',
      })
      .returning();

    return trip;
  }

  async findAll() {
    return this.db.select().from(schema.trips);
  }

  async findOne(id: string) {
    const [trip] = await this.db
      .select()
      .from(schema.trips)
      .where(eq(schema.trips.id, id))
      .limit(1);

    if (!trip) {
      throw new NotFoundException(`Trip with id ${id} not found`);
    }

    return trip;
  }

  async update(id: string, dto: UpdateTripDto) {
    await this.findOne(id);

    const [trip] = await this.db
      .update(schema.trips)
      .set({
        ...(dto.source ? { source: dto.source } : {}),
        ...(dto.destination ? { destination: dto.destination } : {}),
        ...(dto.vehicleId ? { vehicleId: dto.vehicleId } : {}),
        ...(dto.driverId ? { driverId: dto.driverId } : {}),
        ...(dto.cargoWeight !== undefined ? { cargoWeight: dto.cargoWeight } : {}),
        ...(dto.plannedDistance !== undefined ? { plannedDistance: dto.plannedDistance } : {}),
        ...(dto.status ? { status: dto.status } : {}),
        updatedAt: new Date(),
      })
      .where(eq(schema.trips.id, id))
      .returning();

    return trip;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.db.delete(schema.trips).where(eq(schema.trips.id, id));
  }

  async dispatch(id: string) {
    return this.db.transaction(async (tx) => {
      const [trip] = await tx
        .select()
        .from(schema.trips)
        .where(eq(schema.trips.id, id))
        .limit(1);

      if (!trip) {
        throw new NotFoundException(`Trip with id ${id} not found`);
      }

      if (trip.status !== 'draft') {
        throw new BadRequestException('Only draft trips can be dispatched');
      }

      const [vehicle] = await tx
        .select()
        .from(schema.vehicles)
        .where(eq(schema.vehicles.id, trip.vehicleId))
        .limit(1);

      if (!vehicle) {
        throw new NotFoundException(`Vehicle with id ${trip.vehicleId} not found`);
      }

      if (vehicle.status !== 'available') {
        throw new BadRequestException('Vehicle must be available to dispatch');
      }

      if (trip.cargoWeight > vehicle.maxLoadCapacity) {
        throw new BadRequestException('Cargo weight exceeds vehicle max load capacity');
      }

      const [driver] = await tx
        .select()
        .from(schema.users)
        .where(and(eq(schema.users.id, trip.driverId), eq(schema.users.role, 'driver')))
        .limit(1);

      if (!driver) {
        throw new NotFoundException(`Driver with id ${trip.driverId} not found`);
      }

      if (driver.status !== 'available') {
        throw new BadRequestException('Driver must be available to dispatch');
      }

      await tx
        .update(schema.trips)
        .set({ status: 'dispatched', updatedAt: new Date() })
        .where(eq(schema.trips.id, id));

      await tx
        .update(schema.vehicles)
        .set({ status: 'on_trip', updatedAt: new Date() })
        .where(eq(schema.vehicles.id, vehicle.id));

      await tx
        .update(schema.users)
        .set({ status: 'on_trip', updatedAt: new Date() })
        .where(eq(schema.users.id, driver.id));

      return { message: `Trip ${id} dispatched successfully` };
    });
  }

  async complete(id: string) {
    return this.db.transaction(async (tx) => {
      const [trip] = await tx
        .select()
        .from(schema.trips)
        .where(eq(schema.trips.id, id))
        .limit(1);

      if (!trip) {
        throw new NotFoundException(`Trip with id ${id} not found`);
      }

      if (trip.status !== 'dispatched') {
        throw new BadRequestException('Only dispatched trips can be completed');
      }

      const [vehicle] = await tx
        .select()
        .from(schema.vehicles)
        .where(eq(schema.vehicles.id, trip.vehicleId))
        .limit(1);

      if (!vehicle) {
        throw new NotFoundException(`Vehicle with id ${trip.vehicleId} not found`);
      }

      const [driver] = await tx
        .select()
        .from(schema.users)
        .where(and(eq(schema.users.id, trip.driverId), eq(schema.users.role, 'driver')))
        .limit(1);

      if (!driver) {
        throw new NotFoundException(`Driver with id ${trip.driverId} not found`);
      }

      await tx
        .update(schema.trips)
        .set({ status: 'completed', updatedAt: new Date() })
        .where(eq(schema.trips.id, id));

      await tx
        .update(schema.vehicles)
        .set({
          status: 'available',
          odometer: vehicle.odometer + trip.plannedDistance,
          updatedAt: new Date(),
        })
        .where(eq(schema.vehicles.id, vehicle.id));

      await tx
        .update(schema.users)
        .set({ status: 'available', updatedAt: new Date() })
        .where(eq(schema.users.id, driver.id));

      return { message: `Trip ${id} completed successfully` };
    });
  }

  async cancel(id: string) {
    return this.db.transaction(async (tx) => {
      const [trip] = await tx
        .select()
        .from(schema.trips)
        .where(eq(schema.trips.id, id))
        .limit(1);

      if (!trip) {
        throw new NotFoundException(`Trip with id ${id} not found`);
      }

      if (trip.status === 'cancelled') {
        throw new BadRequestException('Trip is already cancelled');
      }

      const [vehicle] = await tx
        .select()
        .from(schema.vehicles)
        .where(eq(schema.vehicles.id, trip.vehicleId))
        .limit(1);

      if (!vehicle) {
        throw new NotFoundException(`Vehicle with id ${trip.vehicleId} not found`);
      }

      const [driver] = await tx
        .select()
        .from(schema.users)
        .where(and(eq(schema.users.id, trip.driverId), eq(schema.users.role, 'driver')))
        .limit(1);

      if (!driver) {
        throw new NotFoundException(`Driver with id ${trip.driverId} not found`);
      }

      await tx
        .update(schema.trips)
        .set({ status: 'cancelled', updatedAt: new Date() })
        .where(eq(schema.trips.id, id));

      if (trip.status === 'dispatched') {
        await tx
          .update(schema.vehicles)
          .set({ status: 'available', updatedAt: new Date() })
          .where(eq(schema.vehicles.id, vehicle.id));

        await tx
          .update(schema.users)
          .set({ status: 'available', updatedAt: new Date() })
          .where(eq(schema.users.id, driver.id));
      }

      return { message: `Trip ${id} cancelled successfully` };
    });
  }

  private async assertVehicleAndDriverExist(vehicleId: string, driverId: string) {
    const [vehicle] = await this.db
      .select({ id: schema.vehicles.id })
      .from(schema.vehicles)
      .where(eq(schema.vehicles.id, vehicleId))
      .limit(1);

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${vehicleId} not found`);
    }

    const [driver] = await this.db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(and(eq(schema.users.id, driverId), eq(schema.users.role, 'driver')))
      .limit(1);

    if (!driver) {
      throw new NotFoundException(`Driver with id ${driverId} not found`);
    }
  }
}