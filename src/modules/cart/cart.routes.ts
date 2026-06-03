import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import * as cartController from "./cart.controller";
import {
  addCartItemSchema,
  productIdParamsSchema,
  updateCartItemSchema
} from "./cart.validation";

export const cartRoutes = Router();

cartRoutes.use(authMiddleware);

cartRoutes.get("/", cartController.getMyCart);
cartRoutes.post(
  "/items",
  validate(addCartItemSchema),
  cartController.addCartItem
);
cartRoutes.patch(
  "/items/:productId",
  validate(updateCartItemSchema),
  cartController.updateCartItemQuantity
);
cartRoutes.delete(
  "/items/:productId",
  validate(productIdParamsSchema),
  cartController.removeCartItem
);
cartRoutes.delete("/", cartController.clearCart);
