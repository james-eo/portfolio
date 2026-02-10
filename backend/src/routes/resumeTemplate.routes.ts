import express from 'express';
import {
  getResumeTemplates,
  getResumeTemplate,
  createResumeTemplate,
  updateResumeTemplate,
  deleteResumeTemplate,
  rateResumeTemplate,
  getTemplateRatings,
  incrementDownloadCount,
} from '@/controllers/resumeTemplate.controller';
import { protect } from '@/middleware/auth.middleware';

const router = express.Router();

// Public routes
router.route('/').get(getResumeTemplates).post(protect, createResumeTemplate);

router
  .route('/:id')
  .get(getResumeTemplate)
  .put(protect, updateResumeTemplate)
  .delete(protect, deleteResumeTemplate);

router.route('/:id/rate').post(rateResumeTemplate);

router.route('/:id/ratings').get(getTemplateRatings);

router.route('/:id/download').post(incrementDownloadCount);

export default router;
