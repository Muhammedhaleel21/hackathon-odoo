import { z } from 'zod';

export const CreateVehicleSchema = z.object({
  registrationNumber: z.string().min(1).max(20),
  name: z.string().min(1).max(100),
  type: z.string().min(1).max(50),
  capacity: z.number().int().positive(),
  maxLoadCapacity: z.number().int().nonnegative().optional().default(0),
  odometer: z.number().int().nonnegative().optional().default(0),
  driverId: z.string().uuid().optional(),
  status: z
    .enum(['available', 'on_trip', 'on_maintenance', 'in_shop'])
    .optional()
    .default('available'),
});

export type CreateVehicleDto = z.infer<typeof CreateVehicleSchema>;
