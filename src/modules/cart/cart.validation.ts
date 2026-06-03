import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid product id");

const quantitySchema = z.coerce
  .number()
  .int("Quantity must be an integer")
  .min(1, "Quantity must be greater than 0");

export const productIdParamsSchema = {
  params: z.object({
    productId: objectIdSchema
  })
};

export const addCartItemSchema = {
  body: z
    .object({
      productId: objectIdSchema,
      quantity: quantitySchema
    })
    .strict()
};

export const updateCartItemSchema = {
  params: productIdParamsSchema.params,
  body: z
    .object({
      quantity: quantitySchema
    })
    .strict()
};

export type ProductIdParams = z.infer<typeof productIdParamsSchema.params>;
export type AddCartItemInput = z.infer<typeof addCartItemSchema.body>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema.body>;
