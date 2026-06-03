import { z } from "zod";

const emailSchema = z.string().trim().email().toLowerCase();
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const registerSchema = {
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
    name: z.string().trim().min(1, "Name is required").max(100)
  })
};

export const loginSchema = {
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required")
  })
};

export const refreshTokenSchema = {
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required")
  })
};

export const logoutSchema = refreshTokenSchema;

export type RegisterInput = z.infer<typeof registerSchema.body>;
export type LoginInput = z.infer<typeof loginSchema.body>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema.body>;
