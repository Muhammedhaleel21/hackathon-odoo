import { z } from 'zod';

export const UpdateFuelLogSchema = z.object({
  odometer: z.number().int().nonnegative().optional(),
  liters: z.number().int().positive().optional(),
  cost: z.number().int().positive().optional(),
});

export type UpdateFuelLogDto = z.infer<typeof UpdateFuelLogSchema>;