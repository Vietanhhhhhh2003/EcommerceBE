# Task 009 - Notification and Upload Module

## Status

Backlog

## Goal

Implement email notification and image upload.

## Requirements

### Notification

- Setup Nodemailer.
- Send welcome email.
- Send order created email.
- Send payment success email.
- Send order cancelled email.

### Upload

- Setup Multer.
- Upload product images.
- Upload avatar image.
- Validate file type.
- Limit file size.
- Return uploaded file URL/path.

## Endpoints

```txt
POST /api/uploads/products
POST /api/uploads/avatar
```

## Expected Files

```txt
src/modules/notifications/notification.service.ts
src/modules/notifications/email-templates.ts
src/modules/uploads/upload.routes.ts
src/modules/uploads/upload.controller.ts
src/modules/uploads/upload.service.ts
src/common/middlewares/upload.middleware.ts
```

## Completion Report

Create:

```txt
agent/reports/009-notification-and-upload-module-report.md
```
