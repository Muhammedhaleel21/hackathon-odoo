import { z } from 'zod';

export const CreateDriverSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(15),
  password: z.string().min(8),
  licenseNumber: z.string().min(1).max(50),
  licenseCategory: z.string().min(1).max(20),
  licenseExpiryDate: z.coerce.date(),
  safetyScore: z.number().int().min(0),
  status: z.enum(['available', 'on_trip', 'off_duty', 'suspended']).optional().default('available'),
});

export type CreateDriverDto = z.infer<typeof CreateDriverSchema>;