import { Router } from "express";
import { successResponse } from "../../common/utils/response";

export const healthRoutes = Router();

healthRoutes.get("/", (_request, response) => {
  return successResponse(response, { status: "ok" }, "Server is running");
});
