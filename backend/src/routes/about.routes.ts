import express from "express"
import { getAbout, updateAbout } from "../controllers/about.controller"
import { protect, authorize } from "../middleware/auth.middleware"

const router = express.Router()

router.route("/").get(getAbout).post(protect, authorize("admin"), updateAbout)

export default router
