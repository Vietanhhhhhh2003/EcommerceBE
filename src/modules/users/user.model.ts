import { Schema, model, type HydratedDocument, type Model } from "mongoose";

export type UserRole = "user" | "admin";
export type UserStatus = "active" | "disabled";

export interface IUser {
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  refreshTokenHash?: string | null;
  refreshTokenExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    avatarUrl: {
      type: String,
      required: false,
      trim: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true
    },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
      required: true
    },
    refreshTokenHash: {
      type: String,
      default: null,
      select: false
    },
    refreshTokenExpiresAt: {
      type: Date,
      default: null,
      select: false
    }
  },
  {
    timestamps: true
  }
);

export const toSafeUser = (user: UserDocument): SafeUser => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

export const User: Model<IUser> = model<IUser>("User", userSchema);
