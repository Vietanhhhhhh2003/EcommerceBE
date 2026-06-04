import { HTTP_STATUS } from "../../common/constants/http-status";
import { AppError } from "../../common/errors/app-error";
import { sendPaymentSuccessEmail } from "../notifications/notification.service";
import {
  Order,
  type OrderDocument,
  type OrderStatus,
  type PaymentMethod,
  type PaymentStatus
} from "../orders/order.model";
import { User } from "../users/user.model";
import type {
  CreateVnpayPaymentInput,
  VnpayCallbackQuery,
  VnpayIpnQuery
} from "./payment.validation";
import {
  buildIpnFailureResponse,
  buildIpnSuccessResponse,
  buildVnpayPaymentUrl,
  generateTxnRef,
  isSuccessfulVnpayResponse,
  parseVnpayPayDate,
  toVnpayAmount,
  verifyVnpaySecureHash
} from "./vnpay.service";

interface PaymentOrderSummary {
  id: string;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentAmount?: number;
  vnpayTxnRef?: string;
  paymentTransactionId?: string;
  vnpayResponseCode?: string;
  paidAt?: Date;
  status: OrderStatus;
}

interface CreateVnpayPaymentResult {
  paymentUrl: string;
  order: PaymentOrderSummary;
}

interface HandleVnpayReturnResult {
  order: PaymentOrderSummary;
}

interface IpnResponsePayload {
  RspCode: string;
  Message: string;
}

const PAYABLE_ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed"];
const PAYABLE_PAYMENT_STATUSES: PaymentStatus[] = ["unpaid", "pending", "failed"];

const getEffectivePaymentStatus = (order: OrderDocument): PaymentStatus => {
  return order.paymentStatus ?? "unpaid";
};

const toPaymentOrderSummary = (order: OrderDocument): PaymentOrderSummary => {
  return {
    id: order.id,
    paymentMethod: order.paymentMethod,
    paymentStatus: getEffectivePaymentStatus(order),
    paymentAmount: order.paymentAmount,
    vnpayTxnRef: order.vnpayTxnRef,
    paymentTransactionId: order.paymentTransactionId,
    vnpayResponseCode: order.vnpayResponseCode,
    paidAt: order.paidAt,
    status: order.status
  };
};

const getOrderById = async (orderId: string): Promise<OrderDocument> => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError("Order not found", HTTP_STATUS.NOT_FOUND);
  }

  return order;
};

const getOrderByTxnRef = async (txnRef: string): Promise<OrderDocument | null> => {
  return Order.findOne({ vnpayTxnRef: txnRef });
};

const ensureCreatePaymentAccess = (order: OrderDocument, userId: string): void => {
  if (order.userId.toString() !== userId) {
    throw new AppError("Forbidden", HTTP_STATUS.FORBIDDEN);
  }
};

const ensureOrderIsPayable = (order: OrderDocument): void => {
  if (!PAYABLE_ORDER_STATUSES.includes(order.status)) {
    throw new AppError("Order is not payable", HTTP_STATUS.CONFLICT);
  }

  const paymentStatus = getEffectivePaymentStatus(order);

  if (paymentStatus === "paid") {
    throw new AppError("Order is already paid", HTTP_STATUS.CONFLICT);
  }

  if (!PAYABLE_PAYMENT_STATUSES.includes(paymentStatus)) {
    throw new AppError("Order is not payable", HTTP_STATUS.CONFLICT);
  }
};

const ensureCallbackAmountMatches = (
  order: OrderDocument,
  callbackAmount: string
): void => {
  if (String(toVnpayAmount(order.totalAmount)) !== callbackAmount) {
    throw new AppError("VNPay amount does not match order amount", HTTP_STATUS.BAD_REQUEST);
  }
};

const applySuccessfulPayment = (
  order: OrderDocument,
  query: VnpayCallbackQuery | (VnpayIpnQuery & { vnp_SecureHash: string })
): void => {
  order.paymentMethod = "vnpay";
  order.paymentStatus = "paid";
  order.paymentAmount = order.totalAmount;
  order.paymentTransactionId = query.vnp_TransactionNo;
  order.paidAt = parseVnpayPayDate(query.vnp_PayDate) ?? new Date();
  order.vnpayResponseCode = query.vnp_ResponseCode;
  order.vnpayTxnRef = query.vnp_TxnRef;

  if (order.status === "pending") {
    order.status = "confirmed";
  }
};

const applyFailedPayment = (
  order: OrderDocument,
  query: VnpayCallbackQuery | (VnpayIpnQuery & { vnp_SecureHash: string })
): void => {
  order.paymentMethod = "vnpay";
  order.paymentStatus = "failed";
  order.paymentAmount = order.totalAmount;
  order.paymentTransactionId = query.vnp_TransactionNo;
  order.paidAt = undefined;
  order.vnpayResponseCode = query.vnp_ResponseCode;
  order.vnpayTxnRef = query.vnp_TxnRef;
};

