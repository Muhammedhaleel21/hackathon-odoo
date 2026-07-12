import { z } from 'zod';

export const UpdateVehicleSchema = z.object({
  registrationNumber: z.string().min(1).max(20).optional(),
  name: z.string().min(1).max(100).optional(),
  type: z.string().min(1).max(50).optional(),
  capacity: z.number().int().positive().optional(),
  status: z.enum(['available', 'on_trip', 'on_maintenance']).optional(),
});

export type UpdateVehicleDto = z.infer<typeof UpdateVehicleSchema>;