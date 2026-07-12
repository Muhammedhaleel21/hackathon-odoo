import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as schema from '../schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool, { schema });

export async function seedAdmin() {
  const employeeId = process.env.ADMIN_ID;
  const email = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!employeeId) throw new Error('ADMIN_ID is not set in .env');
  if (!email) throw new Error('ADMIN_EMAIL is not set in .env');
  if (!adminPassword) throw new Error('ADMIN_PASSWORD is not set in .env');

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await db
    .insert(schema.users)
    .values({
      employeeId,
      fullName: 'Admin',
      email,
      role: 'admin',
      password: hashedPassword,
      isFirstLogin: false,
      isProfileComplete: true,
    })
    .onConflictDoNothing();

  console.log('✅ Admin user seeded successfully');
}


export async function closeSeedConnection() {
  await pool.end();
}