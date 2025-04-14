import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenDecode.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }

    // Get user role from database
    const user = await userModel.findById(tokenDecode.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.userId = tokenDecode.id;
    req.userRole = user.role; // Add role to request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Unauthorized: " + error.message,
    });
  }
};

export default userAuth;
