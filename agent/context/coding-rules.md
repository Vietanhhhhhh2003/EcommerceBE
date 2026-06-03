# Coding Rules

## Scope Rules

- Implement only the active task.
- Do not implement future tasks.
- Do not modify unrelated files.
- Do not refactor large areas unless the active task requires it.

## TypeScript Rules

- Use TypeScript for all source files.
- Avoid `any` unless there is a clear reason.
- Define request/user types when needed.
- Keep functions small and readable.

## Express Rules

- Use route/controller/service separation.
- Use async handler for async controllers.
- Do not write try/catch in every controller if asyncHandler exists.
- Use centralized error middleware.

## Security Rules

- Never hard-code secrets.
- Read secrets from environment variables.
- Never return password hash.
- Hash passwords using bcrypt.
- Protect private routes with auth middleware.
- Protect admin routes with role middleware.
- Validate all user input.

## API Rules

- Always return `{ success, data, message }`.
- Use proper HTTP status codes.
- Keep error messages clear but safe.
- Do not expose stack trace in production.

## Validation Rules

- Use Zod validation.
- Validate body, params, and query when needed.
- Put validation schema in `*.validation.ts`.

## Database Rules

- Use Mongoose models.
- Use timestamps where appropriate.
- Add indexes for frequently queried fields such as email, slug, userId.

## Auth Rules

- Access token should be short-lived.
- Refresh token should be longer-lived.
- Store refresh token securely in Redis or database.
- Logout should invalidate refresh token.

## Report Rules

After finishing each task, create a report in `agent/reports/`.

The report must include:

- Task summary
- Scope completed
- Files changed
- APIs added or changed
- How to test
- Validation result
- Notes or limitations
- Next task
