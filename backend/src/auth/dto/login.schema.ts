import { z } from "zod";

export const LoginSchema = z.object({
    id: z.string().min(1, "ID is required"),
    password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;