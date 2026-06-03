# Project Brief

## Project Name

Express E-Commerce Backend API

## Goal

Build a backend e-commerce system using Express.js and TypeScript.

The project should support authentication, product management, cart, order, VNPay payment, email notification, file upload, Redis, Docker, and Swagger documentation.

## Architecture Direction

Start with a **modular monolith**.

Do not split into microservices at the beginning. Each domain should be separated into modules so that future migration to microservices is possible.

## Main Modules

- Auth
- Users
- Products
- Cart
- Orders
- Payments
- Notifications
- Uploads

## Main Technologies

- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- Redis
- Zod
- Nodemailer
- Multer
- VNPay sandbox
- Swagger
- Docker Compose

## API Response Format

All APIs must use:

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

Error response:

```json
{
  "success": false,
  "data": null,
  "message": "Error message"
}
```

## MVP Scope

- Register, login, refresh token, logout, current user
- Admin CRUD product
- Public product list/detail/search/filter
- User cart
- Create order from cart
- VNPay payment URL and return/IPN handling
- Email notification
- Product image upload
- Swagger docs
- Docker Compose

## Out of Scope for MVP

- Microservices
- Kafka/RabbitMQ
- Advanced recommendation system
- Coupon system
- Wishlist
- Product review/rating
- Complex delivery tracking
