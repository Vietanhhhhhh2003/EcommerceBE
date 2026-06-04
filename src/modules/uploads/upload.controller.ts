import type { RequestHandler } from "express";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/response";
import * as uploadService from "./upload.service";

export const uploadProductImages: RequestHandler = asyncHandler(
  async (request, response) => {
    const files = request.files as Express.Multer.File[] | undefined;
    const uploadedFiles = uploadService.uploadProductImages(files);

    return successResponse(
      response,
      { files: uploadedFiles },
      "Product images uploaded"
    );
  }
);

export const uploadAvatar: RequestHandler = asyncHandler(
  async (request, response) => {
    const result = await uploadService.uploadAvatar(request.user!.id, request.file);

    return successResponse(response, result, "Avatar uploaded");
  }
);
