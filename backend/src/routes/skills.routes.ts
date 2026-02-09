import express from 'express';
import {
  getSkillCategories,
  getSkillCategory,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
} from '@/controllers/skills.controller';
import { protect, authorize } from '@/middleware/auth.middleware';

const router = express.Router();

router.route('/').get(getSkillCategories).post(protect, authorize('admin'), createSkillCategory);

router
  .route('/:id')
  .get(getSkillCategory)
  .put(protect, authorize('admin'), updateSkillCategory)
  .delete(protect, authorize('admin'), deleteSkillCategory);

export default router;
