import { z } from "zod";

export const createUserSchema = z.object({
  userId: z
    .string()
    .min(3, "User ID must be at least 3 characters")
    .max(50, "User ID must be at most 50 characters"),
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain digits only")
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone number must be at most 15 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "fleet_manager", "driver"], {
    error: "Please select a valid role",
  }),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^\d+$/, "Phone number must contain digits only")
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone number must be at most 15 digits")
    .optional(),
  role: z
    .enum(["admin", "fleet_manager", "driver"])
    .optional(),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
