import express from "express";
import {
  createSkill,
  getAllSkills,
  getSkillById,
  deleteSkill,
  userSkills,
} from "../controllers/skillController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Route to create a skill (requires authentication and file upload)
router.post("/", authMiddleware, upload.single("image"), createSkill);

// Route to get all skills
router.get("/", getAllSkills);

// Route to get a skill by ID
router.get("/:id", getSkillById);
router.get("/user/:id", userSkills);

// Route to delete a skill by ID (requires authentication)
router.delete("/:id", authMiddleware, deleteSkill);

export default router;
