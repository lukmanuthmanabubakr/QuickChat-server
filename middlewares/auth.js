import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  console.log("=== AUTH MIDDLEWARE - PROTECT ===");
  let token = req.headers.authorization;
  console.log("1. Token from headers:", token);

  try {
    console.log("2. Verifying token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("3. Token decoded:", decoded);
    
    const userId = decoded.id;
    console.log("4. User ID from token:", userId);

    console.log("5. Fetching user from database...");
    const user = await User.findById(userId);
    console.log("6. User found:", !!user);

    if (!user) {
      console.log("7. User not found in database");
      return res.status(404).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }

    console.log("7. User found - ID:", user._id);
    console.log("8. User email:", user.email);
    console.log("9. Setting req.user");
    req.user = user;
    console.log("=== AUTH MIDDLEWARE - SUCCESS ===");
    next();
  } catch (error) {
    console.log("=== AUTH MIDDLEWARE - ERROR ===");
    console.error("Auth error:", error);
    console.log("Error name:", error.name);
    console.log("Error message:", error.message);
    return res.status(401).json({ 
      success: false,
      message: "Not authorized, token failed" 
    });
  }
};

export const checkVerification = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address to access this feature. Check your inbox for the verification link.",
        isVerified: false,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Combined middleware for routes that need both auth and verification
export const protectAndVerify = [protect, checkVerification];