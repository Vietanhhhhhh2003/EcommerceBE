import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid order id");

const requiredQueryString = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required`);

const optionalQueryString = z
  .string()
  .trim()
  .min(1)
  .optional();

export const createVnpayPaymentSchema = {
  body: z
    .object({
      orderId: objectIdSchema
    })
    .strict()
};

export const vnpayCallbackQuerySchema = {
  query: z
    .object({
      vnp_TxnRef: requiredQueryString("vnp_TxnRef"),
      vnp_Amount: z
        .string()
        .regex(/^\d+$/, "vnp_Amount must be numeric"),
      vnp_ResponseCode: requiredQueryString("vnp_ResponseCode"),
      vnp_SecureHash: requiredQueryString("vnp_SecureHash"),
      vnp_SecureHashType: optionalQueryString,
      vnp_TransactionStatus: optionalQueryString,
      vnp_TransactionNo: optionalQueryString,
      vnp_OrderInfo: optionalQueryString,
      vnp_BankCode: optionalQueryString,
      vnp_PayDate: optionalQueryString
    })
    .passthrough()
};

export const vnpayIpnQuerySchema = {
  query: z
    .object({
      vnp_TxnRef: requiredQueryString("vnp_TxnRef"),
      vnp_Amount: z
        .string()
        .regex(/^\d+$/, "vnp_Amount must be numeric"),
      vnp_ResponseCode: requiredQueryString("vnp_ResponseCode"),
      vnp_SecureHash: optionalQueryString,
      vnp_SecureHashType: optionalQueryString,
      vnp_TransactionStatus: optionalQueryString,
      vnp_TransactionNo: optionalQueryString,
      vnp_OrderInfo: optionalQueryString,
      vnp_BankCode: optionalQueryString,
      vnp_PayDate: optionalQueryString
    })
    .passthrough()
};

export type CreateVnpayPaymentInput = z.infer<typeof createVnpayPaymentSchema.body>;
export type VnpayCallbackQuery = z.infer<typeof vnpayCallbackQuerySchema.query>;
export type VnpayIpnQuery = z.infer<typeof vnpayIpnQuerySchema.query>;
