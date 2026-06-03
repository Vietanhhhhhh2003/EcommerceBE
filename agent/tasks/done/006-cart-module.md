# Task 006 - Cart Module

## Status

Backlog

## Goal

Implement user cart management.

## Requirements

- Cart model.
- Get my cart.
- Add item to cart.
- Update item quantity.
- Remove item from cart.
- Clear cart.
- Check product stock before adding/updating.

## Endpoints

```txt
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:productId
DELETE /api/cart/items/:productId
DELETE /api/cart
```

## Expected Files

```txt
src/modules/cart/cart.model.ts
src/modules/cart/cart.routes.ts
src/modules/cart/cart.controller.ts
src/modules/cart/cart.service.ts
src/modules/cart/cart.validation.ts
```

## Completion Report

Create:

```txt
agent/reports/006-cart-module-report.md
```
