import type { RequestHandler } from "express";
import { AppError } from "../../common/errors/app-error";
import { HTTP_STATUS } from "../../common/constants/http-status";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/response";
import * as userService from "./user.service";
import type {
  ListUsersQuery,
  UpdateMeInput,
  UpdateUserRoleInput,
  UpdateUserStatusInput,
  UserIdParams
} from "./user.validation";

const getAuthenticatedUserId = (request: Parameters<RequestHandler>[0]): string => {
  if (!request.user) {
    throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
  }

  return request.user.id;
};

export const getMe: RequestHandler = asyncHandler(async (request, response) => {
  const user = await userService.getUserProfile(getAuthenticatedUserId(request));

  return successResponse(response, user, "Current user profile retrieved");
});

export const updateMe: RequestHandler = asyncHandler(async (request, response) => {
  const user = await userService.updateUserProfile(
    getAuthenticatedUserId(request),
    request.body as UpdateMeInput
  );

  return successResponse(response, user, "Current user profile updated");
});

export const listUsers: RequestHandler = asyncHandler(
  async (request, response) => {
    const result = await userService.listUsers(
      request.query as unknown as ListUsersQuery
    );

    return successResponse(response, result, "Users retrieved");
  }
);

export const getUserDetail: RequestHandler = asyncHandler(
  async (request, response) => {
    const params = request.params as UserIdParams;
    const user = await userService.getUserById(params.id);

    return successResponse(response, user, "User detail retrieved");
  }
);

export const updateUserRole: RequestHandler = asyncHandler(
  async (request, response) => {
    const params = request.params as UserIdParams;
    const body = request.body as UpdateUserRoleInput;
    const user = await userService.updateUserRole(params.id, body.role);

    return successResponse(response, user, "User role updated");
  }
);

export const updateUserStatus: RequestHandler = asyncHandler(
  async (request, response) => {
    const params = request.params as UserIdParams;
    const body = request.body as UpdateUserStatusInput;
    const user = await userService.updateUserStatus(params.id, body.status);

    return successResponse(response, user, "User status updated");
  }
);
