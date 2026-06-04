import crypto from "crypto";
import { env } from "../../config/env";
import type { VnpayCallbackQuery, VnpayIpnQuery } from "./payment.validation";

export interface VnpayPaymentUrlInput {
  amount: number;
  ipAddress: string;
  orderId: string;
  txnRef: string;
}

interface VnpayIpnResponse {
  RspCode: string;
  Message: string;
}

type VnpayParams = Record<string, string>;

const VNPAY_DATE_FORMATTER = new Intl.DateTimeFormat("sv-SE", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "Asia/Ho_Chi_Minh"
});

const sortVnpayParams = (params: VnpayParams): VnpayParams => {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== "")
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
  );
};

const buildSignData = (params: VnpayParams): string => {
  const sortedParams = sortVnpayParams(params);
  return new URLSearchParams(sortedParams).toString();
};

const createSecureHash = (params: VnpayParams): string => {
  return crypto
    .createHmac("sha512", env.vnpayHashSecret)
    .update(buildSignData(params), "utf8")
    .digest("hex");
};

const formatVnpayDate = (date: Date): string => {
  const parts = Object.fromEntries(
    VNPAY_DATE_FORMATTER.formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return `${parts.year}${parts.month}${parts.day}${parts.hour}${parts.minute}${parts.second}`;
};

export const toVnpayAmount = (amount: number): number => {
  return Math.round(amount * 100);
};

export const generateTxnRef = (): string => {
  const randomSuffix = crypto.randomInt(100000, 999999);
  return `${Date.now()}${randomSuffix}`;
};

export const buildVnpayPaymentUrl = ({
  amount,
  ipAddress,
  orderId,
  txnRef
}: VnpayPaymentUrlInput): string => {
  const params: VnpayParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: env.vnpayTmnCode,
    vnp_Amount: String(toVnpayAmount(amount)),
    vnp_CreateDate: formatVnpayDate(new Date()),
    vnp_CurrCode: env.vnpayCurrCode,
    vnp_IpAddr: ipAddress,
    vnp_Locale: env.vnpayLocale,
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: "other",
    vnp_ReturnUrl: env.vnpayReturnUrl,
    vnp_TxnRef: txnRef
  };
  const secureHash = createSecureHash(params);
  const url = new URL(env.vnpayPaymentUrl);
  const queryParams = sortVnpayParams({
    ...params,
    vnp_SecureHash: secureHash
  });

  url.search = new URLSearchParams(queryParams).toString();
  return url.toString();
};

export const verifyVnpaySecureHash = (
  query: VnpayCallbackQuery | (VnpayIpnQuery & { vnp_SecureHash: string })
): boolean => {
  const { vnp_SecureHash, vnp_SecureHashType, ...remainingQuery } = query;
  void vnp_SecureHashType;
  const params = Object.fromEntries(
    Object.entries(remainingQuery).map(([key, value]) => [key, String(value)])
  );
  const expectedHash = createSecureHash(params);

  return expectedHash.toLowerCase() === vnp_SecureHash.toLowerCase();
};

export const isSuccessfulVnpayResponse = (
  responseCode: string,
  transactionStatus?: string
): boolean => {
  if (responseCode !== "00") {
    return false;
  }

  return transactionStatus === undefined || transactionStatus === "00";
};

export const parseVnpayPayDate = (value?: string): Date | undefined => {
  if (!value || !/^\d{14}$/.test(value)) {
    return undefined;
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6)) - 1;
  const day = Number(value.slice(6, 8));
  const hour = Number(value.slice(8, 10));
  const minute = Number(value.slice(10, 12));
  const second = Number(value.slice(12, 14));

  return new Date(Date.UTC(year, month, day, hour, minute, second));
};

export const buildIpnSuccessResponse = (message = "Confirm Success"): VnpayIpnResponse => {
  return {
    RspCode: "00",
    Message: message
  };
};

export const buildIpnFailureResponse = (
  code: string,
  message: string
): VnpayIpnResponse => {
  return {
    RspCode: code,
    Message: message
  };
};
