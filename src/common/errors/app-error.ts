import { HTTP_STATUS, type HttpStatusCode } from "../constants/http-status";

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly safeMessage: string;
  public readonly isOperational: boolean;

  public constructor(
    message: string,
    statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.safeMessage = message;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
