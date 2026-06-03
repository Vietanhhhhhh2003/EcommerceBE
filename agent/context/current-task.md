# Current Task

## Active Task

007 - Order Module

## Active Task File

```txt
agent/tasks/active/007-order-module.md
```

## Status

Active

## Rules

* Only implement task 007.
* Do not implement future tasks.
* Do not implement payment, notification, upload, Swagger, or Docker finalization yet.
* Do not move task 007 to `agent/tasks/done/` until `agent/prompts/review-task.md` returns `Passed`.
* Do not move task 008 from `agent/tasks/backlog/` to `agent/tasks/active/` during implementation.
* Do not update this file to task 008 during implementation.
* Task movement is allowed only after `agent/prompts/review-task.md` returns `Passed`, then `agent/prompts/advance-task.md` is run.
