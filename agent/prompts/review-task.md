# Review Implemented Active Task Prompt (Strict)

You are reviewing the latest implemented task.
Do not implement new features unless explicitly asked after the review.

Important: The task should still be in `agent/tasks/active/` during review. Do not review against the next task.

## 0. Mandatory Reading Order

Read these files first:

1. `agent/README.md`
2. `agent/context/project-brief.md`
3. `agent/context/architecture.md`
4. `agent/context/coding-rules.md`
5. `agent/context/api-convention.md`
6. `agent/context/current-task.md`
7. the single task file inside `agent/tasks/active/`
8. matching report in `agent/reports/`
9. files listed in the report's `Files Changed` section

If the active task file and report do not match the same task number, stop and return `Needs Changes`.

## 1. Review Scope

Review only the implemented active task. Do not review unrelated modules unless they were changed by this task.

Check for:

- task scope compliance
- future-task leakage
- architecture compliance
- route/controller/service/model separation
- response format consistency
- Zod validation where required
- centralized error handling
- TypeScript typing quality
- security issues
- hard-coded secrets
- sensitive data exposure
- missing tests or validation steps
- task was not moved to `done/` prematurely
- next task was not activated prematurely
- `current-task.md` still points to the reviewed task
- inaccurate or incomplete report

## 2. Review Report Requirement

Create a review report in:

```txt
agent/reviews/<task-id>-<task-name>-review.md
```

The review report must include:

- Review Status: Passed / Needs Changes
- Scope Check
- Architecture Check
- API Convention Check
- Security Check
- Validation Check
- Issues Found
- Required Fixes
- Final Decision

## 3. Review Output Format

Return exactly:

```md
## Review Status
Passed / Needs Changes

## Scope Check
Passed / Needs Changes

## Architecture Check
Passed / Needs Changes

## API Convention Check
Passed / Needs Changes

## Security Check
Passed / Needs Changes

## Validation Check
Passed / Needs Changes

## Lifecycle Check
Passed / Needs Changes

## Issues Found
1. issue + file path + why it matters

## Required Fixes
1. concrete fix instruction

## Optional Improvements
1. optional suggestion

## Review Report Created
- agent/reviews/<review-file>.md

## Final Decision
Passed / Needs Changes
```

If there are no issues, write `No blocking issues found.` under `Issues Found`.

If final decision is `Passed`, the next allowed step is `agent/prompts/advance-task.md`.
If final decision is `Needs Changes`, keep the same task active and fix it first.
