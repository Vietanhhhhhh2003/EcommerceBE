# Task 005 - Product Module

## Status

Backlog

## Goal

Implement product CRUD, search, filter, sort, and pagination.

## Requirements

- Product model.
- Public product list.
- Public product detail.
- Admin create product.
- Admin update product.
- Admin delete product.
- Search by name/description.
- Filter by category, price, stock, status.
- Pagination.
- Zod validation.

## Endpoints

```txt
GET    /api/products
GET    /api/products/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
```

## Expected Files

```txt
src/modules/products/product.model.ts
src/modules/products/product.routes.ts
src/modules/products/product.controller.ts
src/modules/products/product.service.ts
src/modules/products/product.validation.ts
```

## Completion Report

Create:

```txt
agent/reports/005-product-module-report.md
```
