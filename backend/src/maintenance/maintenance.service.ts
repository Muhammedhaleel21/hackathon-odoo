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
import { CostsService } from '../costs/costs.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { CompleteMaintenanceDto } from './dto/complete-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly costsService: CostsService,
  ) {}

  async create(dto: CreateMaintenanceDto) {
    return this.db.transaction(async (tx) => {
      const [vehicle] = await tx
        .select()
        .from(schema.vehicles)
        .where(eq(schema.vehicles.id, dto.vehicleId))
        .limit(1);

      if (!vehicle) {
        throw new NotFoundException(`Vehicle with id ${dto.vehicleId} not found`);
      }

      if (vehicle.status !== 'available') {
        throw new ConflictException('Vehicle must be available to start maintenance');
      }

      const [log] = await tx
        .insert(schema.maintenanceLogs)
        .values({
          vehicleId: dto.vehicleId,
          description: dto.description,
          status: 'active',
          startedAt: dto.startedAt ?? new Date(),
        })
        .returning();

      await tx
        .update(schema.vehicles)
        .set({ status: 'in_shop', updatedAt: new Date() })
        .where(eq(schema.vehicles.id, dto.vehicleId));

      return log;
    });
  }

  async findAll() {
    return this.db.select().from(schema.maintenanceLogs);
  }

  async findOne(id: string) {
    const [log] = await this.db
      .select()
      .from(schema.maintenanceLogs)
      .where(eq(schema.maintenanceLogs.id, id))
      .limit(1);

    if (!log) {
      throw new NotFoundException(`Maintenance record with id ${id} not found`);
    }

    return log;
  }

  async update(id: string, dto: UpdateMaintenanceDto) {
    await this.findOne(id);

    const [log] = await this.db
      .update(schema.maintenanceLogs)
      .set({
        ...(dto.description ? { description: dto.description } : {}),
        ...(dto.startedAt ? { startedAt: dto.startedAt } : {}),
        updatedAt: new Date(),
      })
      .where(eq(schema.maintenanceLogs.id, id))
      .returning();

    return log;
  }

  async remove(id: string) {
    return this.db.transaction(async (tx) => {
      const [log] = await tx
        .select()
        .from(schema.maintenanceLogs)
        .where(eq(schema.maintenanceLogs.id, id))
        .limit(1);

      if (!log) {
        throw new NotFoundException(`Maintenance record with id ${id} not found`);
      }

      if (log.status === 'active') {
        await tx
          .update(schema.vehicles)
          .set({ status: 'available', updatedAt: new Date() })
          .where(eq(schema.vehicles.id, log.vehicleId));
      }

      await tx.delete(schema.maintenanceLogs).where(eq(schema.maintenanceLogs.id, id));
    });
  }

  async complete(id: string, dto: CompleteMaintenanceDto = {}) {
    return this.finishMaintenance(id, 'completed', dto.expenseAmount);
  }

  async cancel(id: string) {
    return this.finishMaintenance(id, 'cancelled');
  }

  private async finishMaintenance(
    id: string,
    status: 'completed' | 'cancelled',
    expenseAmount?: number,
  ) {
    return this.db.transaction(async (tx) => {
      const [log] = await tx
        .select()
        .from(schema.maintenanceLogs)
        .where(eq(schema.maintenanceLogs.id, id))
        .limit(1);

      if (!log) {
        throw new NotFoundException(`Maintenance record with id ${id} not found`);
      }

      if (log.status !== 'active') {
        throw new BadRequestException('Only active maintenance records can be finalized');
      }

      const [vehicle] = await tx
        .select()
        .from(schema.vehicles)
        .where(eq(schema.vehicles.id, log.vehicleId))
        .limit(1);

      if (!vehicle) {
        throw new NotFoundException(`Vehicle with id ${log.vehicleId} not found`);
      }

      await tx
        .update(schema.maintenanceLogs)
        .set({
          status,
          endedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(schema.maintenanceLogs.id, id));

      await tx
        .update(schema.vehicles)
        .set({ status: 'available', updatedAt: new Date() })
        .where(eq(schema.vehicles.id, vehicle.id));

      if (status === 'completed') {
        await tx.insert(schema.expenses).values({
          vehicleId: vehicle.id,
          type: 'maintenance',
          amount: expenseAmount ?? 0,
          sourceId: log.id,
          description: `Maintenance expense for vehicle ${vehicle.id}`,
        });
      }

      return { message: `Maintenance record ${id} ${status} successfully` };
    });
  }
}