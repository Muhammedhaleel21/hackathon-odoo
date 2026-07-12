import { z } from 'zod';

export const UpdateTripSchema = z.object({
  source: z.string().min(1).max(255).optional(),
  destination: z.string().min(1).max(255).optional(),
  vehicleId: z.string().uuid().optional(),
  driverId: z.string().uuid().optional(),
  cargoWeight: z.number().int().positive().optional(),
  plannedDistance: z.number().int().positive().optional(),
  status: z.enum(['draft', 'dispatched', 'completed', 'cancelled']).optional(),
});

export type UpdateTripDto = z.infer<typeof UpdateTripSchema>;