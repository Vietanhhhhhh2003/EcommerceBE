# Task 006 - Cart Module Report

## Status

Done

## Task Summary

Implemented authenticated user cart management for the Express E-Commerce Backend API with one cart per user, stock validation against the existing Product model, and safe cart responses with product summaries and computed totals.

## Scope Completed

- Added the cart model with one cart per user.
- Added cart items with `productId` and positive integer `quantity`.
- Added `GET /api/cart`.
- Added `POST /api/cart/items`.
- Added `PATCH /api/cart/items/:productId`.
- Added `DELETE /api/cart/items/:productId`.
- Added `DELETE /api/cart`.
- Protected all cart routes with the existing `authMiddleware`.
- Reused the existing `Product` model to check product existence, active status, and stock.
- Added safe cart response shaping with product summary, `subtotal`, `totalItems`, and `totalPrice`.
- Returned an empty safe cart response when a cart does not exist yet.
- Chose `POST /api/cart/items` response behavior:
  - `201` when a new cart item is created
  - `200` when an existing cart item quantity is increased
- Filtered deleted or inactive stored cart items out of the returned cart response and totals.
- Added Zod validation for cart item body and `productId` params.

## Files Changed

- `src/app.ts`: Mounted `/api/cart` routes.
- `src/modules/cart/cart.model.ts`: Added cart schema and indexes.
- `src/modules/cart/cart.validation.ts`: Added cart params and body validation schemas.
- `src/modules/cart/cart.service.ts`: Added cart business logic, stock checks, and safe cart response mapping.
- `src/modules/cart/cart.controller.ts`: Added thin cart controllers.
- `src/modules/cart/cart.routes.ts`: Added authenticated cart routes.

## APIs Added or Changed

- `GET /api/cart`: Return the current authenticated user's cart or an empty cart response.
- `POST /api/cart/items`: Add a product to the current authenticated user's cart or increase quantity.
- `PATCH /api/cart/items/:productId`: Update the quantity of an existing cart item.
- `DELETE /api/cart/items/:productId`: Remove one item from the current authenticated user's cart.
- `DELETE /api/cart`: Clear all items from the current authenticated user's cart.

## Environment Variables Added

- None.

## How to Test

```bash
npm install
npm run build
npm run lint
npm run dev

# 1. Login as user and get access token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"Password123!\"}"

# 2. Get empty or existing cart
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer <user_access_token>"

# 3. Add item to cart
curl -X POST http://localhost:5000/api/cart/items \
  -H "Authorization: Bearer <user_access_token>" \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"<active_product_id>\",\"quantity\":1}"

# 4. Add same item again and verify quantity increases
curl -X POST http://localhost:5000/api/cart/items \
  -H "Authorization: Bearer <user_access_token>" \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"<active_product_id>\",\"quantity\":2}"

# 5. Update item quantity
curl -X PATCH http://localhost:5000/api/cart/items/<active_product_id> \
  -H "Authorization: Bearer <user_access_token>" \
  -H "Content-Type: application/json" \
  -d "{\"quantity\":2}"

# 6. Remove item
curl -X DELETE http://localhost:5000/api/cart/items/<active_product_id> \
  -H "Authorization: Bearer <user_access_token>"

# 7. Clear cart
curl -X DELETE http://localhost:5000/api/cart \
  -H "Authorization: Bearer <user_access_token>"
```

## Validation Result

- `npm install`: Passed.
- `git diff --check`: Passed.
- `npm run build`: Passed.
- `npm run lint`: Passed.
- `npm run dev`: Passed under elevated execution; the server started successfully and `/health` returned `200`.
- Product setup for cart validation via existing product APIs:
  - Active product creation: Expected `201`, actual `201`, Passed.
  - Inactive product creation: Expected `201`, actual `201`, Passed.
- Manual positive cart API tests:
  - `GET /api/cart` with empty cart: Expected `200`, actual `200`, Passed.
  - `POST /api/cart/items` with new active product: Expected `201`, actual `201`, Passed.
  - `POST /api/cart/items` with same product again: Expected `200`, actual `200`, Passed.
  - `PATCH /api/cart/items/:productId`: Expected `200`, actual `200`, Passed.
  - `DELETE /api/cart/items/:productId`: Expected `200`, actual `200`, Passed.
  - `DELETE /api/cart`: Expected `200`, actual `200`, Passed.
- Safe-handling behavior validation:
  - `GET /api/cart` after a stored cart item's product was made inactive: Expected `200`, actual `200`, Passed.
    Notes: The inactive stored item was excluded from the returned cart response and totals.
- Manual negative cart API tests:
  - `GET /api/cart` without token: Expected `401`, actual `401`, Passed.
  - `POST /api/cart/items` without token: Expected `401`, actual `401`, Passed.
  - `POST /api/cart/items` with invalid `productId`: Expected `400`, actual `400`, Passed.
  - `POST /api/cart/items` with missing quantity: Expected `400`, actual `400`, Passed.
  - `POST /api/cart/items` with zero quantity: Expected `400`, actual `400`, Passed.
  - `POST /api/cart/items` with negative quantity: Expected `400`, actual `400`, Passed.
  - `POST /api/cart/items` with non-integer quantity: Expected `400`, actual `400`, Passed.
  - `POST /api/cart/items` with non-existing product: Expected `404`, actual `404`, Passed.
  - `POST /api/cart/items` with inactive product: Expected `404`, actual `404`, Passed.
  - `POST /api/cart/items` with quantity greater than stock: Expected `400`, actual `400`, Passed.
  - `PATCH /api/cart/items/:productId` with quantity greater than stock: Expected `400`, actual `400`, Passed.
  - `PATCH /api/cart/items/:productId` for item not in cart: Expected `404`, actual `404`, Passed.
  - `DELETE /api/cart/items/:productId` for item not in cart: Expected `404`, actual `404`, Passed.

## Lifecycle State

- `agent/tasks/active/` contains exactly one task file: `006-cart-module.md`.
- `agent/context/current-task.md` points to Task 006.
- No task files were moved during implementation.
- `agent/context/current-task.md` was not updated to Task 007.
- Task 007 was not activated.
- Note: `agent/tasks/active/006-cart-module.md` still contains `## Status` value `Backlog`, treated as stale metadata because folder placement and `current-task.md` indicate Task 006 is active.

## Out of Scope / Deferred

- Order creation.
- Checkout.
- Payment logic.
- Notification logic.
- Upload logic.
- Swagger finalization.
- Docker finalization.
- Coupon support.
- Wishlist.
- Product review or rating.
- Inventory decrement.
- Guest cart.
- Multi-cart support.
- Cart merge.
- Price snapshot persistence.
- Admin cart management.

## Risks / Limitations

- Cart totals are computed from the current product price at read time rather than from stored price snapshots.
- Deleted or inactive stored cart items are filtered out of the response instead of being auto-removed from the database document.
- Redis was unavailable locally during validation, but cart behavior completed successfully because this task depends on MongoDB and auth/product APIs rather than Redis.
- Manual validation setup required a temporary local user role update in MongoDB so the existing product admin APIs could create test products.

## Suggested Next Step

Run `agent/prompts/review-task.md` before advancing the task.
