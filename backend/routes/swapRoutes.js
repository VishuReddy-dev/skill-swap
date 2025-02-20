import express from "express";
import {
  createSwapRequest,
  acceptSwapRequest,
  declineSwapRequest,
} from "../controllers/swapController.js";

const router = express.Router();

router.post("/request", createSwapRequest); // Create a new swap request
// Route for accepting a swap request
router.put("/accept", acceptSwapRequest);

// Route for declining a swap request
router.put("/decline", declineSwapRequest); // Approve or decline a request

export default router;
