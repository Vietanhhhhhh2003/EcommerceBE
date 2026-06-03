import { Types } from "mongoose";
import { HTTP_STATUS } from "../../common/constants/http-status";
import { AppError } from "../../common/errors/app-error";
import { Product, type IProduct, type ProductStatus } from "../products/product.model";
import { Cart, type CartDocument } from "./cart.model";
import type { AddCartItemInput } from "./cart.validation";

interface CartProductSummary {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  stock: number;
  status: ProductStatus;
}

interface CartResponseItem {
  product: CartProductSummary;
  quantity: number;
  subtotal: number;
}

export interface SafeCartResponse {
  id: string | null;
  userId: string;
  items: CartResponseItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

type SelectedProduct = Pick<
  IProduct,
  "name" | "slug" | "price" | "category" | "stock" | "status"
> & {
  _id: Types.ObjectId;
};

const getEmptyCartResponse = (userId: string): SafeCartResponse => {
  return {
    id: null,
    userId,
    items: [],
    totalItems: 0,
    totalPrice: 0,
    createdAt: null,
    updatedAt: null
  };
};

const getOrCreateCart = async (userId: string): Promise<CartDocument> => {
  const existingCart = await Cart.findOne({ userId });

  if (existingCart) {
    return existingCart;
  }

  return Cart.create({
    userId,
    items: []
  });
};

const getProductForCartMutation = async (productId: string): Promise<SelectedProduct> => {
  const product = (await Product.findById(productId)
    .select("name slug price category stock status")
    .lean()) as SelectedProduct | null;

  if (!product || product.status !== "active") {
    throw new AppError("Product not found", HTTP_STATUS.NOT_FOUND);
  }

  return product;
};

const assertSufficientStock = (
  quantity: number,
  stock: number
): void => {
  if (quantity > stock) {
    throw new AppError("Insufficient stock", HTTP_STATUS.BAD_REQUEST);
  }
};

const buildCartResponse = async (
  userId: string,
  cart: CartDocument | null
): Promise<SafeCartResponse> => {
  if (!cart) {
    return getEmptyCartResponse(userId);
  }

  if (cart.items.length === 0) {
    return {
      id: cart.id,
      userId,
      items: [],
      totalItems: 0,
      totalPrice: 0,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    };
  }

  const productIds = cart.items.map((item) => item.productId);
  const products = (await Product.find({
    _id: { $in: productIds },
    status: "active"
  })
    .select("name slug price category stock status")
    .lean()) as SelectedProduct[];
  const productsById = new Map(products.map((product) => [product._id.toString(), product]));

  const items: CartResponseItem[] = [];

  for (const item of cart.items) {
    const product = productsById.get(item.productId.toString());

    if (!product) {
      continue;
    }

    items.push({
      product: {
        id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        price: product.price,
        category: product.category,
        stock: product.stock,
        status: product.status
      },
      quantity: item.quantity,
      subtotal: product.price * item.quantity
    });
  }

  return {
    id: cart.id,
    userId,
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.subtotal, 0),
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt
  };
};

export const getMyCart = async (userId: string): Promise<SafeCartResponse> => {
  const cart = await Cart.findOne({ userId });
  return buildCartResponse(userId, cart);
};

export const addCartItem = async (
  userId: string,
  input: AddCartItemInput
): Promise<{ cart: SafeCartResponse; created: boolean }> => {
  const product = await getProductForCartMutation(input.productId);
  const cart = await getOrCreateCart(userId);
  const existingItem = cart.items.find(
    (item) => item.productId.toString() === input.productId
  );
  let created = false;

  if (existingItem) {
    const newQuantity = existingItem.quantity + input.quantity;
    assertSufficientStock(newQuantity, product.stock);
    existingItem.quantity = newQuantity;
  } else {
    assertSufficientStock(input.quantity, product.stock);
    cart.items.push({
      productId: new Types.ObjectId(input.productId),
      quantity: input.quantity
    });
    created = true;
  }

  await cart.save();

  return {
    cart: await buildCartResponse(userId, cart),
    created
  };
};

export const updateCartItemQuantity = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<SafeCartResponse> => {
  const product = await getProductForCartMutation(productId);
  assertSufficientStock(quantity, product.stock);

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new AppError("Cart item not found", HTTP_STATUS.NOT_FOUND);
  }

  const item = cart.items.find((entry) => entry.productId.toString() === productId);

  if (!item) {
    throw new AppError("Cart item not found", HTTP_STATUS.NOT_FOUND);
  }

  item.quantity = quantity;
  await cart.save();

  return buildCartResponse(userId, cart);
};

export const removeCartItem = async (
  userId: string,
  productId: string
): Promise<SafeCartResponse> => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new AppError("Cart item not found", HTTP_STATUS.NOT_FOUND);
  }

  const originalLength = cart.items.length;
  cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

  if (cart.items.length === originalLength) {
    throw new AppError("Cart item not found", HTTP_STATUS.NOT_FOUND);
  }

  await cart.save();

  return buildCartResponse(userId, cart);
};

export const clearCart = async (userId: string): Promise<SafeCartResponse> => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return getEmptyCartResponse(userId);
  }

  cart.items = [];
  await cart.save();

  return buildCartResponse(userId, cart);
};
