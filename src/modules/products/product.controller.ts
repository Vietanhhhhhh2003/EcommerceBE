import type { RequestHandler } from "express";
import { HTTP_STATUS } from "../../common/constants/http-status";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/response";
import * as productService from "./product.service";
import type {
  CreateProductInput,
  ListProductsQuery,
  ProductIdParams,
  UpdateProductInput
} from "./product.validation";

export const listProducts: RequestHandler = asyncHandler(
  async (request, response) => {
    const result = await productService.listProducts(
      request.query as unknown as ListProductsQuery
    );

    return successResponse(response, result, "Products retrieved");
  }
);

export const getProductDetail: RequestHandler = asyncHandler(
  async (request, response) => {
    const params = request.params as ProductIdParams;
    const product = await productService.getPublicProductById(params.id);

    return successResponse(response, product, "Product detail retrieved");
  }
);

export const createProduct: RequestHandler = asyncHandler(
  async (request, response) => {
    const product = await productService.createProduct(
      request.body as CreateProductInput
    );

    return successResponse(
      response,
      product,
      "Product created",
      HTTP_STATUS.CREATED
    );
  }
);

export const updateProduct: RequestHandler = asyncHandler(
  async (request, response) => {
    const params = request.params as ProductIdParams;
    const product = await productService.updateProduct(
      params.id,
      request.body as UpdateProductInput
    );

    return successResponse(response, product, "Product updated");
  }
);

export const deleteProduct: RequestHandler = asyncHandler(
  async (request, response) => {
    const params = request.params as ProductIdParams;
    await productService.deleteProduct(params.id);

    return successResponse(response, null, "Product deleted");
  }
);
