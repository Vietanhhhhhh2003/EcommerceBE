import type { RequestHandler } from "express";
import { HTTP_STATUS } from "../../common/constants/http-status";
import { AppError } from "../../common/errors/app-error";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/response";
import * as paymentService from "./payment.service";
import type {
  CreateVnpayPaymentInput,
  VnpayCallbackQuery,
  VnpayIpnQuery
} from "./payment.validation";

const getAuthenticatedUserId = (request: Parameters<RequestHandler>[0]): string => {
  if (!request.user) {
    throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
  }

  return request.user.id;
};

const getRequestIpAddress = (request: Parameters<RequestHandler>[0]): string => {
  const forwardedFor = request.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return forwardedFor[0];
  }

  return request.ip || "127.0.0.1";
};

export const createVnpayPaymentUrl: RequestHandler = asyncHandler(
  async (request, response) => {
    const result = await paymentService.createVnpayPaymentUrl(
      getAuthenticatedUserId(request),
      request.body as CreateVnpayPaymentInput,
      getRequestIpAddress(request)
    );

    return successResponse(response, result, "VNPay payment URL created");
  }
);

export const handleVnpayReturn: RequestHandler = asyncHandler(
  async (request, response) => {
    const result = await paymentService.handleVnpayReturn(
      request.query as unknown as VnpayCallbackQuery
    );

    return successResponse(response, result, "VNPay return processed");
  }
);

export const handleVnpayIpn: RequestHandler = asyncHandler(async (request, response) => {
  const result = await paymentService.handleVnpayIpn(
    request.query as unknown as VnpayIpnQuery
  );

  return response.status(HTTP_STATUS.OK).json(result);
});
