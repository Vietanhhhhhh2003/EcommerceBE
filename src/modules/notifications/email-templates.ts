import type { SafeOrder } from "../orders/order.service";

interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

interface Recipient {
  name: string;
}

interface PaymentEmailOrder {
  id: string;
  totalAmount: number;
  status: string;
  paymentTransactionId?: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(amount);
};

const escapeHtml = (value: string): string => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
};

const buildOrderItemsHtml = (order: SafeOrder): string => {
  return order.items
    .map(
      (item) =>
        `<li>${escapeHtml(item.name)} x ${item.quantity} - ${escapeHtml(
          formatCurrency(item.subtotal)
        )}</li>`
    )
    .join("");
};

const buildOrderItemsText = (order: SafeOrder): string => {
  return order.items
    .map((item) => `- ${item.name} x ${item.quantity}: ${formatCurrency(item.subtotal)}`)
    .join("\n");
};

export const buildWelcomeEmailTemplate = (recipient: Recipient): EmailTemplate => {
  const safeName = escapeHtml(recipient.name);

  return {
    subject: "Welcome to the store",
    text: `Hello ${recipient.name},\n\nWelcome to the store. Your account is ready to use.\n`,
    html: `<p>Hello ${safeName},</p><p>Welcome to the store. Your account is ready to use.</p>`
  };
};

export const buildOrderCreatedEmailTemplate = (
  recipient: Recipient,
  order: SafeOrder
): EmailTemplate => {
  const safeName = escapeHtml(recipient.name);

  return {
    subject: `Order created: ${order.id}`,
    text: `Hello ${recipient.name},\n\nYour order ${order.id} was created successfully.\n\nItems:\n${buildOrderItemsText(
      order
    )}\n\nTotal: ${formatCurrency(order.totalAmount)}\nStatus: ${order.status}\n`,
    html: `<p>Hello ${safeName},</p><p>Your order <strong>${escapeHtml(
      order.id
    )}</strong> was created successfully.</p><ul>${buildOrderItemsHtml(
      order
    )}</ul><p>Total: <strong>${escapeHtml(
      formatCurrency(order.totalAmount)
    )}</strong></p><p>Status: <strong>${escapeHtml(order.status)}</strong></p>`
  };
};

export const buildPaymentSuccessEmailTemplate = (
  recipient: Recipient,
  order: PaymentEmailOrder
): EmailTemplate => {
  const safeName = escapeHtml(recipient.name);
  const transactionLine = order.paymentTransactionId
    ? `Transaction: ${order.paymentTransactionId}\n`
    : "";
  const transactionHtml = order.paymentTransactionId
    ? `<p>Transaction: <strong>${escapeHtml(order.paymentTransactionId)}</strong></p>`
    : "";

  return {
    subject: `Payment received for order ${order.id}`,
    text: `Hello ${recipient.name},\n\nWe received your payment for order ${order.id}.\n${transactionLine}Amount: ${formatCurrency(
      order.totalAmount
    )}\nOrder status: ${order.status}\n`,
    html: `<p>Hello ${safeName},</p><p>We received your payment for order <strong>${escapeHtml(
      order.id
    )}</strong>.</p>${transactionHtml}<p>Amount: <strong>${escapeHtml(
      formatCurrency(order.totalAmount)
    )}</strong></p><p>Order status: <strong>${escapeHtml(order.status)}</strong></p>`
  };
};

export const buildOrderCancelledEmailTemplate = (
  recipient: Recipient,
  order: SafeOrder
): EmailTemplate => {
  const safeName = escapeHtml(recipient.name);

  return {
    subject: `Order cancelled: ${order.id}`,
    text: `Hello ${recipient.name},\n\nYour order ${order.id} was cancelled.\n\nItems:\n${buildOrderItemsText(
      order
    )}\n\nTotal: ${formatCurrency(order.totalAmount)}\n`,
    html: `<p>Hello ${safeName},</p><p>Your order <strong>${escapeHtml(
      order.id
    )}</strong> was cancelled.</p><ul>${buildOrderItemsHtml(
      order
    )}</ul><p>Total: <strong>${escapeHtml(formatCurrency(order.totalAmount))}</strong></p>`
  };
};
