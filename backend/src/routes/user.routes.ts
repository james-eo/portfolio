import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));
router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default router;
