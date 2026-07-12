import { z } from 'zod';

export const RegisterSchema = z.object({
  userId: z.string().min(3).max(50),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(15),
  password: z.string().min(8),
  role: z.enum(['admin', 'fleet_manager', 'driver']).optional().default('driver'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
