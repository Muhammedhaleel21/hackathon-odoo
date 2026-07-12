import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as schema from '../../db/schema';
import { eq } from "drizzle-orm";
import { DRIZZLE } from "src/db/database.module";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(DRIZZLE)
        private db: NodePgDatabase<typeof schema>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secret',
        });
    }

    async validate(payload: {
        sub: string;
        role: string;
        isProfileComplete: boolean;
        tokenVersion: number;
    }) {
    const result = await this.db
        .select({
            id: schema.users.id,
            role: schema.users.role,
            isProfileComplete: schema.users.isProfileComplete,
            tokenVersion: schema.users.tokenVersion,
            isDeleted: schema.users.isDeleted,
        })
        .from(schema.users)
        .where(eq(schema.users.id, payload.sub))
        .limit(1);

    const user = result[0];

    
    if (!user) throw new UnauthorizedException('User not found.');

    if (user.isDeleted) {
        throw new UnauthorizedException('Account has been deactivated. Please contact an administrator.');
    }

    if (user.tokenVersion !== payload.tokenVersion) {
        throw new UnauthorizedException('Session expired. Please log in again.');
    }
    return {
        id: user.id,
        isProfileComplete: user.isProfileComplete,
        role: user.role,
    };
}
}