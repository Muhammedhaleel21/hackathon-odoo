import { z } from 'zod';

export const UpdateVehicleSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.string().min(1).max(50).optional(),
  capacity: z.number().int().positive().optional(),
  status: z.enum(['available', 'on_trip', 'on_maintenance']).optional(),
});

export type UpdateVehicleDto = z.infer<typeof UpdateVehicleSchema>;

export const AssignDriverSchema = z.object({
  driverId: z.string().uuid().nullable(),
});

export type AssignDriverDto = z.infer<typeof AssignDriverSchema>;
