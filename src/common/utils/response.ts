import type { Response } from "express";
import { HTTP_STATUS, type HttpStatusCode } from "../constants/http-status";

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}

export const successResponse = <T>(
  response: Response,
  data: T,
  message = "Success",
  statusCode: HttpStatusCode = HTTP_STATUS.OK
): Response<ApiResponse<T>> => {
  return response.status(statusCode).json({
    success: true,
    data,
    message
  });
};

export const errorResponse = (
  response: Response,
  message: string,
  statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR
): Response<ApiResponse<null>> => {
  return response.status(statusCode).json({
    success: false,
    data: null,
    message
  });
};
