import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid order id");

const paginationNumberSchema = (fieldName: string, min: number, max?: number) => {
  let schema = z.coerce
    .number()
    .int(`${fieldName} must be an integer`)
    .min(min, `${fieldName} must be at least ${min}`);

  if (max !== undefined) {
    schema = schema.max(max, `${fieldName} must be at most ${max}`);
  }

  return schema;
};

export const orderIdParamsSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const listMyOrdersSchema = {
  query: z
    .object({
      page: paginationNumberSchema("page", 1).default(1),
      limit: paginationNumberSchema("limit", 1, 100).default(10)
    })
    .strict()
};

export const updateOrderStatusSchema = {
  params: orderIdParamsSchema.params,
  body: z
    .object({
      status: z.enum(["pending", "confirmed", "cancelled", "completed"])
    })
    .strict()
};

export const cancelOrderSchema = {
  params: orderIdParamsSchema.params
};

export const getOrderDetailSchema = {
  params: orderIdParamsSchema.params
};

export type OrderIdParams = z.infer<typeof orderIdParamsSchema.params>;
export type ListMyOrdersQuery = z.infer<typeof listMyOrdersSchema.query>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema.body>;
