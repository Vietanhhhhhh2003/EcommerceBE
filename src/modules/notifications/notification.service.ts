import nodemailer, { type Transporter } from "nodemailer";
import { env } from "../../config/env";
import type { SafeOrder } from "../orders/order.service";
import {
  buildOrderCancelledEmailTemplate,
  buildOrderCreatedEmailTemplate,
  buildPaymentSuccessEmailTemplate,
  buildWelcomeEmailTemplate
} from "./email-templates";

interface NotificationRecipient {
  email: string;
  name: string;
}

interface NotificationResult {
  sent: boolean;
  skipped: boolean;
  reason?: "smtp_not_configured" | "send_failed";
}

interface PaymentNotificationOrder {
  id: string;
  totalAmount: number;
  status: string;
  paymentTransactionId?: string;
}

interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

let transporter: Transporter | null | undefined;

const isSmtpConfigured = (): boolean => {
  return Boolean(
    env.smtpHost &&
      env.smtpUser &&
      env.smtpPass &&
      env.mailFrom &&
      Number.isFinite(env.smtpPort)
  );
};

const getTransporter = (): Transporter | null => {
  if (!isSmtpConfigured()) {
    return null;
  }

  if (transporter !== undefined) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });

  return transporter;
};

const maskEmail = (email: string): string => {
  const [localPart = "", domain = ""] = email.split("@");
  const visibleLocal = localPart.slice(0, 2);

  return `${visibleLocal}${"*".repeat(Math.max(localPart.length - visibleLocal.length, 1))}@${domain}`;
};

const logNotificationEvent = (
  level: "info" | "warn",
  message: string,
  meta: Record<string, string>
): void => {
  console[level](message, meta);
};

const sendNotificationEmail = async (
  type: string,
  recipient: NotificationRecipient,
  template: EmailTemplate
): Promise<NotificationResult> => {
  const activeTransporter = getTransporter();

  if (!activeTransporter || !env.mailFrom) {
    logNotificationEvent("warn", "Notification skipped because SMTP is not configured", {
      type
    });

    return {
      sent: false,
      skipped: true,
      reason: "smtp_not_configured"
    };
  }

  try {
    await activeTransporter.sendMail({
      from: env.mailFrom,
      to: recipient.email,
      subject: template.subject,
      text: template.text,
      html: template.html
    });

    logNotificationEvent("info", "Notification email sent", {
      type,
      recipient: maskEmail(recipient.email)
    });

    return {
      sent: true,
      skipped: false
    };
  } catch {
    logNotificationEvent("warn", "Notification email failed", {
      type,
      recipient: maskEmail(recipient.email)
    });

    return {
      sent: false,
      skipped: false,
      reason: "send_failed"
    };
  }
};

export const sendWelcomeEmail = async (
  recipient: NotificationRecipient
): Promise<NotificationResult> => {
  return sendNotificationEmail(
    "welcome_email",
    recipient,
    buildWelcomeEmailTemplate(recipient)
  );
};

export const sendOrderCreatedEmail = async (
  recipient: NotificationRecipient,
  order: SafeOrder
): Promise<NotificationResult> => {
  return sendNotificationEmail(
    "order_created_email",
    recipient,
    buildOrderCreatedEmailTemplate(recipient, order)
  );
};

export const sendPaymentSuccessEmail = async (
  recipient: NotificationRecipient,
  order: PaymentNotificationOrder
): Promise<NotificationResult> => {
  return sendNotificationEmail(
    "payment_success_email",
    recipient,
    buildPaymentSuccessEmailTemplate(recipient, order)
  );
};

export const sendOrderCancelledEmail = async (
  recipient: NotificationRecipient,
  order: SafeOrder
): Promise<NotificationResult> => {
  return sendNotificationEmail(
    "order_cancelled_email",
    recipient,
    buildOrderCancelledEmailTemplate(recipient, order)
  );
};
