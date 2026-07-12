import { z } from 'zod';

export const CreateFuelLogSchema = z.object({
  vehicleId: z.string().uuid(),
  odometer: z.number().int().nonnegative(),
  liters: z.number().int().positive(),
  cost: z.number().int().positive(),
});

export type CreateFuelLogDto = z.infer<typeof CreateFuelLogSchema>;