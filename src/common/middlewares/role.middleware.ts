import type { RequestHandler } from "express";
import { HTTP_STATUS } from "../constants/http-status";
import { AppError } from "../errors/app-error";
import type { UserRole } from "../../modules/users/user.model";

export const roleMiddleware = (...allowedRoles: UserRole[]): RequestHandler => {
  return (request, _response, next) => {
    if (!request.user) {
      next(new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    if (!allowedRoles.includes(request.user.role)) {
      next(new AppError("Forbidden", HTTP_STATUS.FORBIDDEN));
      return;
    }

    next();
  };
};
