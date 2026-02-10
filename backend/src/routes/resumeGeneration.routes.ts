import express from 'express';
import {
  generateResume,
  downloadResume,
  previewResume,
  getUserResumeGenerations,
  deleteResumeGeneration,
} from '@/controllers/resumeGeneration.controller';
import { optionalAuth } from '@/middleware/auth.middleware';

const router = express.Router();

// Resume generation routes
router.route('/generate').post(optionalAuth, generateResume);

router.route('/download/:id').get(downloadResume);

router.route('/preview/:id').get(previewResume);

router.route('/generations').get(optionalAuth, getUserResumeGenerations);

router.route('/generations/:id').delete(optionalAuth, deleteResumeGeneration);

export default router;
