import { z } from 'zod';

export const CreateExpenseSchema = z.object({
  vehicleId: z.string().uuid(),
  type: z.enum(['fuel', 'maintenance']),
  amount: z.number().int().positive(),
  sourceId: z.string().uuid().optional(),
  description: z.string().max(500).optional(),
});

export type CreateExpenseDto = z.infer<typeof CreateExpenseSchema>;