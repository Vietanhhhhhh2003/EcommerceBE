# CLAUDE.md

This file gives coding-agent instructions for the Express E-Commerce Backend API.

## Read First

Before coding, read these files:

1. `agent/README.md`
2. `agent/context/project-brief.md`
3. `agent/context/architecture.md`
4. `agent/context/coding-rules.md`
5. `agent/context/api-convention.md`
6. `agent/context/current-task.md`
7. The single task file in `agent/tasks/active/`

## Workflow

```txt
active task -> implement -> create report -> review -> if passed, advance task
```

Implementation must not move task files.
Review must happen while the implemented task is still in `agent/tasks/active/`.
Only `agent/prompts/advance-task.md` can move task files after review passes.

## Hard Rules

- Implement only the active task.
- Do not implement future backlog tasks.
- Do not refactor unrelated files.
- Do not change response format.
- Do not hard-code secrets.
- Do not expose password hashes or sensitive data.
- Keep controller logic thin.
- Put business logic in service files.
- Use Zod for request validation when input data exists.
- Use centralized error handling.

## Folder Layout

```txt
agent/
|-- context/
|-- tasks/
|   |-- active/
|   |-- backlog/
|   `-- done/
|-- reports/
|-- reviews/
|-- templates/
`-- prompts/
```

## Correct Lifecycle

```txt
backlog -> active -> implementation -> report -> review -> advance -> done
```

If review fails:

```txt
review -> needs changes -> fix same active task -> report update -> review again
```
