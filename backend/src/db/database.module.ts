import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config();

export const DRIZZLE = Symbol('drizzle-connection');

@Global()
@Module({
    providers: [
        {
            provide: DRIZZLE,
            useFactory: async () => {
                const pool = new Pool({
                    connectionString: process.env.DATABASE_URL!,
                });
                const db = drizzle(pool, { schema });

                await migrate(db, {
                    migrationsFolder: join(process.cwd(), 'drizzle'),
                });

                return db;
            },
        },
    ],
    exports: [DRIZZLE],
})
export class DatabaseModule {}