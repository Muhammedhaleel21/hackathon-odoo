import { z } from 'zod';

export const UpdateMaintenanceSchema = z.object({
  description: z.string().min(1).max(500).optional(),
  startedAt: z.coerce.date().optional(),
});

export type UpdateMaintenanceDto = z.infer<typeof UpdateMaintenanceSchema>;