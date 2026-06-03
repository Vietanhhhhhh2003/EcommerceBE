import { HTTP_STATUS } from "../../common/constants/http-status";
import { AppError } from "../../common/errors/app-error";
import {
  User,
  toSafeUser,
  type SafeUser,
  type UserRole,
  type UserStatus
} from "./user.model";
import type { ListUsersQuery, UpdateMeInput } from "./user.validation";

interface PaginatedUsers {
  items: SafeUser[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export const getUserProfile = async (userId: string): Promise<SafeUser> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  return toSafeUser(user);
};

export const updateUserProfile = async (
  userId: string,
  input: UpdateMeInput
): Promise<SafeUser> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { name: input.name },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  return toSafeUser(user);
};

export const listUsers = async (
  query: ListUsersQuery
): Promise<PaginatedUsers> => {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const [users, totalItems] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments()
  ]);
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items: users.map(toSafeUser),
    pagination: {
      page,
      limit,
      totalItems,
      totalPages
    }
  };
};

export const getUserById = async (userId: string): Promise<SafeUser> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  return toSafeUser(user);
};

export const updateUserRole = async (
  userId: string,
  role: UserRole
): Promise<SafeUser> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  return toSafeUser(user);
};

export const updateUserStatus = async (
  userId: string,
  status: UserStatus
): Promise<SafeUser> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  return toSafeUser(user);
};
