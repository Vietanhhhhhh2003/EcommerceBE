# Task 003 - Auth Module

## Status

Backlog

## Goal

Implement user registration, login, JWT auth, refresh token, logout, and current user endpoint.

## Requirements

- User model.
- Register API.
- Login API.
- Access token generation.
- Refresh token generation.
- Refresh token storage using Redis or database.
- Auth middleware.
- Logout invalidates refresh token.
- GET current user.
- Zod validation.

## Endpoints

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
GET  /api/auth/me
```

## Expected Files

```txt
src/modules/auth/auth.routes.ts
src/modules/auth/auth.controller.ts
src/modules/auth/auth.service.ts
src/modules/auth/auth.validation.ts
src/modules/auth/token.service.ts
src/modules/users/user.model.ts
src/common/middlewares/auth.middleware.ts
```

## Security Rules

- Do not return passwordHash.
- Hash password with bcrypt.
- JWT secret from env only.
- Refresh token must be invalidated on logout.

## Completion Report

Create:

```txt
agent/reports/003-auth-module-report.md
```
