# Task 004 - User Module and RBAC

## Status

Backlog

## Goal

Implement user profile APIs and role-based access control.

## Requirements

- Get current user profile.
- Update current user profile.
- Admin list users.
- Admin get user detail.
- Admin update user role/status.
- Role middleware.

## Endpoints

```txt
GET   /api/users/me
PATCH /api/users/me
GET   /api/users
GET   /api/users/:id
PATCH /api/users/:id/role
PATCH /api/users/:id/status
```

## Expected Files

```txt
src/modules/users/user.routes.ts
src/modules/users/user.controller.ts
src/modules/users/user.service.ts
src/modules/users/user.validation.ts
src/common/middlewares/role.middleware.ts
```

## Completion Report

Create:

```txt
agent/reports/004-user-module-and-rbac-report.md
```
