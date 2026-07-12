import { z } from 'zod';

export const CreateMaintenanceSchema = z.object({
  vehicleId: z.string().uuid(),
  description: z.string().min(1).max(500),
  startedAt: z.coerce.date().optional(),
});

export type CreateMaintenanceDto = z.infer<typeof CreateMaintenanceSchema>;