const generateUniqueTxnRef = async (): Promise<string> => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const txnRef = generateTxnRef();
    const existingOrder = await Order.exists({ vnpayTxnRef: txnRef });

    if (!existingOrder) {
      return txnRef;
    }
  }

  throw new AppError("Failed to generate VNPay transaction reference", HTTP_STATUS.INTERNAL_SERVER_ERROR);
};

const sendPaymentSuccessNotification = async (
  order: OrderDocument
): Promise<void> => {
  const user = await User.findById(order.userId).select("email name");

  if (!user) {
    return;
  }

  await sendPaymentSuccessEmail(
    {
      email: user.email,
      name: user.name
    },
    {
      id: order.id,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentTransactionId: order.paymentTransactionId
    }
  );
};

export const createVnpayPaymentUrl = async (
  userId: string,
  input: CreateVnpayPaymentInput,
  ipAddress: string
): Promise<CreateVnpayPaymentResult> => {
  const order = await getOrderById(input.orderId);

  ensureCreatePaymentAccess(order, userId);
  ensureOrderIsPayable(order);

  const txnRef = await generateUniqueTxnRef();

  order.paymentMethod = "vnpay";
  order.paymentStatus = "pending";
  order.paymentAmount = order.totalAmount;
  order.paymentTransactionId = undefined;
  order.paidAt = undefined;
  order.vnpayResponseCode = undefined;
  order.vnpayTxnRef = txnRef;
  await order.save();

  return {
    paymentUrl: buildVnpayPaymentUrl({
      amount: order.totalAmount,
      ipAddress,
      orderId: order.id,
      txnRef
    }),
    order: toPaymentOrderSummary(order)
  };
};

export const handleVnpayReturn = async (
  query: VnpayCallbackQuery
): Promise<HandleVnpayReturnResult> => {
  if (!verifyVnpaySecureHash(query)) {
    throw new AppError("Invalid VNPay signature", HTTP_STATUS.BAD_REQUEST);
  }

  const order = await getOrderByTxnRef(query.vnp_TxnRef);

  if (!order) {
    throw new AppError("Order not found", HTTP_STATUS.NOT_FOUND);
  }

  ensureCallbackAmountMatches(order, query.vnp_Amount);

  if (getEffectivePaymentStatus(order) === "paid") {
    return {
      order: toPaymentOrderSummary(order)
    };
  }

  const shouldSendPaymentSuccessEmail = isSuccessfulVnpayResponse(
    query.vnp_ResponseCode,
    query.vnp_TransactionStatus
  );

  if (isSuccessfulVnpayResponse(query.vnp_ResponseCode, query.vnp_TransactionStatus)) {
    applySuccessfulPayment(order, query);
  } else {
    applyFailedPayment(order, query);
  }

  await order.save();

  if (shouldSendPaymentSuccessEmail) {
    await sendPaymentSuccessNotification(order);
  }

  return {
    order: toPaymentOrderSummary(order)
  };
};

export const handleVnpayIpn = async (
  query: VnpayIpnQuery
): Promise<IpnResponsePayload> => {
  if (!query.vnp_SecureHash) {
    return buildIpnFailureResponse("97", "Invalid signature");
  }

  const verifiedQuery = query as VnpayIpnQuery & { vnp_SecureHash: string };

  if (!verifyVnpaySecureHash(verifiedQuery)) {
    return buildIpnFailureResponse("97", "Invalid signature");
  }

  const order = await getOrderByTxnRef(query.vnp_TxnRef);

  if (!order) {
    return buildIpnFailureResponse("01", "Order not found");
  }

  if (String(toVnpayAmount(order.totalAmount)) !== query.vnp_Amount) {
    return buildIpnFailureResponse("04", "Invalid amount");
  }

  if (getEffectivePaymentStatus(order) === "paid") {
    return buildIpnSuccessResponse("Order already confirmed");
  }

  const shouldSendPaymentSuccessEmail = isSuccessfulVnpayResponse(
    query.vnp_ResponseCode,
    query.vnp_TransactionStatus
  );

  if (isSuccessfulVnpayResponse(query.vnp_ResponseCode, query.vnp_TransactionStatus)) {
    applySuccessfulPayment(order, verifiedQuery);
  } else {
    applyFailedPayment(order, verifiedQuery);
  }

  await order.save();

  if (shouldSendPaymentSuccessEmail) {
    await sendPaymentSuccessNotification(order);
  }

  return buildIpnSuccessResponse();
};
