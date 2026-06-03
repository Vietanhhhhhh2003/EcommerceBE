# Task 007 - Order Module

## Status

Backlog

## Goal

Implement order creation and order management.

## Requirements

- Order model.
- Create order from cart.
- Copy cart items into order.
- Calculate total amount.
- Get my orders.
- Get order detail.
- Cancel order.
- Admin update order status.
- Check stock before order creation.

## Endpoints

```txt
POST  /api/orders
GET   /api/orders/me
GET   /api/orders/:id
PATCH /api/orders/:id/status
PATCH /api/orders/:id/cancel
```

## Expected Files

```txt
src/modules/orders/order.model.ts
src/modules/orders/order.routes.ts
src/modules/orders/order.controller.ts
src/modules/orders/order.service.ts
src/modules/orders/order.validation.ts
```

## Completion Report

Create:

```txt
agent/reports/007-order-module-report.md
```
