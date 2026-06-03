import type { RequestHandler } from "express";
import { ZodError, type ZodType } from "zod";
import { HTTP_STATUS } from "../constants/http-status";
import { AppError } from "../errors/app-error";

export interface ValidationSchema {
  body?: ZodType<unknown>;
  params?: ZodType<unknown>;
  query?: ZodType<unknown>;
}

const formatZodError = (error: ZodError): string => {
  return error.issues
    .map((issue) => {
      const path = issue.path.join(".");
      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join("; ");
};

export const validate = (schema: ValidationSchema): RequestHandler => {
  return (request, _response, next) => {
    try {
      if (schema.body) {
        request.body = schema.body.parse(request.body);
      }

      if (schema.params) {
        request.params = schema.params.parse(request.params) as typeof request.params;
      }

      if (schema.query) {
        request.query = schema.query.parse(request.query) as typeof request.query;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError(formatZodError(error), HTTP_STATUS.BAD_REQUEST));
        return;
      }

      next(error);
    }
  };
};
