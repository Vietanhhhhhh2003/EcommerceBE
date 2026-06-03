import type { RequestHandler } from "express";
import { HTTP_STATUS } from "../../common/constants/http-status";
import { AppError } from "../../common/errors/app-error";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/response";
import * as authService from "./auth.service";
import type {
  LoginInput,
  RefreshTokenInput,
  RegisterInput
} from "./auth.validation";

export const register: RequestHandler = asyncHandler(async (request, response) => {
  const result = await authService.register(request.body as RegisterInput);

  return successResponse(
    response,
    result,
    "Registration successful",
    HTTP_STATUS.CREATED
  );
});

export const login: RequestHandler = asyncHandler(async (request, response) => {
  const result = await authService.login(request.body as LoginInput);

  return successResponse(response, result, "Login successful");
});

export const refreshToken: RequestHandler = asyncHandler(
  async (request, response) => {
    const result = await authService.refreshAccessToken(
      request.body as RefreshTokenInput
    );

    return successResponse(response, result, "Access token refreshed");
  }
);

export const logout: RequestHandler = asyncHandler(async (request, response) => {
  await authService.logout(request.body as RefreshTokenInput);

  return successResponse(response, null, "Logout successful");
});

export const me: RequestHandler = asyncHandler(async (request, response) => {
  if (!request.user) {
    throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await authService.getCurrentUser(request.user.id);

  return successResponse(response, user, "Current user retrieved");
});
