import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/database.module';
import * as schema from '../db/schema';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(dto: CreateDriverDto) {
    await this.ensureUniqueConstraints(dto.email, dto.phone, dto.licenseNumber);

    const password = await bcrypt.hash(dto.password, 12);

    const [driver] = await this.db
      .insert(schema.users)
      .values({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password,
        role: 'driver',
        licenseNumber: dto.licenseNumber,
        licenseCategory: dto.licenseCategory,
        licenseExpiryDate: dto.licenseExpiryDate,
        safetyScore: dto.safetyScore,
        status: dto.status ?? 'available',
      })
      .returning(this.safeDriverFields());

    return driver;
  }

  async findAll() {
    return this.db
      .select(this.safeDriverFields())
      .from(schema.users)
      .where(eq(schema.users.role, 'driver'));
  }

  async findOne(id: string) {
    const [driver] = await this.db
      .select(this.safeDriverFields())
      .from(schema.users)
      .where(and(eq(schema.users.id, id), eq(schema.users.role, 'driver')))
      .limit(1);

    if (!driver) {
      throw new NotFoundException(`Driver with id ${id} not found`);
    }

    return driver;
  }

  async update(id: string, dto: UpdateDriverDto) {
    await this.findOne(id);

    if (dto.email || dto.phone || dto.licenseNumber) {
      await this.ensureUniqueConstraints(
        dto.email,
        dto.phone,
        dto.licenseNumber,
        id,
      );
    }

    const [driver] = await this.db
      .update(schema.users)
      .set({
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.email ? { email: dto.email } : {}),
        ...(dto.phone ? { phone: dto.phone } : {}),
        ...(dto.licenseNumber ? { licenseNumber: dto.licenseNumber } : {}),
        ...(dto.licenseCategory ? { licenseCategory: dto.licenseCategory } : {}),
        ...(dto.licenseExpiryDate ? { licenseExpiryDate: dto.licenseExpiryDate } : {}),
        ...(dto.safetyScore !== undefined ? { safetyScore: dto.safetyScore } : {}),
        ...(dto.status ? { status: dto.status } : {}),
        updatedAt: new Date(),
      })
      .where(and(eq(schema.users.id, id), eq(schema.users.role, 'driver')))
      .returning(this.safeDriverFields());

    return driver;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.db
      .delete(schema.users)
      .where(and(eq(schema.users.id, id), eq(schema.users.role, 'driver')));
  }

  private safeDriverFields() {
    return {
      id: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      phone: schema.users.phone,
      role: schema.users.role,
      licenseNumber: schema.users.licenseNumber,
      licenseCategory: schema.users.licenseCategory,
      licenseExpiryDate: schema.users.licenseExpiryDate,
      safetyScore: schema.users.safetyScore,
      status: schema.users.status,
      createdAt: schema.users.createdAt,
      updatedAt: schema.users.updatedAt,
    };
  }

  private async ensureUniqueConstraints(
    email?: string,
    phone?: string,
    licenseNumber?: string,
    currentId?: string,
  ) {
    if (email) {
      const [conflict] = await this.db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1);

      if (conflict && conflict.id !== currentId) {
        throw new ConflictException('Email is already in use');
      }
    }

    if (phone) {
      const [conflict] = await this.db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(eq(schema.users.phone, phone))
        .limit(1);

      if (conflict && conflict.id !== currentId) {
        throw new ConflictException('Phone number is already in use');
      }
    }

    if (licenseNumber) {
      const [conflict] = await this.db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(eq(schema.users.licenseNumber, licenseNumber))
        .limit(1);

      if (conflict && conflict.id !== currentId) {
        throw new ConflictException('License number is already in use');
      }
    }
  }
}