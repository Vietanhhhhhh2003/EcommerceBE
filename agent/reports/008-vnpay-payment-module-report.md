# Task 008 - VNPay Payment Module Report

## Status

Done

## Task Summary

Implemented VNPay sandbox payment URL creation and callback handling for existing orders by embedding payment state into the existing Order model, adding a new `payments` module, and validating signed return/IPN flows.

## Scope Completed

- Added VNPay payment fields to the existing Order model.
- Added `POST /api/payments/vnpay/create`.
- Added `GET /api/payments/vnpay/return`.
- Added `GET /api/payments/vnpay/ipn`.
- Added authenticated VNPay payment URL creation for the current user's payable orders.
- Added VNPay secure-hash generation and verification helpers.
- Added VNPay transaction reference generation and regeneration for `unpaid`, `pending`, and `failed` VNPay payment states.
- Added idempotent payment update handling for return and IPN callbacks.
- Added VNPay amount verification using `order.totalAmount * 100`.
- Updated order payment status and metadata after valid VNPay callbacks.
- Returned VNPay-style `{ RspCode, Message }` payloads for IPN only.
- Added Zod validation for payment creation body and VNPay callback query fields.

## Files Changed

- `src/app.ts`: Mounted `/api/payments` routes.
- `src/config/env.ts`: Added VNPay environment configuration.
- `.env.example`: Added VNPay example environment variables.
- `src/modules/orders/order.model.ts`: Added embedded payment fields and `vnpayTxnRef` index.
- `src/modules/payments/payment.routes.ts`: Added VNPay routes.
- `src/modules/payments/payment.controller.ts`: Added thin payment controllers.
- `src/modules/payments/payment.service.ts`: Added payment creation and callback business logic.
- `src/modules/payments/vnpay.service.ts`: Added VNPay signing, verification, URL generation, and IPN helper logic.
- `src/modules/payments/payment.validation.ts`: Added payment body and callback query validation schemas.

## APIs Added or Changed

- `POST /api/payments/vnpay/create`: Create a signed VNPay payment URL for the current authenticated user's order.
- `GET /api/payments/vnpay/return`: Process VNPay return callback using standard JSON response format.
- `GET /api/payments/vnpay/ipn`: Process VNPay IPN callback using VNPay-compatible `{ RspCode, Message }` payloads.

## Environment Variables Added

- `VNPAY_TMN_CODE`
- `VNPAY_HASH_SECRET`
- `VNPAY_PAYMENT_URL`
- `VNPAY_RETURN_URL`
- `VNPAY_IPN_URL`
- `VNPAY_LOCALE`
- `VNPAY_CURR_CODE`

## How to Test

```bash
npm install
git diff --check
npm run build
npm run lint
npm run dev

# 1. Login as user and get access token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"task008.user@example.com\",\"password\":\"Password123!\"}"

# 2. Create payment URL for an unpaid order
curl -X POST http://localhost:5000/api/payments/vnpay/create \
  -H "Authorization: Bearer <user_access_token>" \
  -H "Content-Type: application/json" \
  -d "{\"orderId\":\"<order_id>\"}"

# 3. Simulate VNPay return and IPN with locally signed callback queries
curl -X GET "http://localhost:5000/api/payments/vnpay/return?<valid_signed_query>"
curl -X GET "http://localhost:5000/api/payments/vnpay/ipn?<valid_signed_query>"
```

## Validation Result

