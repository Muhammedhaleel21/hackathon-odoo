import { z } from 'zod';

export const UpdateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(7).max(15).optional(),
  role: z.enum(['admin', 'fleet_manager', 'driver']).optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
