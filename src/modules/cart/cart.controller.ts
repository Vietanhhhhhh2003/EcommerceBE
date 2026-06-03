import type { RequestHandler } from "express";
import { HTTP_STATUS } from "../../common/constants/http-status";
import { AppError } from "../../common/errors/app-error";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/response";
import * as cartService from "./cart.service";
import type {
  AddCartItemInput,
  ProductIdParams,
  UpdateCartItemInput
} from "./cart.validation";

const getAuthenticatedUserId = (request: Parameters<RequestHandler>[0]): string => {
  if (!request.user) {
    throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
  }

  return request.user.id;
};

export const getMyCart: RequestHandler = asyncHandler(async (request, response) => {
  const cart = await cartService.getMyCart(getAuthenticatedUserId(request));

  return successResponse(response, cart, "Cart retrieved");
});

export const addCartItem: RequestHandler = asyncHandler(async (request, response) => {
  const result = await cartService.addCartItem(
    getAuthenticatedUserId(request),
    request.body as AddCartItemInput
  );

  return successResponse(
    response,
    result.cart,
    "Cart item added",
    result.created ? HTTP_STATUS.CREATED : HTTP_STATUS.OK
  );
});

export const updateCartItemQuantity: RequestHandler = asyncHandler(
  async (request, response) => {
    const params = request.params as ProductIdParams;
    const body = request.body as UpdateCartItemInput;
    const cart = await cartService.updateCartItemQuantity(
      getAuthenticatedUserId(request),
      params.productId,
      body.quantity
    );

    return successResponse(response, cart, "Cart item updated");
  }
);

export const removeCartItem: RequestHandler = asyncHandler(
  async (request, response) => {
    const params = request.params as ProductIdParams;
    const cart = await cartService.removeCartItem(
      getAuthenticatedUserId(request),
      params.productId
    );

    return successResponse(response, cart, "Cart item removed");
  }
);

export const clearCart: RequestHandler = asyncHandler(async (request, response) => {
  const cart = await cartService.clearCart(getAuthenticatedUserId(request));

  return successResponse(response, cart, "Cart cleared");
});