- `npm install`: Passed.
- `git diff --check`: Passed.
- `npm run build`: Passed.
- `npm run lint`: Passed.
- `npm run dev`: Passed under elevated execution with temporary VNPay env vars; the server started successfully on port `5001` and `/health` returned `200`.
- Manual positive VNPay tests:
  - `POST /api/payments/vnpay/create`: Expected `200`, actual `200`, Passed.
    Notes: Returned a signed `paymentUrl`, `paymentMethod = vnpay`, `paymentStatus = pending`, `paymentAmount = order.totalAmount`, and a stored `vnpayTxnRef`.
  - VNPay URL regeneration while `paymentStatus = pending`: Expected `200`, actual `200`, Passed.
    Notes: A new `vnpayTxnRef` replaced the prior reference on the same order.
  - `GET /api/payments/vnpay/return` with valid signed success query: Expected `200`, actual `200`, Passed.
    Notes: Payment became `paid`, metadata was stored, and order status moved to `confirmed`.
  - `GET /api/payments/vnpay/return` repeated success callback: Expected idempotent success, actual idempotent success, Passed.
  - `GET /api/payments/vnpay/ipn` with valid signed success query: Expected `200`, actual `200`, Passed.
    Notes: Response used VNPay-compatible `{ RspCode: "00", Message: "Confirm Success" }`.
  - `GET /api/payments/vnpay/ipn` repeated success callback: Expected idempotent success, actual idempotent success, Passed.
  - Failed-payment retry flow: Expected payment create allowed after `paymentStatus = failed`, actual `200`, Passed.
- Manual negative VNPay tests:
  - `POST /api/payments/vnpay/create` without token: Expected `401`, actual `401`, Passed.
  - `POST /api/payments/vnpay/create` with invalid `orderId`: Expected `400`, actual `400`, Passed.
  - `POST /api/payments/vnpay/create` for missing order: Expected `404`, actual `404`, Passed.
  - `POST /api/payments/vnpay/create` for another user's order: Expected `403`, actual `403`, Passed.
  - `POST /api/payments/vnpay/create` for already paid order: Expected `409`, actual `409`, Passed.
  - `POST /api/payments/vnpay/create` for cancelled order: Expected `409`, actual `409`, Passed.
  - `POST /api/payments/vnpay/create` for completed order: Expected `409`, actual `409`, Passed.
  - `GET /api/payments/vnpay/return` without secure hash: Expected `400`, actual `400`, Passed.
  - `GET /api/payments/vnpay/return` with invalid secure hash: Expected `400`, actual `400`, Passed.
  - `GET /api/payments/vnpay/ipn` without secure hash: Expected safe failure payload, actual `{ RspCode: "97" }`, Passed.
  - `GET /api/payments/vnpay/ipn` with invalid secure hash: Expected safe failure payload, actual `{ RspCode: "97" }`, Passed.
  - Callback amount mismatch: Expected safe rejection, actual IPN `{ RspCode: "04", Message: "Invalid amount" }`, Passed.
- Real VNPay sandbox checkout:
  - Not available yet in this environment.
  - Validated instead with locally generated signed return/IPN callback queries using the same HMAC SHA512 signing convention implemented by the module.

## Lifecycle State

- `agent/tasks/active/` contains exactly one task file: `008-vnpay-payment-module.md`.
- `agent/context/current-task.md` points to Task 008.
- No task files were moved during implementation.
- `agent/context/current-task.md` was not updated to Task 009.
- Task 009 was not activated.
- Note: `agent/tasks/active/008-vnpay-payment-module.md` still contains `## Status` value `Backlog`, treated as stale metadata because folder placement and `current-task.md` indicate Task 008 is active.

## Out of Scope / Deferred

- Notification or email integration.
- Upload logic.
- Swagger finalization.
- Docker finalization.
- Refund workflow implementation.
- Admin payment management.
- Frontend redirect UI.
- Queue or webhook retry orchestration.
- Kafka or RabbitMQ.
- Microservices.

## Risks / Limitations

- Real VNPay sandbox payment completion may depend on external sandbox availability and credentials.
- Local validation may rely on simulated signed return/IPN callbacks instead of a full browser VNPay checkout.
- Payment creation intentionally regenerates `vnpayTxnRef` while payment status is `pending`, so callbacks referencing an older replaced txn ref will no longer resolve to the order.
- Validation used temporary shell-provided VNPay environment variables instead of editing `.env`, because Task 008 only required updates to `src/config/env.ts` and `.env.example`.
- The implementation uses VNPay amount conversion `order.totalAmount * 100`, and that exact converted amount is verified again during return/IPN handling.

## Suggested Next Step

Run `agent/prompts/review-task.md` before advancing the task.
