# Task 002 - Common Layer, Middleware, and API Convention

## Status

Backlog

## Goal

Create the shared foundation used by all modules.

## Requirements

- Standard API response helper.
- AppError class.
- Error middleware.
- Not found middleware.
- Async handler.
- Validate middleware using Zod.
- Request logger middleware.
- HTTP status constants.
- Common TypeScript types.

## Expected Files

```txt
src/common/utils/response.ts
src/common/errors/app-error.ts
src/common/middlewares/error.middleware.ts
src/common/middlewares/not-found.middleware.ts
src/common/middlewares/validate.middleware.ts
src/common/middlewares/request-logger.middleware.ts
src/common/utils/async-handler.ts
src/common/constants/http-status.ts
src/common/types/express.d.ts
```

## Do Not Implement

- Auth logic
- Product logic
- Database models except shared types

## Completion Report

Create:

```txt
agent/reports/002-common-layer-report.md
```
