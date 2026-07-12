import { z } from 'zod';

export const CreateUserSchema = z.object({
  userId: z.string().min(3).max(20),
  name: z.string().min(2).max(100),
  email: z.email(),
  phone: z.string().min(7).max(15),
  password: z.string().min(8),
  role: z.enum(['admin', 'fleet_manager', 'driver']),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;