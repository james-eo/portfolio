import express from "express"
import { getAbout, createAbout, updateAbout, deleteAbout } from "../controllers/about.controller"
import { protect, authorize } from "../middleware/auth.middleware"

const router = express.Router()

router
  .route("/")
  .get(getAbout)
  .post(protect, authorize("admin"), createAbout)
  .put(protect, authorize("admin"), updateAbout)
  .delete(protect, authorize("admin"), deleteAbout)

export default router
