import express from "express";
import {
  registerUser,
  loginUser,
  getUserById,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/:id", authMiddleware, getUserById);

export default router;
