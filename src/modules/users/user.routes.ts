import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { roleMiddleware } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import * as userController from "./user.controller";
import {
  listUsersSchema,
  updateMeSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  userIdParamsSchema
} from "./user.validation";

export const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.get("/me", userController.getMe);
userRoutes.patch("/me", validate(updateMeSchema), userController.updateMe);

userRoutes.get(
  "/",
  roleMiddleware("admin"),
  validate(listUsersSchema),
  userController.listUsers
);
userRoutes.get(
  "/:id",
  roleMiddleware("admin"),
  validate(userIdParamsSchema),
  userController.getUserDetail
);
userRoutes.patch(
  "/:id/role",
  roleMiddleware("admin"),
  validate(updateUserRoleSchema),
  userController.updateUserRole
);
userRoutes.patch(
  "/:id/status",
  roleMiddleware("admin"),
  validate(updateUserStatusSchema),
  userController.updateUserStatus
);
