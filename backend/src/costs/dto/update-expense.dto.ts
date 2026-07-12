import { z } from 'zod';

export const UpdateExpenseSchema = z.object({
  amount: z.number().int().positive().optional(),
  description: z.string().max(500).optional(),
});

export type UpdateExpenseDto = z.infer<typeof UpdateExpenseSchema>;