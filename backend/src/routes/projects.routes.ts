import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '@/controllers/projects.controller';
import { protect, authorize } from '@/middleware/auth.middleware';

const router = express.Router();

router.route('/').get(getProjects).post(protect, authorize('admin'), createProject);

router
  .route('/:id')
  .get(getProjectById)
  .put(protect, authorize('admin'), updateProject)
  .delete(protect, authorize('admin'), deleteProject);

export default router;
