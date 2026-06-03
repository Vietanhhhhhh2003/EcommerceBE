import type { RequestHandler } from "express";
import { HTTP_STATUS } from "../constants/http-status";
import { errorResponse } from "../utils/response";

export const notFoundMiddleware: RequestHandler = (request, response) => {
  return errorResponse(
    response,
    `Route ${request.method} ${request.path} not found`,
    HTTP_STATUS.NOT_FOUND
  );
};
