import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { roleMiddleware } from "../../common/middlewares/role.middleware";
import {
  uploadAvatarMiddleware,
  uploadProductImagesMiddleware
} from "../../common/middlewares/upload.middleware";
import * as uploadController from "./upload.controller";

export const uploadRoutes = Router();

uploadRoutes.post(
  "/products",
  authMiddleware,
  roleMiddleware("admin"),
  uploadProductImagesMiddleware,
  uploadController.uploadProductImages
);

uploadRoutes.post(
  "/avatar",
  authMiddleware,
  uploadAvatarMiddleware,
  uploadController.uploadAvatar
);
