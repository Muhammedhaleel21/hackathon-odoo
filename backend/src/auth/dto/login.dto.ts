import { z } from 'zod';

export const LoginSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type LoginInput = LoginDto;