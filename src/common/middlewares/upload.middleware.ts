import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import multer, { MulterError } from "multer";
import type { RequestHandler } from "express";
import { HTTP_STATUS } from "../constants/http-status";
import { AppError } from "../errors/app-error";

const uploadsRootDirectory = path.resolve(process.cwd(), "uploads");
const allowedMimeToExtension = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"]
]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const ensureDirectory = (directory: string): void => {
  fs.mkdirSync(directory, { recursive: true });
};

const getValidatedExtension = (file: Express.Multer.File): string => {
  const normalizedExtension = path.extname(file.originalname).toLowerCase();
  const expectedExtension = allowedMimeToExtension.get(file.mimetype);

  if (!expectedExtension) {
    throw new AppError(
      "Only JPEG, PNG, and WEBP image uploads are allowed",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (
    normalizedExtension &&
    (!allowedExtensions.has(normalizedExtension) ||
      (file.mimetype === "image/jpeg" &&
        ![".jpg", ".jpeg"].includes(normalizedExtension)) ||
      (file.mimetype !== "image/jpeg" && normalizedExtension !== expectedExtension))
  ) {
    throw new AppError(
      "Only JPEG, PNG, and WEBP image uploads are allowed",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  return normalizedExtension || expectedExtension;
};

const buildStorage = (folderName: "products" | "avatars") =>
  multer.diskStorage({
    destination: (_request, _file, callback) => {
      const targetDirectory = path.join(uploadsRootDirectory, folderName);
      ensureDirectory(targetDirectory);
      callback(null, targetDirectory);
    },
    filename: (_request, file, callback) => {
      try {
        const extension = getValidatedExtension(file);
        const filename = `${Date.now()}-${crypto.randomBytes(12).toString("hex")}${extension}`;
        callback(null, filename);
      } catch (error) {
        callback(error as Error, "");
      }
    }
  });

const fileFilter: multer.Options["fileFilter"] = (_request, file, callback) => {
  try {
    getValidatedExtension(file);
    callback(null, true);
  } catch (error) {
    callback(error as Error);
  }
};

const toUploadError = (error: unknown): Error => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
    return new AppError("Uploaded file exceeds the allowed size limit", HTTP_STATUS.BAD_REQUEST);
  }

  if (error instanceof MulterError) {
    return new AppError("Invalid upload payload", HTTP_STATUS.BAD_REQUEST);
  }

  return new AppError("Invalid upload payload", HTTP_STATUS.BAD_REQUEST);
};

const wrapUploadMiddleware = (
  middleware: RequestHandler
): RequestHandler => {
  return (request, response, next) => {
    middleware(request, response, (error?: unknown) => {
      if (error) {
        next(toUploadError(error));
        return;
      }

      next();
    });
  };
};

const productUpload = multer({
  storage: buildStorage("products"),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  }
});

const avatarUpload = multer({
  storage: buildStorage("avatars"),
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1
  }
});

export const uploadProductImagesMiddleware = wrapUploadMiddleware(
  productUpload.array("images", 10)
);
export const uploadAvatarMiddleware = wrapUploadMiddleware(
  avatarUpload.single("avatar")
);
