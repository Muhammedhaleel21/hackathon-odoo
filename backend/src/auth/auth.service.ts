import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/database.module';
import * as schema from '../db/schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if email already exists
    const [existing] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, dto.email))
      .limit(1);

    if (existing) {
      throw new ConflictException('Email is already in use');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    const [user] = await this.db
      .insert(schema.users)
      .values({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: dto.role,
      })
      .returning({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        phone: schema.users.phone,
        role: schema.users.role,
        createdAt: schema.users.createdAt,
      });

    const token = this.signToken(user.id, user.email, user.role);

    return { user, token };
  }

  async login(dto: LoginDto) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, dto.email))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash: _pw, ...safeUser } = user;
    const token = this.signToken(user.id, user.email, user.role);

    return { user: safeUser, token };
  }

  private signToken(userId: string, email: string, role: string): string {
    return this.jwtService.sign({ sub: userId, email, role });
  }
}
