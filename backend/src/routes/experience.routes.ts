import express from "express"
import {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experience.controller"
import { protect, authorize } from "../middleware/auth.middleware"

const router = express.Router()

router.route("/").get(getExperiences).post(protect, authorize("admin"), createExperience)

router
  .route("/:id")
  .get(getExperience)
  .put(protect, authorize("admin"), updateExperience)
  .delete(protect, authorize("admin"), deleteExperience)

export default router
