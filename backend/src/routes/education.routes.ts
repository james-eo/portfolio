import express from 'express';
import {
  getEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
} from '@/controllers/education.controller';
import { protect, authorize } from '@/middleware/auth.middleware';

const router = express.Router();

router.route('/').get(getEducation).post(protect, authorize('admin'), createEducation);

router
  .route('/:id')
  .get(getEducationById)
  .put(protect, authorize('admin'), updateEducation)
  .delete(protect, authorize('admin'), deleteEducation);

export default router;
