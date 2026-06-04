# Task 008 - VNPay Payment Module

## Status

Backlog

## Goal

Implement VNPay sandbox payment flow for existing orders.

## MVP Decision

For MVP, do NOT create a separate `payment.model.ts`.
Store payment-related fields directly inside the existing Order model.

Suggested Order payment fields:

```txt
paymentMethod: "vnpay" | "cod"
paymentStatus: "unpaid" | "pending" | "paid" | "failed" | "refunded"
paymentTransactionId?: string
paymentAmount?: number
paidAt?: Date
vnpayResponseCode?: string
vnpayTxnRef?: string
```

## Requirements

- Add payment fields to the existing Order model if they do not exist yet.
- Create VNPay payment URL for an unpaid order.
- Verify VNPay return signature.
- Verify VNPay IPN signature.
- Never trust client-provided payment status.
- Update order `paymentStatus` after valid VNPay response.
- Update order status after successful payment.

## Endpoints

```txt
POST /api/payments/vnpay/create
GET  /api/payments/vnpay/return
GET  /api/payments/vnpay/ipn
```

## Expected Files

```txt
src/modules/payments/payment.routes.ts
src/modules/payments/payment.controller.ts
src/modules/payments/payment.service.ts
src/modules/payments/vnpay.service.ts
src/modules/payments/payment.validation.ts
src/modules/orders/order.model.ts
```

## Security Rules

- VNPay secret must come from env.
- Always verify signature.
- Never trust client payment status.
- Do not hard-code VNPay credentials.

## Completion Report

Create:

```txt
agent/reports/008-vnpay-payment-module-report.md
```
