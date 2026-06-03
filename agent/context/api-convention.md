# API Convention

## Base URL

```txt
/api
```

## Standard Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

## Standard Error Response

```json
{
  "success": false,
  "data": null,
  "message": "Error message"
}
```

## Pagination Response

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 0,
      "totalPages": 0
    }
  },
  "message": "Success"
}
```

## Common Status Codes

| Code | Usage |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict |
| 500 | Internal server error |

## Endpoint Naming

Use plural resource names.

```txt
/api/auth/register
/api/auth/login
/api/users/me
/api/products
/api/cart
/api/orders
/api/payments/vnpay/create
/api/uploads/products
```

## Auth Header

```txt
Authorization: Bearer <access_token>
```

## Roles

```txt
user
admin
```

## Query Convention

Product list should support:

```txt
?page=1&limit=10
?search=iphone
?category=phone
?minPrice=1000000&maxPrice=10000000
?sort=price_asc
```
