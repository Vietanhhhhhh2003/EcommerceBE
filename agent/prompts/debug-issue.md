# Debug Issue Prompt (Strict)

You are fixing a bug in the current repository.
Do not implement new features.
Do not refactor unrelated code.

## 0. Mandatory Reading Order

Read:

1. `agent/README.md`
2. `agent/context/project-brief.md`
3. `agent/context/architecture.md`
4. `agent/context/coding-rules.md`
5. `agent/context/api-convention.md`
6. `agent/context/current-task.md`
7. the error message, stack trace, failing command, or failing API request
8. only the files related to the failure

## 1. Debug Rules

You MUST:

- identify the root cause before changing files
- fix the smallest possible scope
- preserve existing architecture and response format
- avoid unrelated formatting-only changes
- avoid changing public API behavior unless required by the bug
- document changed files and test steps

You MUST NOT:

- implement backlog tasks
- rewrite a whole module when a small fix is enough
- hide errors by removing validation or disabling checks
- hard-code environment values

## 2. Required Output

Return exactly:

```md
## Root Cause
Explain the real cause of the bug.

## Fix Summary
Explain the minimal fix.

## Files Changed
- file path: reason

## How to Test
- command or API request

## Validation Result
- command: Passed / Failed / Not available yet

## Notes
Limitations or follow-up items.
```
