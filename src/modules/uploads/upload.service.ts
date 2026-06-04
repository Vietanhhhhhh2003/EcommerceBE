import path from "node:path";
import { HTTP_STATUS } from "../../common/constants/http-status";
import { AppError } from "../../common/errors/app-error";
import { User, toSafeUser, type SafeUser } from "../users/user.model";

export interface UploadedFileMetadata {
  filename: string;
  url: string;
  path: string;
  mimetype: string;
  size: number;
}

interface AvatarUploadResult {
  file: UploadedFileMetadata;
  user: SafeUser;
}

const toRelativeUploadPath = (absoluteFilePath: string): string => {
  const uploadsRoot = path.resolve(process.cwd(), "uploads");
  const relativePath = path.relative(uploadsRoot, absoluteFilePath);

  if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new AppError("Invalid uploaded file path", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  return path.posix.join("uploads", ...relativePath.split(path.sep));
};

const toUploadedFileMetadata = (
  file: Express.Multer.File
): UploadedFileMetadata => {
  const relativePath = toRelativeUploadPath(file.path);

  return {
    filename: file.filename,
    url: `/${relativePath}`,
    path: relativePath,
    mimetype: file.mimetype,
    size: file.size
  };
};

const ensureFilesPresent = (
  files: Express.Multer.File[] | undefined
): Express.Multer.File[] => {
  if (!files || files.length === 0) {
    throw new AppError("At least one image file is required", HTTP_STATUS.BAD_REQUEST);
  }

  return files;
};

const ensureFilePresent = (
  file: Express.Multer.File | undefined
): Express.Multer.File => {
  if (!file) {
    throw new AppError("Avatar image file is required", HTTP_STATUS.BAD_REQUEST);
  }

  return file;
};

export const uploadProductImages = (
  files: Express.Multer.File[] | undefined
): UploadedFileMetadata[] => {
  return ensureFilesPresent(files).map(toUploadedFileMetadata);
};

export const uploadAvatar = async (
  userId: string,
  file: Express.Multer.File | undefined
): Promise<AvatarUploadResult> => {
  const avatarFile = ensureFilePresent(file);
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  const metadata = toUploadedFileMetadata(avatarFile);
  user.avatarUrl = metadata.url;
  await user.save();

  return {
    file: metadata,
    user: toSafeUser(user)
  };
};
