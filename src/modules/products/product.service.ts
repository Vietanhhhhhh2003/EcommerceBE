import type { FilterQuery, SortOrder } from "mongoose";
import { HTTP_STATUS } from "../../common/constants/http-status";
import { AppError } from "../../common/errors/app-error";
import {
  Product,
  toSafeProduct,
  type IProduct,
  type ProductStatus,
  type SafeProduct
} from "./product.model";
import type {
  CreateProductInput,
  ListProductsQuery,
  UpdateProductInput
} from "./product.validation";

interface PaginatedProducts {
  items: SafeProduct[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

const buildPublicProductFilter = (
  query: ListProductsQuery
): FilterQuery<IProduct> => {
  const filter: FilterQuery<IProduct> = {
    status: "active"
  };

  if (query.search) {
    const pattern = new RegExp(query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: pattern }, { description: pattern }];
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {};

    if (query.minPrice !== undefined) {
      filter.price.$gte = query.minPrice;
    }

    if (query.maxPrice !== undefined) {
      filter.price.$lte = query.maxPrice;
    }
  }

  if (query.minStock !== undefined || query.maxStock !== undefined) {
    filter.stock = {};

    if (query.minStock !== undefined) {
      filter.stock.$gte = query.minStock;
    }

    if (query.maxStock !== undefined) {
      filter.stock.$lte = query.maxStock;
    }
  }

  return filter;
};

const getSortOption = (
  sort: ListProductsQuery["sort"]
): Record<string, SortOrder> => {
  switch (sort) {
    case "oldest":
      return { createdAt: 1 };
    case "price_asc":
      return { price: 1, createdAt: -1 };
    case "price_desc":
      return { price: -1, createdAt: -1 };
    case "newest":
    default:
      return { createdAt: -1 };
  }
};

const assertSlugIsUnique = async (
  slug: string,
  excludedProductId?: string
): Promise<void> => {
  const existingProduct = await Product.findOne({
    slug,
    ...(excludedProductId ? { _id: { $ne: excludedProductId } } : {})
  });

  if (existingProduct) {
    throw new AppError("Product slug already exists", HTTP_STATUS.CONFLICT);
  }
};

export const listProducts = async (
  query: ListProductsQuery
): Promise<PaginatedProducts> => {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const filter = buildPublicProductFilter(query);
  const [products, totalItems] = await Promise.all([
    Product.find(filter).sort(getSortOption(query.sort)).skip(skip).limit(limit),
    Product.countDocuments(filter)
  ]);

  return {
    items: products.map(toSafeProduct),
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  };
};

export const getPublicProductById = async (productId: string): Promise<SafeProduct> => {
  const product = await Product.findOne({ _id: productId, status: "active" });

  if (!product) {
    throw new AppError("Product not found", HTTP_STATUS.NOT_FOUND);
  }

  return toSafeProduct(product);
};

export const createProduct = async (
  input: CreateProductInput
): Promise<SafeProduct> => {
  await assertSlugIsUnique(input.slug);

  const product = await Product.create(input);

  return toSafeProduct(product);
};

export const updateProduct = async (
  productId: string,
  input: UpdateProductInput
): Promise<SafeProduct> => {
  if (input.slug) {
    await assertSlugIsUnique(input.slug, productId);
  }

  const product = await Product.findByIdAndUpdate(productId, input, {
    new: true,
    runValidators: true
  });

  if (!product) {
    throw new AppError("Product not found", HTTP_STATUS.NOT_FOUND);
  }

  return toSafeProduct(product);
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    throw new AppError("Product not found", HTTP_STATUS.NOT_FOUND);
  }
};

export const isProductStatus = (status: string): status is ProductStatus => {
  return status === "active" || status === "inactive";
};
