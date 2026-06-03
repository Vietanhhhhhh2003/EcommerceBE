import type { RequestHandler } from "express";
import { HTTP_STATUS } from "../constants/http-status";
import { AppError } from "../errors/app-error";
import { User, toSafeUser } from "../../modules/users/user.model";
import { verifyAccessToken } from "../../modules/auth/token.service";

const getBearerToken = (authorizationHeader?: string): string => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    throw new AppError("Authentication token is required", HTTP_STATUS.UNAUTHORIZED);
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  if (!token) {
    throw new AppError("Authentication token is required", HTTP_STATUS.UNAUTHORIZED);
  }

  return token;
};

export const authMiddleware: RequestHandler = async (request, _response, next) => {
  try {
    const accessToken = getBearerToken(request.headers.authorization);
    const payload = verifyAccessToken(accessToken);
    const user = await User.findById(payload.userId);

    if (!user) {
      throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    request.user = toSafeUser(user);
    next();
  } catch (error) {
    next(error);
  }
};
