import express from 'express';
import { uploadImage, deleteImage } from '@/controllers/imageUpload.controller';
import { upload } from '@/utils/cloudinary';
import { protect, authorize } from '@/middleware/auth.middleware';

const router = express.Router();

// Upload image
router.post('/', protect, authorize('admin'), upload.single('image'), uploadImage);

// Delete image
router.delete('/:publicId', protect, authorize('admin'), deleteImage);

export default router;
