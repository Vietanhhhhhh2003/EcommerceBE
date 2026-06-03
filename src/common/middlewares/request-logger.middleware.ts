import type { RequestHandler } from "express";

export const requestLoggerMiddleware: RequestHandler = (
  request,
  response,
  next
) => {
  const startedAt = Date.now();

  response.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    console.log(
      `${request.method} ${request.path} ${response.statusCode} ${durationMs}ms`
    );
  });

  next();
};
