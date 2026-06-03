import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app-error";
import { HTTP_STATUS } from "../constants/http-status";
import { errorResponse } from "../utils/response";

const DEFAULT_ERROR_MESSAGE = "Internal server error";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next
) => {
  void _next;

  if (error instanceof AppError) {
    return errorResponse(response, error.safeMessage, error.statusCode);
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  return errorResponse(
    response,
    DEFAULT_ERROR_MESSAGE,
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
};
