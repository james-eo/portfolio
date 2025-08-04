import express from "express";
import {
  getContactMessages,
  getContactMessageById,
  createContactMessage,
  markAsRead,
  deleteContactMessage,
} from "../controllers/contact.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("admin"), getContactMessages)
  .post(createContactMessage);

router
  .route("/:id")
  .get(protect, authorize("admin"), getContactMessageById)
  .delete(protect, authorize("admin"), deleteContactMessage);

router.route("/:id/read").put(protect, authorize("admin"), markAsRead);

export default router;
