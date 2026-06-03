import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import * as authController from "./auth.controller";
import {
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema
} from "./auth.validation";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  validate(registerSchema),
  authController.register
);
authRoutes.post("/login", validate(loginSchema), authController.login);
authRoutes.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  authController.refreshToken
);
authRoutes.post("/logout", validate(logoutSchema), authController.logout);
authRoutes.get("/me", authMiddleware, authController.me);
