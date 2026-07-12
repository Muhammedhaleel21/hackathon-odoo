import { z } from 'zod';

export const CreateTripSchema = z.object({
  source: z.string().min(1).max(255),
  destination: z.string().min(1).max(255),
  vehicleId: z.string().uuid(),
  driverId: z.string().uuid(),
  cargoWeight: z.number().int().positive(),
  plannedDistance: z.number().int().positive(),
});

export type CreateTripDto = z.infer<typeof CreateTripSchema>;