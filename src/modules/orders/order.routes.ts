import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { roleMiddleware } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import * as orderController from "./order.controller";
import {
  cancelOrderSchema,
  getOrderDetailSchema,
  listMyOrdersSchema,
  updateOrderStatusSchema
} from "./order.validation";

export const orderRoutes = Router();

orderRoutes.use(authMiddleware);

orderRoutes.post("/", orderController.createOrder);
orderRoutes.get("/me", validate(listMyOrdersSchema), orderController.listMyOrders);
orderRoutes.get("/:id", validate(getOrderDetailSchema), orderController.getOrderDetail);
orderRoutes.patch(
  "/:id/cancel",
  validate(cancelOrderSchema),
  orderController.cancelOrder
);
orderRoutes.patch(
  "/:id/status",
  roleMiddleware("admin"),
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus
);
