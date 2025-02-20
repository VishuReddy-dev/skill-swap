import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided. Authorization denied." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password"); // Fetch user without password

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user; // Attach user to request
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};
