// routes.js

import express from "express";
import protectRoute from "../middleware/protectRoute.middleware.js";
import {
  createPost,
  editPost,
  getPostById,
  deletePost,
  getRecentPosts,
  toggleLikePost,
  toggleSavePost,
  getSavedPosts,
  getUserPosts,
  getPosts,
  searchPost,
  getLikedPosts,
} from "../controllers/post.controller.js";
import uploadMiddleware from "../middleware/multer.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getPosts);
router.get("/liked-posts", protectRoute, getLikedPosts);
router.put("/:postId/toggle-save", protectRoute, toggleSavePost);
router.put("/:postId/toggle-like", protectRoute, toggleLikePost);
router.get("/search", protectRoute, searchPost);
router.get("/saved", protectRoute, getSavedPosts);
router.get("/recent", protectRoute, getRecentPosts);
router.post("/", uploadMiddleware, protectRoute, createPost);
router.get("/user/:userId", protectRoute, getUserPosts);
router.get("/:postId", protectRoute, getPostById);
router.put("/:postId", uploadMiddleware, protectRoute, editPost);
router.delete("/:postId", protectRoute, deletePost);

export default router;
