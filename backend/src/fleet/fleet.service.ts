import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/database.module';
import * as schema from '../db/schema';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class FleetService {
	constructor(
		@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
	) {}

	async create(dto: CreateVehicleDto) {
		const [existing] = await this.db
			.select({ id: schema.vehicles.id })
			.from(schema.vehicles)
			.where(eq(schema.vehicles.registrationNumber, dto.registrationNumber))
			.limit(1);

		if (existing) {
			throw new ConflictException(
				`Vehicle with registration number ${dto.registrationNumber} already exists`,
			);
		}

		const [vehicle] = await this.db
			.insert(schema.vehicles)
			.values({
				registrationNumber: dto.registrationNumber,
				name: dto.name,
				type: dto.type,
				capacity: dto.capacity,
				status: dto.status ?? 'available',
			})
			.returning();

		return vehicle;
	}

	async findAll() {
		return this.db.select().from(schema.vehicles);
	}

	async findOne(id: string) {
		const [vehicle] = await this.db
			.select()
			.from(schema.vehicles)
			.where(eq(schema.vehicles.id, id))
			.limit(1);

		if (!vehicle) {
			throw new NotFoundException(`Vehicle with id ${id} not found`);
		}

		return vehicle;
	}

	async update(id: string, dto: UpdateVehicleDto) {
		await this.findOne(id);

		if (dto.registrationNumber) {
			const [existing] = await this.db
				.select({ id: schema.vehicles.id })
				.from(schema.vehicles)
				.where(eq(schema.vehicles.registrationNumber, dto.registrationNumber))
				.limit(1);

			if (existing && existing.id !== id) {
				throw new ConflictException(
					`Vehicle with registration number ${dto.registrationNumber} already exists`,
				);
			}
		}

		const [vehicle] = await this.db
			.update(schema.vehicles)
			.set({
				...dto,
				updatedAt: new Date(),
			})
			.where(eq(schema.vehicles.id, id))
			.returning();

		return vehicle;
	}

	async remove(id: string) {
		await this.findOne(id);

		await this.db.delete(schema.vehicles).where(eq(schema.vehicles.id, id));

		return;
	}
}