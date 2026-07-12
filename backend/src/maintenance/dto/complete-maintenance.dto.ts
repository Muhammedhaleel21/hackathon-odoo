import { z } from 'zod';

export const CompleteMaintenanceSchema = z.object({
  expenseAmount: z.number().int().nonnegative().optional(),
});

export type CompleteMaintenanceDto = z.infer<typeof CompleteMaintenanceSchema>;