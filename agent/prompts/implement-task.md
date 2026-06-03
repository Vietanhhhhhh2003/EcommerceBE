# Implement Active Task Prompt (Strict)

You are the coding agent for this repository.
Your job is to implement ONLY the current active task.

## 0. Mandatory Reading Order

Before changing any file, read these files in this exact order:

1. `agent/README.md`
2. `agent/context/project-brief.md`
3. `agent/context/architecture.md`
4. `agent/context/coding-rules.md`
5. `agent/context/api-convention.md`
6. `agent/context/current-task.md`
7. The single task file inside `agent/tasks/active/`

If more than one task file exists in `agent/tasks/active/`, stop and report the problem. Do not code.

## 1. Scope Lock

You MUST implement only the requirements written in the active task file.

You MUST NOT:

- implement future backlog tasks
- add extra features not requested by the active task
- refactor unrelated modules
- change API conventions without explicit task instruction
- introduce microservices
- add Kafka/RabbitMQ unless the active task explicitly asks
- change folder architecture unless the active task asks
- hard-code secrets, API keys, or credentials
- return password hashes or sensitive data
- move files between `agent/tasks/active/`, `agent/tasks/backlog/`, and `agent/tasks/done/`
- update `agent/context/current-task.md` to the next task

When unsure whether a change is in scope, do not make the change. Add it to the report under `Out of Scope / Deferred`.

## 2. Implementation Rules

Follow these rules strictly:

- Use Express.js + TypeScript.
- Follow modular monolith architecture.
- Follow route -> middleware -> controller -> service -> model pattern.
- Use the standard response format: `{ success, data, message }`.
- Use centralized error handling.
- Use Zod for validation when the task includes input data.
- Use environment variables for configuration.
- Keep controller logic thin.
- Keep business logic inside service files.
- Avoid `any` unless unavoidable and explain why in the report.

## 3. Before Coding, Produce a Short Plan

Before editing files, write a short implementation plan with:

- files to create
- files to modify
- APIs to add or change
- validation needed
- test commands to run

Then implement the task.

## 4. Validation Required

After implementation, run the available checks when possible:

```bash
npm install
npm run build
npm run lint
npm run dev
```

If a command does not exist yet, write `Not available yet` in the report. Do not pretend it passed.

If an API is added, provide at least one cURL or Postman-style test request.

## 5. Completion Rules

Implementation is complete only if all conditions are met:

- active task requirements are completed or clearly marked as incomplete
- project builds or the build limitation is clearly documented
- no unrelated future feature was implemented
- report file is created in `agent/reports/`
- active task remains in `agent/tasks/active/`
- backlog tasks remain in `agent/tasks/backlog/`
- done tasks remain in `agent/tasks/done/`
- `agent/context/current-task.md` still points to the same active task

If validation fails:

- keep the task in `active/`
- create a report with status `Needs Fix`
- explain the failure clearly
- do not run the advance-task workflow

Important: Do not move the task to `done/` after implementation. Review must happen first.

## 6. Required Final Response

At the end, return exactly these sections:

```md
## Task Status
Done / Needs Fix

## Summary
Short summary of what was implemented.

## Files Changed
- file path: reason

## APIs Added or Changed
- METHOD /path: purpose

## Validation
- command: Passed / Failed / Not available yet

## Report Created
- agent/reports/<report-file>.md

## Review Required
- Run `agent/prompts/review-task.md` before advancing the task.

## Notes
Any limitation or deferred item.
```
