# Task 001 - Setup Project Base

## Status

Active

## Goal

Initialize the Express.js + TypeScript backend project with a clean base structure.

## Scope

Implement only the base project setup.

## Requirements

- Initialize Node.js project.
- Setup TypeScript.
- Setup Express app.
- Setup environment config.
- Setup MongoDB connection file.
- Setup Redis connection file placeholder.
- Setup health check endpoint.
- Setup basic source folder structure.
- Add dev scripts.

## Expected Files

```txt
package.json
tsconfig.json
.env.example
src/app.ts
src/server.ts
src/config/env.ts
src/config/database.ts
src/config/redis.ts
src/modules/health/health.routes.ts
```

## API

### GET /health

Expected response:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  },
  "message": "Server is running"
}
```

## Do Not Implement

- Auth
- User model
- Product model
- Cart
- Order
- Payment
- Upload
- Swagger
- Docker

## Validation

Run:

```bash
npm install
npm run dev
npm run build
```

Test:

```bash
curl http://localhost:5000/health
```

## Completion Checklist

- [ ] Project starts successfully.
- [ ] TypeScript builds successfully.
- [ ] Health endpoint returns correct response format.
- [ ] Report created in `agent/reports/001-setup-project-base-report.md`.
- [ ] Task remains in `agent/tasks/active/` until review passes.
- [ ] Task 002 remains in `agent/tasks/backlog/` until review passes.
- [ ] `agent/context/current-task.md` still points to task 001 until review passes.

## Advance Rule

Do not move this task to `agent/tasks/done/` during implementation.
Only run `agent/prompts/advance-task.md` after `agent/prompts/review-task.md` returns `Passed`.
