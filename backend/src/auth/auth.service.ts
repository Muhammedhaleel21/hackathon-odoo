import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/database.module';
import * as schema from '../db/schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoginInput } from './dto/login.schema';

@Injectable()
export class AuthService {
    constructor(
        @Inject(DRIZZLE)
        private db: NodePgDatabase<typeof schema>,
        private jwtService: JwtService,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async login(loginData: LoginInput) {

        const result = await this.db
            .select()
            .from(schema.users)
            .where(eq(schema.users.employeeId, loginData.id))
            .limit(1);

        const user = result[0];

        if (!user) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        if (user.isDeleted) {
            throw new ForbiddenException(
                'Your account has been deactivated. Please contact the administrator.',
            );
        }

        const payload = {
            sub: user.id,
            employeeId: user.employeeId,
            role: user.role,
            tokenVersion: user.tokenVersion,
        };
        const token = await this.jwtService.signAsync(payload);

        return {
            token,
            user: {
                id: user.id,
                employeeId: user.employeeId,
                name: user.fullName,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                isFirstLogin: user.isFirstLogin,
            },
        };
    }
/*

    async forgotPassword(forgotPasswordData: ForgotPasswordInput) {
        const result = await this.db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, forgotPasswordData.email))
            .limit(1);

        if (!result[0]) {
            return { message: 'If an account exists, your request has been recorded.' };
        }

        const user = result[0];

        await this.db
            .update(schema.users)
            .set({ passwordResetRequested: true })
            .where(eq(schema.users.id, user.id));

        this.eventEmitter.emit('password.reset_requested', {
            userId: user.id,
            employeeId: user.employeeId,
            fullName: user.fullName,
            email: user.email,
        });
 
        return { message: 'If an account exists, your request has been recorded.' };

    }
*/
/*
    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const result = await this.db
            .select()
            .from(schema.users)
            .where(eq(schema.users.passwordResetToken, resetPasswordDto.token))
            .limit(1);

        const user = result[0];

        if (!user) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        if (!user.passwordResetExpiry || new Date() > user.passwordResetExpiry) {

            await this.db
                .update(schema.users)
                .set({ passwordResetToken: null, passwordResetExpiry: null })
                .where(eq(schema.users.id, user.id));

            throw new BadRequestException(
                'Reset token has expired. Please request a new one.',
            );
        }

        const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

        await this.db
            .update(schema.users)
            .set({
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpiry: null,
            })
            .where(eq(schema.users.id, user.id));

        this.eventEmitter.emit('user.reset-password-success', {
            email: user.email,
        });

        return { message: 'Password has been reset successfully.' };
    }
*/
}