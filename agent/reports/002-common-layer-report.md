# Task 002 - Common Layer, Middleware, and API Convention Report

## Status

Done

## Task Summary

Implemented the shared common foundation for future Express modules, including standardized API responses, application errors, centralized error handling, not-found handling, async controller wrapping, Zod validation, request logging, HTTP status constants, and shared Express typing.

## Scope Completed

- Added standard success and error response helpers using `{ success, data, message }`.
- Added `AppError` with `statusCode`, `safeMessage`, and operational error metadata.
- Added centralized error middleware for `AppError` and unknown errors.
- Added not-found middleware returning a 404 standard error response.
- Added async handler utility for forwarding async controller errors to `next`.
- Added Zod validation middleware for `body`, `params`, and `query`.
- Added request logger middleware that logs method, path, status code, and duration only.
- Fixed the Task 002 review issue by ensuring request logging uses `request.path` instead of `request.originalUrl`.
- Hardened not-found responses so unknown-route messages use `request.path` and do not echo query strings.
- Added reusable HTTP status constants.
- Added shared Express type declaration file with only a safe placeholder type.
- Wired request logger, not-found middleware, and error middleware into `src/app.ts`.
- Updated `GET /health` to use the common success response helper.
- Added the required `zod` dependency.

## Files Changed

- `package.json`: Added required `zod` dependency.
- `package-lock.json`: Updated dependency lockfile for `zod`.
- `src/app.ts`: Wired request logger, not-found middleware, and error middleware.
- `src/modules/health/health.routes.ts`: Kept existing health endpoint and switched it to the shared success response helper.
- `src/common/utils/response.ts`: Added standard API response helpers.
- `src/common/errors/app-error.ts`: Added reusable application error class.
- `src/common/middlewares/error.middleware.ts`: Added centralized error handling.
- `src/common/middlewares/not-found.middleware.ts`: Added unknown-route handling and path-only response messages.
- `src/common/middlewares/validate.middleware.ts`: Added Zod validation middleware.
- `src/common/middlewares/request-logger.middleware.ts`: Added safe request logging and changed logging to path-only output.
- `src/common/utils/async-handler.ts`: Added async controller wrapper.
- `src/common/constants/http-status.ts`: Added common HTTP status constants.
- `src/common/types/express.d.ts`: Added shared Express type declarations.

## APIs Added or Changed

- `GET /health`: Existing endpoint preserved; response now goes through the shared response helper.
- `ALL /*`: Unknown routes now return a standard 404 error response through not-found middleware.

## Environment Variables Added

- None.

## How to Test

```bash
npm install
npm run build
npm run lint
npm run dev
curl http://localhost:5000/health
curl http://localhost:5000/not-existing-route
```

## Validation Result

- `npm install`: Passed.
- `npm run build`: Passed.
- `npm run lint`: Passed.
- `npm run dev`: Passed under elevated execution; the command is long-running and was stopped by the harness timeout after the server became reachable.
- `curl http://localhost:5000/health`: Passed with `{"success":true,"data":{"status":"ok"},"message":"Server is running"}`.
- `curl http://localhost:5000/not-existing-route`: Passed with `{"success":false,"data":null,"message":"Route GET /not-existing-route not found"}`.
- Review fix validation:
  - `npm run build`: Passed.
  - `npm run lint`: Passed.
  - `git diff --check`: Passed.
  - `curl http://localhost:5000/health`: Passed.
  - `curl "http://localhost:5000/not-existing-route?token=secret"`: Passed with no `token=secret` echoed in the response message.

## Lifecycle State

- `agent/tasks/active/` contains exactly one task file: `002-common-layer.md`.
- `agent/context/current-task.md` points to Task 002.
- No task files were moved.
- `agent/context/current-task.md` was not updated to another task.
- Task 003 was not activated.
- Note: `agent/tasks/active/002-common-layer.md` still contains `## Status` value `Backlog`, while `agent/context/current-task.md` marks Task 002 as active.

## Out of Scope / Deferred

- Auth logic.
- Product logic.
- Cart logic.
- Order logic.
- Payment logic.
- Notification logic.
- Upload logic.
- Swagger finalization.
- Docker finalization.
- Database models.

## Risks / Limitations

- Request logging currently uses `console.log`; a structured logger can be introduced in a future infrastructure task if required.
- `npm run dev` depends on the existing server startup path, which connects MongoDB before listening and uses Redis optionally.
- The active task file has stale internal status text (`Backlog`) even though the task is active by current-task context and folder placement.
- Historical failed review remains in `agent/reviews/002-common-layer-review.md`; the review issue has been fixed and Task 002 should be reviewed again.

## Suggested Next Step

Run `agent/prompts/review-task.md` before advancing the task.
