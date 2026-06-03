import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { roleMiddleware } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import * as productController from "./product.controller";
import {
  createProductSchema,
  listProductsSchema,
  productIdParamsSchema,
  updateProductSchema
} from "./product.validation";

export const productRoutes = Router();

productRoutes.get("/", validate(listProductsSchema), productController.listProducts);
productRoutes.get(
  "/:id",
  validate(productIdParamsSchema),
  productController.getProductDetail
);

productRoutes.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  validate(createProductSchema),
  productController.createProduct
);
productRoutes.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  validate(updateProductSchema),
  productController.updateProduct
);
productRoutes.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  validate(productIdParamsSchema),
  productController.deleteProduct
);
