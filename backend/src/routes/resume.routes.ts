import express from "express"
import { generateResume } from "../controllers/resume.controller"

const router = express.Router()

router.route("/:template").get(generateResume)

export default router
