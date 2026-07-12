import { z } from 'zod';

export const UpdateDriverSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7).max(15).optional(),
  licenseNumber: z.string().min(1).max(50).optional(),
  licenseCategory: z.string().min(1).max(20).optional(),
  licenseExpiryDate: z.coerce.date().optional(),
  safetyScore: z.number().int().min(0).optional(),
  status: z.enum(['available', 'on_trip', 'off_duty', 'suspended']).optional(),
});

export type UpdateDriverDto = z.infer<typeof UpdateDriverSchema>;