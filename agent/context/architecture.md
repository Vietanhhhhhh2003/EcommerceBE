# Architecture

## Style

The project uses **modular monolith architecture**.

There is one Express backend application, but each business domain is isolated into its own module.

## Main Pattern

Use the controller-service-model pattern.

```txt
Route -> Middleware -> Controller -> Service -> Model/Database
```

## Responsibilities

### Route

- Define endpoint path and HTTP method.
- Attach middleware.
- Attach validation.
- Call controller.

### Controller

- Receive request.
- Read params, query, body, user.
- Call service.
- Return standardized response.
- Must not contain complex business logic.

### Service

- Handle business logic.
- Query database.
- Throw AppError for business errors.
- Keep controller thin.

### Model

- Define Mongoose schema.
- Define database structure.
- Must not contain request/response logic.

### Validation

- Use Zod.
- Validate request body, params, and query when needed.

### Middleware

Common middleware includes:

- `auth.middleware.ts`
- `role.middleware.ts`
- `validate.middleware.ts`
- `error.middleware.ts`
- `not-found.middleware.ts`
- `request-logger.middleware.ts`
- `rate-limit.middleware.ts`

## Suggested Source Structure

```txt
src/
|-- app.ts
|-- server.ts
|-- config/
|   |-- env.ts
|   |-- database.ts
|   |-- redis.ts
|   `-- swagger.ts
|-- common/
|   |-- constants/
|   |-- errors/
|   |-- middlewares/
|   |-- types/
|   `-- utils/
`-- modules/
    |-- auth/
    |-- users/
    |-- products/
    |-- cart/
    |-- orders/
    |-- payments/
    |-- notifications/
    `-- uploads/
```

## Module File Convention

Example product module:

```txt
products/
|-- product.model.ts
|-- product.controller.ts
|-- product.service.ts
|-- product.routes.ts
`-- product.validation.ts
```

## Future Microservice Migration

Do not design as microservices yet.

However, keep modules clean so that later these can be split:

- auth-service
- product-service
- order-service
- payment-service
- notification-service
