# Advance Task Prompt (Strict)

Use this prompt only after the current active task has been implemented, reported, reviewed, and approved.

Do not edit source code during this step.

## Preconditions

Before advancing the task, verify:

- there is exactly one file in `agent/tasks/active/`
- the active task has a matching report in `agent/reports/`
- the report status is `Done`
- the active task has a matching review report in `agent/reviews/`
- the review status is `Passed`
- validation results are documented
- no blocking issue is listed in the review report
- `agent/context/current-task.md` still points to the active task being advanced

If any condition fails, stop and do not move files.

## Required Actions

1. Move the completed task from `agent/tasks/active/` to `agent/tasks/done/`.
2. Move the next numbered task from `agent/tasks/backlog/` to `agent/tasks/active/`.
3. Update `agent/context/current-task.md` with:
   - active task number
   - active task title
   - active task file path
   - status: Active
   - explicit out-of-scope warning for future tasks
   - instruction not to move this new task until review passes
4. Do not edit source code during this step.

## Output Format

```md
## Advance Status
Done / Blocked

## Completed Task Moved
- old path -> new path

## Next Task Activated
- old path -> new path

## Current Task Updated
- agent/context/current-task.md

## Notes
Any issue found.
```
