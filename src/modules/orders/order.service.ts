import mongoose, { Types, type ClientSession } from "mongoose";
import { HTTP_STATUS } from "../../common/constants/http-status";
import { AppError } from "../../common/errors/app-error";
import {
  sendOrderCancelledEmail,
  sendOrderCreatedEmail
} from "../notifications/notification.service";
import type { UserRole } from "../users/user.model";
import { User } from "../users/user.model";
import { Cart, type CartDocument } from "../cart/cart.model";
import { Product, type IProduct } from "../products/product.model";
import {
  Order,
  type IOrderItemSnapshot,
  type OrderDocument,
  type OrderStatus
} from "./order.model";
import type { ListMyOrdersQuery, UpdateOrderStatusInput } from "./order.validation";

interface SafeOrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  quantity: number;
  subtotal: number;
}

export interface SafeOrder {
  id: string;
  userId: string;
  items: SafeOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginatedOrders {
  items: SafeOrder[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

interface OrderProductCandidate {
  product: Pick<IProduct, "name" | "slug" | "price" | "category" | "stock"> & {
    _id: Types.ObjectId;
  };
  quantity: number;
}

const TRANSACTION_UNSUPPORTED_PATTERNS = [
  "Transaction numbers are only allowed on a replica set member or mongos",
  "does not support transactions",
  "Transaction support is not available",
  "transactions are not supported"
];

const CANCELLABLE_ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed"];

const isAdmin = (userRole: UserRole): boolean => userRole === "admin";

const toSafeOrder = (order: OrderDocument): SafeOrder => {
  return {
    id: order.id,
    userId: order.userId.toString(),
    items: order.items.map((item) => ({
      productId: item.productId.toString(),
      name: item.name,
      slug: item.slug,
      price: item.price,
      category: item.category,
      quantity: item.quantity,
      subtotal: item.subtotal
    })),
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
};

const isTransactionUnsupportedError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }

  return TRANSACTION_UNSUPPORTED_PATTERNS.some((pattern) =>
    error.message.includes(pattern)
  );
};

const runWithTransaction = async <T>(
  operation: (session: ClientSession) => Promise<T>
): Promise<T> => {
  const session = await mongoose.startSession();

  try {
    let result: T | undefined;

    await session.withTransaction(async () => {
      result = await operation(session);
    });

    if (result === undefined) {
      throw new AppError("Database transaction failed", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    return result;
  } catch (error) {
    if (isTransactionUnsupportedError(error)) {
      throw new AppError(
        "Database transactions are not supported in the current environment",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

const getOrderById = async (orderId: string): Promise<OrderDocument> => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError("Order not found", HTTP_STATUS.NOT_FOUND);
  }

  return order;
};

const ensureOrderAccess = (
  order: OrderDocument,
  userId: string,
  userRole: UserRole
): void => {
  if (order.userId.toString() === userId || isAdmin(userRole)) {
    return;
  }

  throw new AppError("Forbidden", HTTP_STATUS.FORBIDDEN);
};

const ensureOrderCanBeCancelled = (status: OrderStatus): void => {
  if (!CANCELLABLE_ORDER_STATUSES.includes(status)) {
    throw new AppError("Order cannot be cancelled", HTTP_STATUS.BAD_REQUEST);
  }
};

const ensureValidAdminStatusTransition = (
  currentStatus: OrderStatus,
  nextStatus: OrderStatus
): void => {
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["completed", "cancelled"],
    cancelled: [],
    completed: []
  };

  if (!allowedTransitions[currentStatus].includes(nextStatus)) {
    throw new AppError("Invalid order status transition", HTTP_STATUS.BAD_REQUEST);
  }
};

const buildOrderCandidates = async (
  userId: string,
  session: ClientSession
): Promise<{
  cart: CartDocument;
  candidates: OrderProductCandidate[];
}> => {
  const cart = await Cart.findOne({ userId }).session(session);

  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", HTTP_STATUS.BAD_REQUEST);
  }

  const productIds = cart.items.map((item) => item.productId);
  const products = (await Product.find({
    _id: { $in: productIds },
    status: "active"
  })
    .select("name slug price category stock")
    .session(session)
    .lean()) as Array<
    Pick<IProduct, "name" | "slug" | "price" | "category" | "stock"> & {
      _id: Types.ObjectId;
    }
  >;
  const productsById = new Map(products.map((product) => [product._id.toString(), product]));
  const candidates: OrderProductCandidate[] = [];

  for (const item of cart.items) {
    const product = productsById.get(item.productId.toString());

    if (!product) {
      continue;
    }

    if (item.quantity > product.stock) {
      throw new AppError("Insufficient stock", HTTP_STATUS.BAD_REQUEST);
    }

    candidates.push({
      product,
      quantity: item.quantity
    });
  }

  if (candidates.length === 0) {
    throw new AppError("Cart has no valid active products", HTTP_STATUS.BAD_REQUEST);
  }

  return { cart, candidates };
};

const buildSnapshotItems = (candidates: OrderProductCandidate[]): IOrderItemSnapshot[] => {
  return candidates.map(({ product, quantity }) => ({
    productId: product._id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    category: product.category,
    quantity,
    subtotal: product.price * quantity
  }));
};

const restoreOrderStockIfNeeded = async (
  order: OrderDocument,
  session: ClientSession
): Promise<void> => {
  if (order.stockRestored) {
    return;
  }

  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { stock: item.quantity } },
      { session }
    );
  }

  order.stockRestored = true;
};

const getOrderNotificationRecipient = async (
  userId: string
): Promise<{ email: string; name: string } | null> => {
  const user = await User.findById(userId).select("email name");

  if (!user) {
    return null;
  }

  return {
    email: user.email,
    name: user.name
  };
};

export const createOrder = async (userId: string): Promise<SafeOrder> => {
  const order = await runWithTransaction(async (session) => {
    const { cart, candidates } = await buildOrderCandidates(userId, session);
    const items = buildSnapshotItems(candidates);
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    const [order] = await Order.create(
      [
        {
          userId: new Types.ObjectId(userId),
          items,
          totalAmount,
          status: "pending",
          stockRestored: false
        }
      ],
      { session }
    );

    for (const item of items) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    cart.items = [];
    await cart.save({ session });

    return toSafeOrder(order);
  });

  const recipient = await getOrderNotificationRecipient(userId);

  if (recipient) {
    await sendOrderCreatedEmail(recipient, order);
  }

  return order;
};

export const listMyOrders = async (
  userId: string,
  query: ListMyOrdersQuery
): Promise<PaginatedOrders> => {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const filter = { userId };
  const [orders, totalItems] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter)
  ]);

  return {
    items: orders.map(toSafeOrder),
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  };
};

