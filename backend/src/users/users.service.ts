import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/database.module';
import * as schema from '../db/schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll() {
    return this.db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        phone: schema.users.phone,
        role: schema.users.role,
        createdAt: schema.users.createdAt,
        updatedAt: schema.users.updatedAt,
      })
      .from(schema.users);
  }

  async findOne(id: string) {
    const [user] = await this.db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        phone: schema.users.phone,
        role: schema.users.role,
        createdAt: schema.users.createdAt,
        updatedAt: schema.users.updatedAt,
      })
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    // Ensure user exists first
    await this.findOne(id);

    // Check phone uniqueness if being updated
    if (dto.phone) {
      const [conflict] = await this.db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(eq(schema.users.phone, dto.phone))
        .limit(1);

      if (conflict && conflict.id !== id) {
        throw new ConflictException('Phone number already in use');
      }
    }

    const [updated] = await this.db
      .update(schema.users)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, id))
      .returning({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        phone: schema.users.phone,
        role: schema.users.role,
        updatedAt: schema.users.updatedAt,
      });

    return updated;
  }

  async remove(id: string) {
    // Ensure user exists
    await this.findOne(id);

    await this.db.delete(schema.users).where(eq(schema.users.id, id));

    return { message: `User ${id} deleted successfully` };
  }
}
