import bcrypt from "bcrypt";
import { HTTP_STATUS } from "../../common/constants/http-status";
import { AppError } from "../../common/errors/app-error";
import {
  User,
  toSafeUser,
  type SafeUser,
  type UserDocument
} from "../users/user.model";
import type {
  LoginInput,
  RefreshTokenInput,
  RegisterInput
} from "./auth.validation";
import {
  generateAccessToken,
  generateRefreshToken,
  invalidateRefreshToken,
  persistRefreshToken,
  verifyPersistedRefreshToken,
  verifyRefreshToken
} from "./token.service";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResult extends AuthTokens {
  user: SafeUser;
}

interface RefreshAccessTokenResult {
  accessToken: string;
}

const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password";

const issueTokens = async (user: UserDocument): Promise<AuthTokens> => {
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await persistRefreshToken(user, refreshToken);

  return {
    accessToken,
    refreshToken
  };
};

export const register = async (input: RegisterInput): Promise<AuthResult> => {
  const existingUser = await User.findOne({ email: input.email });

  if (existingUser) {
    throw new AppError("Email already exists", HTTP_STATUS.CONFLICT);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await User.create({
    email: input.email,
    passwordHash,
    name: input.name
  });
  const tokens = await issueTokens(user);

  return {
    user: toSafeUser(user),
    ...tokens
  };
};

export const login = async (input: LoginInput): Promise<AuthResult> => {
  const user = await User.findOne({ email: input.email }).select("+passwordHash");

  if (!user) {
    throw new AppError(INVALID_CREDENTIALS_MESSAGE, HTTP_STATUS.UNAUTHORIZED);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError(INVALID_CREDENTIALS_MESSAGE, HTTP_STATUS.UNAUTHORIZED);
  }

  const tokens = await issueTokens(user);

  return {
    user: toSafeUser(user),
    ...tokens
  };
};

export const refreshAccessToken = async (
  input: RefreshTokenInput
): Promise<RefreshAccessTokenResult> => {
  const payload = verifyRefreshToken(input.refreshToken);

  await verifyPersistedRefreshToken(payload.userId, input.refreshToken);

  return {
    accessToken: generateAccessToken(payload.userId)
  };
};

export const logout = async (input: RefreshTokenInput): Promise<void> => {
  const payload = verifyRefreshToken(input.refreshToken);

  await verifyPersistedRefreshToken(payload.userId, input.refreshToken);
  await invalidateRefreshToken(payload.userId);
};

export const getCurrentUser = async (userId: string): Promise<SafeUser> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  return toSafeUser(user);
};
