import { Schema, model, type HydratedDocument, type Model, Types } from "mongoose";

export type OrderStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentMethod = "vnpay" | "cod";
export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "refunded";

export interface IOrderItemSnapshot {
  productId: Types.ObjectId;
  name: string;
  slug: string;
  price: number;
  category: string;
  quantity: number;
  subtotal: number;
}

export interface IOrder {
  userId: Types.ObjectId;
  items: IOrderItemSnapshot[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  paymentAmount?: number;
  paidAt?: Date;
  vnpayResponseCode?: string;
  vnpayTxnRef?: string;
  stockRestored: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderDocument = HydratedDocument<IOrder>;

const orderItemSnapshotSchema = new Schema<IOrderItemSnapshot>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer"
      }
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: false
  }
);

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    items: {
      type: [orderItemSnapshotSchema],
      required: true,
      validate: {
        validator: (items: IOrderItemSnapshot[]) => items.length > 0,
        message: "Order must contain at least one item"
      }
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMethod: {
      type: String,
      enum: ["vnpay", "cod"],
      required: false
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed", "refunded"],
      default: "unpaid",
      required: true
    },
    paymentTransactionId: {
      type: String,
      required: false,
      trim: true
    },
    paymentAmount: {
      type: Number,
      required: false,
      min: 0
    },
    paidAt: {
      type: Date,
      required: false
    },
    vnpayResponseCode: {
      type: String,
      required: false,
      trim: true
    },
    vnpayTxnRef: {
      type: String,
      required: false,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      required: true,
      index: true
    },
    stockRestored: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  {
    timestamps: true
  }
);

orderSchema.index({ createdAt: 1 });
orderSchema.index({ vnpayTxnRef: 1 }, { unique: true, sparse: true });

export const Order: Model<IOrder> = model<IOrder>("Order", orderSchema);
