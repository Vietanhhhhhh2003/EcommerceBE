import type { RequestHandler } from "express";
import { HTTP_STATUS } from "../../common/constants/http-status";
import { AppError } from "../../common/errors/app-error";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/response";
import * as orderService from "./order.service";
import type {
  ListMyOrdersQuery,
  OrderIdParams,
  UpdateOrderStatusInput
} from "./order.validation";

const getAuthenticatedUser = (request: Parameters<RequestHandler>[0]) => {
  if (!request.user) {
    throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
  }

  return request.user;
};

export const createOrder: RequestHandler = asyncHandler(async (request, response) => {
  const order = await orderService.createOrder(getAuthenticatedUser(request).id);

  return successResponse(response, order, "Order created", HTTP_STATUS.CREATED);
});

export const listMyOrders: RequestHandler = asyncHandler(async (request, response) => {
  const orders = await orderService.listMyOrders(
    getAuthenticatedUser(request).id,
    request.query as unknown as ListMyOrdersQuery
  );

  return successResponse(response, orders, "Orders retrieved");
});

export const getOrderDetail: RequestHandler = asyncHandler(async (request, response) => {
  const user = getAuthenticatedUser(request);
  const params = request.params as OrderIdParams;
  const order = await orderService.getOrderDetail(user.id, user.role, params.id);

  return successResponse(response, order, "Order detail retrieved");
});

export const cancelOrder: RequestHandler = asyncHandler(async (request, response) => {
  const user = getAuthenticatedUser(request);
  const params = request.params as OrderIdParams;
  const order = await orderService.cancelOrder(user.id, params.id);

  return successResponse(response, order, "Order cancelled");
});

export const updateOrderStatus: RequestHandler = asyncHandler(
  async (request, response) => {
    const params = request.params as OrderIdParams;
    const order = await orderService.updateOrderStatus(
      params.id,
      request.body as UpdateOrderStatusInput
    );

    return successResponse(response, order, "Order status updated");
  }
);
