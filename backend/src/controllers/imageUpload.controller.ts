import type { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../utils/asyncHandler';
import cloudinary from '../utils/cloudinary';
import type { Express } from 'express';

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const file = req.file as Express.Multer.File & {
    path?: string;
    secure_url?: string;
  };

  if (!file) {
    return next(new ErrorResponse('No file uploaded', 400));
  }

  // If using Cloudinary storage via multer, the file object will have path/secure_url
  const imageUrl = file.path || file.secure_url;

  if (!imageUrl) {
    return next(new ErrorResponse('Failed to upload image to cloud storage', 500));
  }

  res.status(200).json({
    success: true,
    data: {
      url: imageUrl,
      filename: file.originalname,
      size: file.size,
    },
  });
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
export const deleteImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { publicId } = req.params;

  // Ensure publicId is a string (not array)
  if (!publicId || Array.isArray(publicId)) {
    return next(new ErrorResponse('Public ID is required', 400));
  }

  try {
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId as string, {
      resource_type: 'image',
    });

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
      });
    } else {
      return next(new ErrorResponse('Failed to delete image from cloud storage', 500));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error deleting image';
    return next(new ErrorResponse(errorMessage, 500));
  }
});