export const getOrderDetail = async (
  userId: string,
  userRole: UserRole,
  orderId: string
): Promise<SafeOrder> => {
  const order = await getOrderById(orderId);
  ensureOrderAccess(order, userId, userRole);
  return toSafeOrder(order);
};

export const cancelOrder = async (
  userId: string,
  orderId: string
): Promise<SafeOrder> => {
  const order = await runWithTransaction(async (session) => {
    const order = await Order.findById(orderId).session(session);

    if (!order) {
      throw new AppError("Order not found", HTTP_STATUS.NOT_FOUND);
    }

    if (order.userId.toString() !== userId) {
      throw new AppError("Forbidden", HTTP_STATUS.FORBIDDEN);
    }

    ensureOrderCanBeCancelled(order.status);
    await restoreOrderStockIfNeeded(order, session);
    order.status = "cancelled";
    await order.save({ session });

    return toSafeOrder(order);
  });

  const recipient = await getOrderNotificationRecipient(userId);

  if (recipient) {
    await sendOrderCancelledEmail(recipient, order);
  }

  return order;
};

export const updateOrderStatus = async (
  orderId: string,
  input: UpdateOrderStatusInput
): Promise<SafeOrder> => {
  const order = await runWithTransaction(async (session) => {
    const order = await Order.findById(orderId).session(session);

    if (!order) {
      throw new AppError("Order not found", HTTP_STATUS.NOT_FOUND);
    }

    ensureValidAdminStatusTransition(order.status, input.status);

    if (input.status === "cancelled") {
      await restoreOrderStockIfNeeded(order, session);
    }

    order.status = input.status;
    await order.save({ session });

    return toSafeOrder(order);
  });

  if (input.status === "cancelled") {
    const recipient = await getOrderNotificationRecipient(order.userId);

    if (recipient) {
      await sendOrderCancelledEmail(recipient, order);
    }
  }

  return order;
};
