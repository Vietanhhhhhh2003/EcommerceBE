import bcrypt from "bcrypt";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { redisClient } from "../../config/redis";
import { HTTP_STATUS } from "../../common/constants/http-status";
import { AppError } from "../../common/errors/app-error";
import { User, type UserDocument } from "../users/user.model";

type TokenType = "access" | "refresh";

interface AuthTokenPayload {
  userId: string;
  type: TokenType;
}

const REFRESH_TOKEN_KEY_PREFIX = "auth:refresh";

const getRefreshTokenKey = (userId: string): string => {
  return `${REFRESH_TOKEN_KEY_PREFIX}:${userId}`;
};

const signToken = (
  payload: AuthTokenPayload,
  secret: string,
  expiresIn: string
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"]
  };

  return jwt.sign(payload, secret, options);
};

const parseTokenPayload = (
  decoded: string | JwtPayload,
  expectedType: TokenType
): AuthTokenPayload => {
  if (
    typeof decoded === "string" ||
    typeof decoded.userId !== "string" ||
    decoded.type !== expectedType
  ) {
    throw new AppError("Invalid token", HTTP_STATUS.UNAUTHORIZED);
  }

  return {
    userId: decoded.userId,
    type: expectedType
  };
};

const hashRefreshToken = async (refreshToken: string): Promise<string> => {
  return bcrypt.hash(refreshToken, 12);
};

export const generateAccessToken = (userId: string): string => {
  return signToken(
    { userId, type: "access" },
    env.jwtAccessSecret,
    env.jwtAccessExpiresIn
  );
};

export const generateRefreshToken = (userId: string): string => {
  return signToken(
    { userId, type: "refresh" },
    env.jwtRefreshSecret,
    env.jwtRefreshExpiresIn
  );
};

export const verifyAccessToken = (accessToken: string): AuthTokenPayload => {
  try {
    return parseTokenPayload(
      jwt.verify(accessToken, env.jwtAccessSecret),
      "access"
    );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Invalid or expired access token", HTTP_STATUS.UNAUTHORIZED);
  }
};

export const verifyRefreshToken = (refreshToken: string): AuthTokenPayload => {
  try {
    return parseTokenPayload(
      jwt.verify(refreshToken, env.jwtRefreshSecret),
      "refresh"
    );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Invalid or expired refresh token", HTTP_STATUS.UNAUTHORIZED);
  }
};

export const persistRefreshToken = async (
  user: UserDocument,
  refreshToken: string
): Promise<void> => {
  const refreshTokenHash = await hashRefreshToken(refreshToken);
  const expiresAt = new Date(Date.now() + env.refreshTokenExpiresSeconds * 1000);

  if (redisClient.isOpen) {
    await redisClient.set(getRefreshTokenKey(user.id), refreshTokenHash, {
      EX: env.refreshTokenExpiresSeconds
    });

    await User.updateOne(
      { _id: user.id },
      {
        $unset: {
          refreshTokenHash: "",
          refreshTokenExpiresAt: ""
        }
      }
    );
    return;
  }

  await User.updateOne(
    { _id: user.id },
    {
      refreshTokenHash,
      refreshTokenExpiresAt: expiresAt
    }
  );
};

export const verifyPersistedRefreshToken = async (
  userId: string,
  refreshToken: string
): Promise<void> => {
  if (redisClient.isOpen) {
    const storedHash = await redisClient.get(getRefreshTokenKey(userId));

    if (storedHash && (await bcrypt.compare(refreshToken, storedHash))) {
      return;
    }
  }

  const user = await User.findById(userId).select(
    "+refreshTokenHash +refreshTokenExpiresAt"
  );

  if (
    !user?.refreshTokenHash ||
    !user.refreshTokenExpiresAt ||
    user.refreshTokenExpiresAt.getTime() <= Date.now()
  ) {
    throw new AppError("Invalid refresh token", HTTP_STATUS.UNAUTHORIZED);
  }

  const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);

  if (!isMatch) {
    throw new AppError("Invalid refresh token", HTTP_STATUS.UNAUTHORIZED);
  }
};

export const invalidateRefreshToken = async (userId: string): Promise<void> => {
  if (redisClient.isOpen) {
    await redisClient.del(getRefreshTokenKey(userId));
  }

  await User.updateOne(
    { _id: userId },
    {
      $unset: {
        refreshTokenHash: "",
        refreshTokenExpiresAt: ""
      }
    }
  );
};
