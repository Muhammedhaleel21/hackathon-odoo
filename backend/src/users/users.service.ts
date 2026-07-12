import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { eq, or } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/database.module';
import * as schema from '../db/schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) { }

  async create(dto: CreateUserDto) {
    const [existing] = await this.db
      .select({
        id: schema.users.id,
      })
      .from(schema.users)
      .where(
        or(
          eq(schema.users.email, dto.email),
          eq(schema.users.phone, dto.phone),
          eq(schema.users.userId, dto.userId),
        ),
      )
      .limit(1);

    if (existing) {
      throw new ConflictException(
        'User with this email, phone or user ID already exists',
      );
    }

    // Hash password before saving
    const passwordHash = await bcrypt.hash(dto.password, 12);

    const [user] = await this.db
      .insert(schema.users)
      .values({
        userId: dto.userId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password: passwordHash,
        role: dto.role,
      })
      .returning({
        id: schema.users.id,
        userId: schema.users.userId,
        name: schema.users.name,
        email: schema.users.email,
        phone: schema.users.phone,
        role: schema.users.role,
        createdAt: schema.users.createdAt,
      });

    return user;
  }
}
