import dotenv from "dotenv";

dotenv.config();

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  mongodbUri: getRequiredEnv("MONGODB_URI"),
  redisUrl: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
  jwtAccessSecret: getRequiredEnv("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: getRequiredEnv("JWT_REFRESH_SECRET"),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  vnpayTmnCode: getRequiredEnv("VNPAY_TMN_CODE"),
  vnpayHashSecret: getRequiredEnv("VNPAY_HASH_SECRET"),
  vnpayPaymentUrl: getRequiredEnv("VNPAY_PAYMENT_URL"),
  vnpayReturnUrl: getRequiredEnv("VNPAY_RETURN_URL"),
  vnpayIpnUrl: getRequiredEnv("VNPAY_IPN_URL"),
  vnpayLocale: process.env.VNPAY_LOCALE ?? "vn",
  vnpayCurrCode: process.env.VNPAY_CURR_CODE ?? "VND",
  refreshTokenExpiresSeconds: Number(
    process.env.REFRESH_TOKEN_EXPIRES_SECONDS ?? 604800
  )
};
