import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import * as paymentController from "./payment.controller";
import {
  createVnpayPaymentSchema,
  vnpayCallbackQuerySchema,
  vnpayIpnQuerySchema
} from "./payment.validation";

export const paymentRoutes = Router();

paymentRoutes.post(
  "/vnpay/create",
  authMiddleware,
  validate(createVnpayPaymentSchema),
  paymentController.createVnpayPaymentUrl
);
paymentRoutes.get(
  "/vnpay/return",
  validate(vnpayCallbackQuerySchema),
  paymentController.handleVnpayReturn
);
paymentRoutes.get(
  "/vnpay/ipn",
  validate(vnpayIpnQuerySchema),
  paymentController.handleVnpayIpn
);
