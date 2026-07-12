import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/database.module';
import * as schema from '../db/schema';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto, AssignDriverDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll() {
    return this.db
      .select()
      .from(schema.vehicles)
      .leftJoin(schema.users, eq(schema.vehicles.driverId, schema.users.id));
  }

  async findOne(id: string) {
    const [result] = await this.db
      .select()
      .from(schema.vehicles)
      .leftJoin(schema.users, eq(schema.vehicles.driverId, schema.users.id))
      .where(eq(schema.vehicles.id, id))
      .limit(1);

    if (!result) {
      throw new NotFoundException(`Vehicle with id ${id} not found`);
    }

    return result;
  }

  async create(dto: CreateVehicleDto) {
    // Verify registration number is unique
    const [existing] = await this.db
      .select({ id: schema.vehicles.id })
      .from(schema.vehicles)
      .where(eq(schema.vehicles.registrationNumber, dto.registrationNumber))
      .limit(1);

    if (existing) {
      throw new ConflictException(
        `Registration number ${dto.registrationNumber} already exists`,
      );
    }

    // If driverId provided, verify driver exists and has driver role
    if (dto.driverId) {
      await this.verifyDriver(dto.driverId);
    }

    const [vehicle] = await this.db
      .insert(schema.vehicles)
      .values({
        registrationNumber: dto.registrationNumber,
        name: dto.name,
        type: dto.type,
        capacity: dto.capacity,
        driverId: dto.driverId ?? null,
        status: dto.status,
      })
      .returning();

    return vehicle;
  }

  async update(id: string, dto: UpdateVehicleDto) {
    // Ensure vehicle exists
    await this.findOne(id);

    const [updated] = await this.db
      .update(schema.vehicles)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(schema.vehicles.id, id))
      .returning();

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.db
      .delete(schema.vehicles)
      .where(eq(schema.vehicles.id, id));

    return { message: `Vehicle ${id} deleted successfully` };
  }

  async assignDriver(vehicleId: string, dto: AssignDriverDto) {
    // Ensure vehicle exists
    await this.findOne(vehicleId);

    // Validate driver if provided
    if (dto.driverId) {
      await this.verifyDriver(dto.driverId);
    }

    const [updated] = await this.db
      .update(schema.vehicles)
      .set({ driverId: dto.driverId, updatedAt: new Date() })
      .where(eq(schema.vehicles.id, vehicleId))
      .returning();

    return updated;
  }

  async updateStatus(
    vehicleId: string,
    status: 'available' | 'on_trip' | 'on_maintenance',
  ) {
    await this.findOne(vehicleId);

    const [updated] = await this.db
      .update(schema.vehicles)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.vehicles.id, vehicleId))
      .returning();

    return updated;
  }

  /** Ensure user exists and has the 'driver' role */
  private async verifyDriver(driverId: string) {
    const [driver] = await this.db
      .select({ id: schema.users.id, role: schema.users.role })
      .from(schema.users)
      .where(eq(schema.users.id, driverId))
      .limit(1);

    if (!driver) {
      throw new NotFoundException(`Driver with id ${driverId} not found`);
    }

    if (driver.role !== 'driver') {
      throw new BadRequestException(
        `User ${driverId} is not a driver (role: ${driver.role})`,
      );
    }

    return driver;
  }
}
