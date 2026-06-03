import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid product id");

const trimmedString = (fieldName: string) =>
  z.string().trim().min(1, `${fieldName} is required`);

const priceSchema = z.coerce.number().min(0, "Price must be greater than or equal to 0");
const stockSchema = z.coerce
  .number()
  .int("Stock must be an integer")
  .min(0, "Stock must be greater than or equal to 0");

const productStatusSchema = z.enum(["active", "inactive"]);
const sortSchema = z.enum(["newest", "oldest", "price_asc", "price_desc"]);

const normalizeOptionalQueryString = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
}, z.string().trim().optional());

export const createProductSchema = {
  body: z.object({
    name: trimmedString("Name").max(200, "Name must be at most 200 characters"),
    slug: trimmedString("Slug")
      .max(200, "Slug must be at most 200 characters")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain lowercase letters, numbers, and hyphens only"),
    description: trimmedString("Description").max(
      5000,
      "Description must be at most 5000 characters"
    ),
    price: priceSchema,
    category: trimmedString("Category").max(
      100,
      "Category must be at most 100 characters"
    ),
    stock: stockSchema,
    status: productStatusSchema.default("active")
  })
};

export const updateProductSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: z
    .object({
      name: trimmedString("Name").max(200, "Name must be at most 200 characters").optional(),
      slug: trimmedString("Slug")
        .max(200, "Slug must be at most 200 characters")
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Slug must contain lowercase letters, numbers, and hyphens only"
        )
        .optional(),
      description: trimmedString("Description")
        .max(5000, "Description must be at most 5000 characters")
        .optional(),
      price: priceSchema.optional(),
      category: trimmedString("Category")
        .max(100, "Category must be at most 100 characters")
        .optional(),
      stock: stockSchema.optional(),
      status: productStatusSchema.optional()
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
};

export const productIdParamsSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const listProductsSchema = {
  query: z
    .object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(10),
      search: normalizeOptionalQueryString,
      category: normalizeOptionalQueryString,
      minPrice: z.coerce.number().min(0).optional(),
      maxPrice: z.coerce.number().min(0).optional(),
      minStock: z.coerce.number().int().min(0).optional(),
      maxStock: z.coerce.number().int().min(0).optional(),
      sort: sortSchema.default("newest")
    })
    .superRefine((value, context) => {
      if (
        value.minPrice !== undefined &&
        value.maxPrice !== undefined &&
        value.minPrice > value.maxPrice
      ) {
        context.addIssue({
          code: "custom",
          path: ["minPrice"],
          message: "minPrice must be less than or equal to maxPrice"
        });
      }

      if (
        value.minStock !== undefined &&
        value.maxStock !== undefined &&
        value.minStock > value.maxStock
      ) {
        context.addIssue({
          code: "custom",
          path: ["minStock"],
          message: "minStock must be less than or equal to maxStock"
        });
      }
    })
};

export type CreateProductInput = z.infer<typeof createProductSchema.body>;
export type UpdateProductInput = z.infer<typeof updateProductSchema.body>;
export type ProductIdParams = z.infer<typeof productIdParamsSchema.params>;
export type ListProductsQuery = z.infer<typeof listProductsSchema.query>;
