import express from "express";
import protectRoute from "../middleware/protectRoute.middleware.js";
import uploadMiddleware from "../middleware/multer.middleware.js";
import {
  getRecentUsers,
  getUsers,
  getUserById,
  toggleFollowUser,
  updateProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/recent", protectRoute, getRecentUsers);
router.get("/", protectRoute, getUsers);
router.get("/:id", protectRoute, getUserById);
router.put("/:userId/toggle-follow", protectRoute, toggleFollowUser);
router.put("/update-profile", uploadMiddleware, protectRoute, updateProfile);

export default router;
