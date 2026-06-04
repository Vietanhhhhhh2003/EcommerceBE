import swaggerJSDoc, { type Options } from "swagger-jsdoc";

const localPublicBaseUrl = process.env.PUBLIC_BASE_URL ?? "http://localhost:5000";

const swaggerDefinition: Options["definition"] = {
  openapi: "3.0.3",
  info: {
    title: "Express E-Commerce Backend API",
    version: "1.0.0",
    description:
      "Modular monolith Express e-commerce backend with authentication, RBAC, products, cart, orders, VNPay payment, notifications, uploads, Swagger, and Docker support."
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development"
    },
    {
      url: localPublicBaseUrl,
      description: "Configured public base URL"
    }
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Users" },
    { name: "Products" },
    { name: "Cart" },
    { name: "Orders" },
    { name: "Payments" },
    { name: "Uploads" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      Pagination: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          totalItems: { type: "integer", example: 1 },
          totalPages: { type: "integer", example: 1 }
        }
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "507f1f77bcf86cd799439011" },
          name: { type: "string", example: "Demo User" },
          email: { type: "string", example: "demo@example.com" },
          role: { type: "string", example: "user" },
          status: { type: "string", example: "active" },
          avatarUrl: {
            type: "string",
            nullable: true,
            example: "/uploads/avatars/demo-avatar.webp"
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-04T09:00:00.000Z"
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-04T09:00:00.000Z"
          }
        }
      },
      AuthTokens: {
        type: "object",
        properties: {
          accessToken: { type: "string", example: "change-me-access-token" },
          refreshToken: { type: "string", example: "change-me-refresh-token" }
        }
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string", example: "507f1f77bcf86cd799439012" },
          name: { type: "string", example: "Demo Product" },
          slug: { type: "string", example: "demo-product" },
          description: {
            type: "string",
            example: "Placeholder product description"
          },
          price: { type: "number", example: 199000 },
          category: { type: "string", example: "electronics" },
          stock: { type: "integer", example: 12 },
          status: { type: "string", example: "active" },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-04T09:00:00.000Z"
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-04T09:00:00.000Z"
          }
        }
      },
      CartItem: {
        type: "object",
        properties: {
          product: { $ref: "#/components/schemas/Product" },
          quantity: { type: "integer", example: 1 },
          subtotal: { type: "number", example: 199000 }
        }
      },
      Cart: {
        type: "object",
        properties: {
          id: {
            type: "string",
            nullable: true,
            example: "507f1f77bcf86cd799439013"
          },
          userId: { type: "string", example: "507f1f77bcf86cd799439011" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/CartItem" }
          },
          totalItems: { type: "integer", example: 1 },
          totalPrice: { type: "number", example: 199000 },
          createdAt: {
            type: "string",
            nullable: true,
            format: "date-time",
            example: "2026-06-04T09:00:00.000Z"
          },
          updatedAt: {
            type: "string",
            nullable: true,
            format: "date-time",
            example: "2026-06-04T09:00:00.000Z"
          }
        }
      },
      OrderItem: {
        type: "object",
        properties: {
          productId: { type: "string", example: "507f1f77bcf86cd799439012" },
          name: { type: "string", example: "Demo Product" },
          slug: { type: "string", example: "demo-product" },
          price: { type: "number", example: 199000 },
          category: { type: "string", example: "electronics" },
          quantity: { type: "integer", example: 1 },
          subtotal: { type: "number", example: 199000 }
        }
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string", example: "507f1f77bcf86cd799439014" },
          userId: { type: "string", example: "507f1f77bcf86cd799439011" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" }
          },
          totalAmount: { type: "number", example: 199000 },
          status: { type: "string", example: "pending" },
          paymentMethod: {
            type: "string",
            nullable: true,
            example: "vnpay"
          },
          paymentStatus: {
            type: "string",
            nullable: true,
            example: "unpaid"
          },
          paymentTransactionId: {
            type: "string",
            nullable: true,
            example: "147258369"
          },
          paymentAmount: {
            type: "number",
            nullable: true,
            example: 199000
          },
          paidAt: {
            type: "string",
            nullable: true,
            format: "date-time",
            example: "2026-06-04T09:15:00.000Z"
          },
          vnpayResponseCode: {
            type: "string",
            nullable: true,
            example: "00"
          },
          vnpayTxnRef: {
            type: "string",
            nullable: true,
            example: "VNP-20260604-0001"
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-04T09:00:00.000Z"
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-04T09:05:00.000Z"
          }
        }
      },
      UploadFile: {
        type: "object",
        properties: {
          filename: { type: "string", example: "1717500000000-demo-image.webp" },
          url: {
            type: "string",
            example: "http://localhost:5000/uploads/products/1717500000000-demo-image.webp"
          },
          path: {
            type: "string",
            example: "/uploads/products/1717500000000-demo-image.webp"
          },
          mimetype: { type: "string", example: "image/webp" },
          size: { type: "integer", example: 145021 }
        }
      },
      SuccessEnvelope: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "object", additionalProperties: true },
          message: { type: "string", example: "Request succeeded" }
        }
      },
      ErrorEnvelope: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation failed" },
          errors: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        tags: ["Health"],
        responses: {
          "200": {
            description: "Server is healthy",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: { status: "ok" },
                  message: "Server is running"
                }
              }
            }
          }
        }
      }
    },
    "/api/auth/register": {
      post: {
        summary: "Register a user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "Demo User" },
                  email: { type: "string", example: "demo@example.com" },
                  password: { type: "string", example: "Password123!" }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Registration successful",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: {
                    user: {
                      id: "507f1f77bcf86cd799439011",
                      name: "Demo User",
                      email: "demo@example.com",
                      role: "user",
                      status: "active"
                    },
                    tokens: {
                      accessToken: "change-me-access-token",
                      refreshToken: "change-me-refresh-token"
                    }
                  },
                  message: "Register successful"
                }
              }
            }
          }
        }
      }
    },
    "/api/auth/login": {
      post: {
        summary: "Login",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "demo@example.com" },
                  password: { type: "string", example: "Password123!" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Login successful"
          }
        }
      }
    },
    "/api/auth/refresh-token": {
      post: {
        summary: "Refresh access token",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],
                properties: {
                  refreshToken: {
                    type: "string",
                    example: "change-me-refresh-token"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Access token refreshed"
          }
        }
      }
    },
    "/api/auth/logout": {
      post: {
        summary: "Logout",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],
                properties: {
                  refreshToken: {
                    type: "string",
                    example: "change-me-refresh-token"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Logout successful",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: null,
                  message: "Logout successful"
                }
              }
            }
          }
        }
      }
    },
    "/api/auth/me": {
      get: {
        summary: "Get current authenticated user",
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user retrieved"
          },
          "401": {
            description: "Authentication required"
          }
        }
      }
    },
    "/api/users/me": {
      get: {
        summary: "Get current user profile",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user profile retrieved"
          }
        }
      },
      patch: {
        summary: "Update current user profile",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user profile updated"
          }
        }
      }
    },
    "/api/users": {
      get: {
        summary: "List users",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        description: "Admin-only route. Requires Bearer token and admin role.",
        responses: {
          "200": {
            description: "Users retrieved",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: {
                    items: [
                      {
                        id: "507f1f77bcf86cd799439011",
                        name: "Demo User",
                        email: "demo@example.com",
                        role: "user",
                        status: "active",
                        avatarUrl: null
                      }
                    ],
                    pagination: {
                      page: 1,
                      limit: 10,
                      totalItems: 1,
                      totalPages: 1
                    }
                  },
                  message: "Users retrieved"
                }
              }
            }
          },
          "403": {
            description: "Forbidden",
            content: {
              "application/json": {
                example: {
                  success: false,
                  data: null,
                  message: "Forbidden"
                }
              }
            }
          }
        }
      }
    },
    "/api/users/{id}": {
      get: {
        summary: "Get user detail",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        description: "Admin-only route. Requires Bearer token and admin role.",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
              example: "507f1f77bcf86cd799439011"
            }
          }
        ],
        responses: {
          "200": {
            description: "User detail retrieved"
          }
        }
      }
    },
    "/api/users/{id}/role": {
      patch: {
        summary: "Update user role",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        description: "Admin-only route. Requires Bearer token and admin role.",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
              example: "507f1f77bcf86cd799439011"
            }
          }
        ],
        responses: {
          "200": {
            description: "User role updated"
          }
        }
      }
    },
    "/api/users/{id}/status": {
      patch: {
        summary: "Update user status",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        description: "Admin-only route. Requires Bearer token and admin role.",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
              example: "507f1f77bcf86cd799439011"
            }
          }
        ],
        responses: {
          "200": {
            description: "User status updated"
          }
        }
      }
    },
    "/api/products": {
      get: {
        summary: "List public products",
        tags: ["Products"],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", example: 1 }
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", example: 10 }
          },
          {
            in: "query",
            name: "search",
            schema: { type: "string", example: "demo" }
          },
          {
            in: "query",
            name: "category",
            schema: { type: "string", example: "electronics" }
          },
          {
            in: "query",
            name: "sort",
            schema: {
              type: "string",
              enum: ["newest", "oldest", "price_asc", "price_desc"],
              example: "newest"
            }
          }
        ],
        responses: {
          "200": {
            description: "Products retrieved",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: {
                    items: [
                      {
                        id: "507f1f77bcf86cd799439012",
                        name: "Demo Product",
                        slug: "demo-product",
                        description: "Placeholder product description",
                        price: 199000,
                        category: "electronics",
                        stock: 12,
                        status: "active"
                      }
                    ],
                    pagination: {
                      page: 1,
                      limit: 10,
                      totalItems: 1,
                      totalPages: 1
                    }
                  },
                  message: "Products retrieved"
                }
              }
            }
          }
        }
      },
      post: {
        summary: "Create product",
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        description: "Admin-only route. Requires Bearer token and admin role.",
        responses: {
          "201": {
            description: "Product created"
          }
        }
      }
    },
    "/api/products/{id}": {
      get: {
        summary: "Get public product detail",
        tags: ["Products"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
              example: "507f1f77bcf86cd799439012"
            }
          }
        ],
        responses: {
          "200": {
            description: "Product detail retrieved"
          }
        }
      },
      patch: {
        summary: "Update product",
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        description: "Admin-only route. Requires Bearer token and admin role.",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
              example: "507f1f77bcf86cd799439012"
            }
          }
        ],
        responses: {
          "200": {
            description: "Product updated"
          }
        }
      },
      delete: {
        summary: "Delete product",
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        description: "Admin-only route. Requires Bearer token and admin role.",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
              example: "507f1f77bcf86cd799439012"
            }
          }
        ],
        responses: {
          "200": {
            description: "Product deleted"
          }
        }
      }
    },
    "/api/cart": {
      get: {
        summary: "Get current cart",
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Cart retrieved"
          }
        }
      },
      delete: {
        summary: "Clear cart",
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Cart cleared"
          }
        }
      }
    },
    "/api/cart/items": {
      post: {
        summary: "Add item to cart",
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Cart item quantity increased"
          },
          "201": {
            description: "Cart item created"
          }
        }
      }
    },
    "/api/cart/items/{productId}": {
      patch: {
        summary: "Update cart item quantity",
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "productId",
            required: true,
            schema: {
              type: "string",
              example: "507f1f77bcf86cd799439012"
            }
          }
        ],
        responses: {
          "200": {
            description: "Cart item updated"
          }
        }
      },
      delete: {
        summary: "Remove cart item",
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "productId",
            required: true,
            schema: {
              type: "string",
              example: "507f1f77bcf86cd799439012"
            }
          }
        ],
        responses: {
          "200": {
            description: "Cart item removed"
          }
        }
      }
    },
    "/api/orders": {
      post: {
        summary: "Create order from cart",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        responses: {
          "201": {
            description: "Order created"
          }
        }
      }
    },
    "/api/orders/me": {
      get: {
        summary: "List my orders",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", example: 1 }
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", example: 10 }
          }
        ],
        responses: {
          "200": {
            description: "Orders retrieved",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: {
                    items: [
                      {
                        id: "507f1f77bcf86cd799439014",
                        userId: "507f1f77bcf86cd799439011",
                        items: [
                          {
                            productId: "507f1f77bcf86cd799439012",
                            name: "Demo Product",
                            slug: "demo-product",
                            price: 199000,
                            category: "electronics",
                            quantity: 1,
                            subtotal: 199000
                          }
                        ],
                        totalAmount: 199000,
                        status: "pending"
                      }
                    ],
                    pagination: {
                      page: 1,
                      limit: 10,
                      totalItems: 1,
                      totalPages: 1
                    }
                  },
                  message: "Orders retrieved"
                }
              }
            }
          }
        }
      }
    },
    "/api/orders/{id}": {
      get: {
        summary: "Get order detail",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
              example: "507f1f77bcf86cd799439014"
            }
          }
        ],
        responses: {
          "200": {
            description: "Order detail retrieved"
          }
        }
      }
    },
    "/api/orders/{id}/cancel": {
      patch: {
        summary: "Cancel own order",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
              example: "507f1f77bcf86cd799439014"
            }
          }
        ],
        responses: {
          "200": {
            description: "Order cancelled"
          }
        }
      }
    },
    "/api/orders/{id}/status": {
      patch: {
        summary: "Update order status",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        description: "Admin-only route. Requires Bearer token and admin role.",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
              example: "507f1f77bcf86cd799439014"
            }
          }
        ],
        responses: {
          "200": {
            description: "Order status updated"
          }
        }
      }
    },
    "/api/payments/vnpay/create": {
      post: {
        summary: "Create VNPay payment URL",
        tags: ["Payments"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId"],
                properties: {
                  orderId: {
                    type: "string",
                    example: "507f1f77bcf86cd799439014"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "VNPay payment URL created",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: {
                    paymentUrl:
                      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
                    order: {
                      id: "507f1f77bcf86cd799439014",
                      status: "pending",
                      paymentMethod: "vnpay",
                      paymentStatus: "pending",
                      paymentAmount: 199000,
                      vnpayTxnRef: "VNP-20260604-0001"
                    }
                  },
                  message: "VNPay payment URL created"
                }
              }
            }
          }
        }
      }
    },
    "/api/payments/vnpay/return": {
      get: {
        summary: "Process VNPay return callback",
        tags: ["Payments"],
        parameters: [
          {
            in: "query",
            name: "vnp_TxnRef",
            required: true,
            schema: { type: "string", example: "VNP-20260604-0001" }
          },
          {
            in: "query",
            name: "vnp_Amount",
            required: true,
            schema: { type: "string", example: "19900000" }
          },
          {
            in: "query",
            name: "vnp_ResponseCode",
            required: true,
            schema: { type: "string", example: "00" }
          },
          {
            in: "query",
            name: "vnp_SecureHash",
            required: true,
            schema: { type: "string", example: "change-me-vnpay-signature" }
          }
        ],
        responses: {
          "200": {
            description: "VNPay return processed"
          },
          "400": {
            description: "Invalid signature or amount mismatch"
          }
        }
      }
    },
    "/api/payments/vnpay/ipn": {
      get: {
        summary: "Process VNPay IPN callback",
        tags: ["Payments"],
        description:
          "Returns VNPay-compatible `{ RspCode, Message }` instead of the standard API envelope.",
        parameters: [
          {
            in: "query",
            name: "vnp_TxnRef",
            required: true,
            schema: { type: "string", example: "VNP-20260604-0001" }
          },
          {
            in: "query",
            name: "vnp_Amount",
            required: true,
            schema: { type: "string", example: "19900000" }
          },
          {
            in: "query",
            name: "vnp_ResponseCode",
            required: true,
            schema: { type: "string", example: "00" }
          },
          {
            in: "query",
            name: "vnp_SecureHash",
            required: true,
            schema: { type: "string", example: "change-me-vnpay-signature" }
          }
        ],
        responses: {
          "200": {
            description: "VNPay IPN processed",
            content: {
              "application/json": {
                example: {
                  RspCode: "00",
                  Message: "Confirm Success"
                }
              }
            }
          }
        }
      }
    },
    "/api/uploads/products": {
      post: {
        summary: "Upload product images",
        tags: ["Uploads"],
        security: [{ bearerAuth: [] }],
        description:
          "Admin-only route. Requires Bearer token and admin role. Accepts multipart field `images`.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["images"],
                properties: {
                  images: {
                    type: "array",
                    items: { type: "string", format: "binary" }
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Product images uploaded"
          }
        }
      }
    },
    "/api/uploads/avatar": {
      post: {
        summary: "Upload current user avatar",
        tags: ["Uploads"],
        security: [{ bearerAuth: [] }],
        description:
          "Requires Bearer token. Accepts multipart field `avatar`.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["avatar"],
                properties: {
                  avatar: { type: "string", format: "binary" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Avatar uploaded"
          }
        }
      }
    }
  }
};

const swaggerOptions: Options = {
  definition: swaggerDefinition,
  apis: []
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
