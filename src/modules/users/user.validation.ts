import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid user id");

export const updateMeSchema = {
  body: z
    .object({
      name: z.string().trim().min(1, "Name is required").max(100)
    })
    .strict()
};

export const listUsersSchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10)
  })
};

export const userIdParamsSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const updateUserRoleSchema = {
  params: userIdParamsSchema.params,
  body: z.object({
    role: z.enum(["user", "admin"])
  })
};

export const updateUserStatusSchema = {
  params: userIdParamsSchema.params,
  body: z.object({
    status: z.enum(["active", "disabled"])
  })
};

export type UpdateMeInput = z.infer<typeof updateMeSchema.body>;
export type ListUsersQuery = z.infer<typeof listUsersSchema.query>;
export type UserIdParams = z.infer<typeof userIdParamsSchema.params>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema.body>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema.body>;
