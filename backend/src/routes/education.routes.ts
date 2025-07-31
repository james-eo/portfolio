import express from "express";
import {
  getEducation,
  getSingleEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/education.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = express.Router();

router
  .route("/")
  .get(getEducation)
  .post(protect, authorize("admin"), createEducation);

router
  .route("/:id")
  .get(getSingleEducation)
  .put(protect, authorize("admin"), updateEducation)
  .delete(protect, authorize("admin"), deleteEducation);

export default router;
