# Task Report: <TASK_NUMBER> - <TASK_TITLE>

## Status
Done / Needs Fix

## 1. Task Summary

Briefly describe what this task was supposed to implement.

## 2. Scope Completed

- Completed item 1
- Completed item 2
- Completed item 3

## 3. Files Changed

| File | Change Type | Reason |
|---|---|---|
| `path/to/file.ts` | Created/Updated/Deleted | Reason |

## 4. APIs Added or Changed

| Method | Path | Purpose | Auth Required |
|---|---|---|---|
| GET | `/health` | Health check | No |

If no API was added, write: `No API added or changed.`

## 5. Environment Variables Added

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | Yes | Server port |

If no env var was added, write: `No environment variable added.`

## 6. How to Test

```bash
npm install
npm run build
npm run dev
```

API test example:

```bash
curl http://localhost:5000/health
```

## 7. Validation Result

| Check | Result | Notes |
|---|---|---|
| npm install | Passed / Failed / Not available yet | |
| npm run build | Passed / Failed / Not available yet | |
| npm run lint | Passed / Failed / Not available yet | |
| npm run dev | Passed / Failed / Not available yet | |
| API manual test | Passed / Failed / Not available yet | |

## 8. Lifecycle State

- Active task file remained in `agent/tasks/active/`: Yes / No
- Task was not moved to `done/` during implementation: Yes / No
- Next task was not activated during implementation: Yes / No
- `current-task.md` still points to this task: Yes / No

## 9. Out of Scope / Deferred

- Item intentionally not implemented because it belongs to a future task.

## 10. Risks / Limitations

- Known limitation or risk.

## 11. Suggested Next Step

Run review before advancing:

```txt
agent/prompts/review-task.md
```

Do not activate the next task until review status is `Passed`.
