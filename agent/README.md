# Agent Workflow - Express E-Commerce Backend API

This `agent/` folder is the working guide for AI coding agents such as Cursor, Codex, Claude, or ChatGPT.

The goal is to keep AI coding controlled, scoped, reviewable, and consistent with the project architecture.

## Project

Express E-Commerce Backend API using:

- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT
- Redis
- VNPay
- Docker
- Swagger
- Zod
- Nodemailer

Architecture style: **modular monolith first, microservices later**.

## Core Rule

Only one task can be active at a time.

AI must follow this lifecycle:

1. Read the project context.
2. Read the active task.
3. Implement only the active task.
4. Validate the implementation.
5. Create a task report.
6. Stop and wait for review.
7. Review the completed implementation against the report and active task.
8. Only if review passes, run the advance-task workflow.
9. Advance-task moves the completed task to `done/`, activates the next task, and updates `context/current-task.md`.

Important: `implement-task.md` must NOT move tasks between `active/`, `backlog/`, and `done/`. Task movement is only allowed by `advance-task.md` after review passes.

## Required Reading Before Coding

Before implementing any task, read:

- `agent/README.md`
- `agent/context/project-brief.md`
- `agent/context/architecture.md`
- `agent/context/coding-rules.md`
- `agent/context/api-convention.md`
- `agent/context/current-task.md`
- the single task file inside `agent/tasks/active/`

If more than one file exists in `agent/tasks/active/`, stop and report the problem.

## Folder Meaning

```txt
agent/
|-- context/     # Stable project context and current task state
|-- tasks/       # Active, backlog, and completed tasks
|-- reports/     # Task completion reports created after implementation
|-- reviews/     # Review reports created before advancing a task
|-- templates/   # Reusable templates
`-- prompts/     # Prompts for implement, review, debug, and advance workflows
```

## Task Lifecycle

```txt
backlog -> active -> implementation -> task report -> review -> advance -> done
                                                        |
                                                        `-> needs fix -> active
```

### Implementation phase

- Code only the active task.
- Create `agent/reports/<task-id>-<task-name>-report.md`.
- Keep the task file in `agent/tasks/active/`.
- Do not activate the next task yet.

### Review phase

- Review the report, the active task file, and changed files.
- Create `agent/reviews/<task-id>-<task-name>-review.md`.
- If review fails, keep the same task in `active/` and fix it.

### Advance phase

Only after review passes:

- Move the task from `agent/tasks/active/` to `agent/tasks/done/`.
- Move the next numbered task from `agent/tasks/backlog/` to `agent/tasks/active/`.
- Update `agent/context/current-task.md`.

## Task Order

```txt
001 - Setup project base
002 - Common layer, middleware, and API convention
003 - Auth module
004 - User module and RBAC
005 - Product module
006 - Cart module
007 - Order module
008 - VNPay payment module
009 - Notification and upload module
010 - Swagger, Docker, README, and final demo
```

## Do Not

- Do not implement future tasks.
- Do not change unrelated files.
- Do not change response format.
- Do not hard-code secrets.
- Do not return sensitive fields such as `passwordHash`.
- Do not skip validation and error handling.
- Do not move tasks to `done/` during implementation.
- Do not update `current-task.md` during implementation.

## Done Definition

A task is only done when:

- Required files are implemented.
- App builds successfully, or the build limitation is clearly documented and accepted in review.
- Relevant API endpoints are manually testable.
- Response format is consistent.
- A task report exists in `agent/reports/`.
- A review report exists in `agent/reviews/`.
- Review status is `Passed`.
- The task file has been moved to `agent/tasks/done/` by `advance-task.md`.
- The next task has been moved to `agent/tasks/active/` by `advance-task.md`.
- `agent/context/current-task.md` has been updated by `advance-task.md`.

## Strict Prompt Workflow

Use the prompts in this order:

1. `agent/prompts/implement-task.md` to implement the active task and create a report.
2. `agent/prompts/review-task.md` to review the completed implementation while the task is still active.
3. `agent/prompts/debug-issue.md` only when validation or review fails.
4. `agent/prompts/advance-task.md` only after review status is `Passed`.

Important rule: the coding agent must not move a task to `done/` if build, validation, required manual tests, or review fails. In that case, the task remains in `active/` and the report/review must explain the failure.
