import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/database.module';
import * as schema from '../db/schema';
import { CreateFuelLogDto } from './dto/create-fuel-log.dto';
import { UpdateFuelLogDto } from './dto/update-fuel-log.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class CostsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async createFuelLog(dto: CreateFuelLogDto) {
    return this.db.transaction(async (tx) => {
      const [vehicle] = await tx
        .select()
        .from(schema.vehicles)
        .where(eq(schema.vehicles.id, dto.vehicleId))
        .limit(1);

      if (!vehicle) {
        throw new NotFoundException(`Vehicle with id ${dto.vehicleId} not found`);
      }

      const [fuelLog] = await tx
        .insert(schema.fuelLogs)
        .values({
          vehicleId: dto.vehicleId,
          odometer: dto.odometer,
          liters: dto.liters,
          cost: dto.cost,
        })
        .returning();

      if (dto.odometer > vehicle.odometer) {
        await tx
          .update(schema.vehicles)
          .set({ odometer: dto.odometer, updatedAt: new Date() })
          .where(eq(schema.vehicles.id, dto.vehicleId));
      }

      await tx.insert(schema.expenses).values({
        vehicleId: dto.vehicleId,
        type: 'fuel',
        amount: dto.cost,
        sourceId: fuelLog.id,
        description: `Fuel log for vehicle ${dto.vehicleId}`,
      });

      return fuelLog;
    });
  }

  async findAllFuelLogs() {
    return this.db.select().from(schema.fuelLogs);
  }

  async findFuelLog(id: string) {
    const [fuelLog] = await this.db
      .select()
      .from(schema.fuelLogs)
      .where(eq(schema.fuelLogs.id, id))
      .limit(1);

    if (!fuelLog) {
      throw new NotFoundException(`Fuel log with id ${id} not found`);
    }

    return fuelLog;
  }

  async updateFuelLog(id: string, dto: UpdateFuelLogDto) {
    await this.findFuelLog(id);

    const [fuelLog] = await this.db
      .update(schema.fuelLogs)
      .set({
        ...(dto.odometer !== undefined ? { odometer: dto.odometer } : {}),
        ...(dto.liters !== undefined ? { liters: dto.liters } : {}),
        ...(dto.cost !== undefined ? { cost: dto.cost } : {}),
        updatedAt: new Date(),
      })
      .where(eq(schema.fuelLogs.id, id))
      .returning();

    return fuelLog;
  }

  async removeFuelLog(id: string) {
    await this.findFuelLog(id);
    await this.db.delete(schema.fuelLogs).where(eq(schema.fuelLogs.id, id));
  }

  async createExpense(dto: CreateExpenseDto) {
    const [vehicle] = await this.db
      .select({ id: schema.vehicles.id })
      .from(schema.vehicles)
      .where(eq(schema.vehicles.id, dto.vehicleId))
      .limit(1);

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${dto.vehicleId} not found`);
    }

    const [expense] = await this.db
      .insert(schema.expenses)
      .values(dto)
      .returning();

    return expense;
  }

  async findAllExpenses() {
    return this.db.select().from(schema.expenses);
  }

  async findExpense(id: string) {
    const [expense] = await this.db
      .select()
      .from(schema.expenses)
      .where(eq(schema.expenses.id, id))
      .limit(1);

    if (!expense) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }

    return expense;
  }

  async updateExpense(id: string, dto: UpdateExpenseDto) {
    await this.findExpense(id);

    const [expense] = await this.db
      .update(schema.expenses)
      .set({
        ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        updatedAt: new Date(),
      })
      .where(eq(schema.expenses.id, id))
      .returning();

    return expense;
  }

  async removeExpense(id: string) {
    await this.findExpense(id);
    await this.db.delete(schema.expenses).where(eq(schema.expenses.id, id));
  }

  async getVehicleCostSummary(vehicleId: string) {
    const [vehicle] = await this.db
      .select({ id: schema.vehicles.id })
      .from(schema.vehicles)
      .where(eq(schema.vehicles.id, vehicleId))
      .limit(1);

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${vehicleId} not found`);
    }

    const [fuelTotals] = await this.db
      .select({ totalFuelCost: sql<number>`coalesce(sum(${schema.expenses.amount}), 0)` })
      .from(schema.expenses)
      .where(and(eq(schema.expenses.vehicleId, vehicleId), eq(schema.expenses.type, 'fuel')));

    const [maintenanceTotals] = await this.db
      .select({ totalMaintenanceCost: sql<number>`coalesce(sum(${schema.expenses.amount}), 0)` })
      .from(schema.expenses)
      .where(and(eq(schema.expenses.vehicleId, vehicleId), eq(schema.expenses.type, 'maintenance')));

    return {
      vehicleId,
      totalFuelCost: fuelTotals?.totalFuelCost ?? 0,
      totalMaintenanceCost: maintenanceTotals?.totalMaintenanceCost ?? 0,
      totalOperationalCost:
        (fuelTotals?.totalFuelCost ?? 0) + (maintenanceTotals?.totalMaintenanceCost ?? 0),
    };
  }

  async createMaintenanceExpense(vehicleId: string, amount: number, description: string, sourceId?: string) {
    return this.db.insert(schema.expenses).values({
      vehicleId,
      type: 'maintenance',
      amount,
      sourceId,
      description,
    });
  }
}