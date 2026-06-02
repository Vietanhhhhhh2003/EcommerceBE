import { Router } from "express";

export const healthRoutes = Router();

healthRoutes.get("/", (_request, response) => {
  response.status(200).json({
    success: true,
    data: {
      status: "ok"
    },
    message: "Server is running"
  });
});
