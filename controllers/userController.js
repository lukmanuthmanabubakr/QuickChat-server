import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Chat from "../models/Chat.js";
import VerificationToken from "../models/VerificationToken.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import { transporter } from "../configs/nodemailer.js";
import { 
  verificationEmailTemplate, 
  resetPasswordEmailTemplate 
} from "../utils/emailTemplates.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// API to register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields" 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        success: false,
        message: "Password must be at least 8 characters" 
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
      });
    }

    // Don't manually hash - let the pre("save") hook handle it
    const newUser = await User.create({
      name,
      email,
      password: password,  // Plain password - will be hashed by pre("save") hook
      isVerified: false,
    });

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");

    await VerificationToken.create({
      userId: newUser._id,
      token,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    });

    // Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "Verify Your Email - QuickGPT",
      html: verificationEmailTemplate(newUser.name, token),
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// API to resend verification email
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: "Email is required" 
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "No user found with this email address" 
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ 
        success: false,
        message: "This account is already verified" 
      });
    }

    // Delete old verification tokens for this user
    await VerificationToken.deleteMany({ userId: user._id });

    // Generate new verification token
    const token = crypto.randomBytes(32).toString("hex");

    await VerificationToken.create({
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    });

    // Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verify Your Email - QuickGPT",
      html: verificationEmailTemplate(user.name, token),
    });

    return res.status(200).json({ 
      success: true,
      message: "Verification email has been resent. Please check your inbox." 
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// API to verify user email
export const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ 
        success: false,
        message: "Verification token is required" 
      });
    }

    const tokenDoc = await VerificationToken.findOne({ token });
    
    if (!tokenDoc) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or expired verification token" 
      });
    }

    if (tokenDoc.expiresAt < Date.now()) {
      await tokenDoc.deleteOne();
      return res.status(400).json({ 
        success: false,
        message: "Verification token has expired. Please request a new one." 
      });
    }

    // Update user as verified
    const user = await User.findByIdAndUpdate(
      tokenDoc.userId,
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    await tokenDoc.deleteOne();

    // Generate JWT token for auto-login
    const authToken = generateToken(user._id);
    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You are now logged in.",
      token: authToken,
      user,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// API to request password reset
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: "Email is required" 
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "No user found with this email address" 
      });
    }

    // Delete old tokens for this user
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Generate new reset token
    const token = crypto.randomBytes(32).toString("hex");

    await PasswordResetToken.create({
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    });

    // Send password reset email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Your Password - QuickGPT",
      html: resetPasswordEmailTemplate(user.name, token),
    });

    return res.status(200).json({ 
      success: true,
      message: "Password reset link has been sent to your email" 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// API to reset password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ 
        success: false,
        message: "Reset token is required" 
      });
    }

    if (!password) {
      return res.status(400).json({ 
        success: false,
        message: "Password is required" 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        success: false,
        message: "Password must be at least 8 characters" 
      });
    }

    const tokenDoc = await PasswordResetToken.findOne({ token });

    if (!tokenDoc) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or expired reset token" 
      });
    }

    if (tokenDoc.expiresAt < Date.now()) {
      await tokenDoc.deleteOne();
      return res.status(400).json({ 
        success: false,
        message: "Reset token has expired. Please request a new one." 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      tokenDoc.userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    await tokenDoc.deleteOne();

    return res.status(200).json({ 
      success: true,
      message: "Password reset successfully. You can now login with your new password." 
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// API to login user
export const loginUser = async (req, res) => {
  try {
    console.log("=== LOGIN REQUEST RECEIVED ===");
    const { email, password } = req.body;
    console.log("1. Email:", email);
    console.log("2. Password provided:", !!password);

    if (!email || !password) {
      console.log("3. Missing email or password");
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    console.log("4. Searching for user in database...");
    const user = await User.findOne({ email });
    console.log("5. User found:", !!user);

    if (!user) {
      console.log("6. User not found");
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    console.log("7. User found - ID:", user._id);
    console.log("8. User verified status:", user.isVerified);
    console.log("9. Checking password...");
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("10. Password match:", isMatch);

    if (!isMatch) {
      console.log("11. Password does not match");
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    if (!user.isVerified) {
      console.log("11. User is not verified");
      return res.status(403).json({ 
        success: false,
        message: "Please verify your email before logging in",
        isVerified: false,
        email: user.email
      });
    }

    console.log("12. Generating token...");
    const token = generateToken(user._id);
    console.log("13. Token generated successfully");

    console.log("=== LOGIN SUCCESSFUL ===");
    return res.status(200).json({ 
      success: true,
      message: "Login successful",
      token 
    });
  } catch (error) {
    console.log("=== LOGIN ERROR ===");
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API to get user data
export const getUser = async (req, res) => {
  try {
    console.log("=== GET USER REQUEST ===");
    console.log("1. req.user exists:", !!req.user);
    
    const user = req.user;
    
    if (!user) {
      console.log("2. User not found in request");
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    console.log("2. User ID:", user._id);
    console.log("3. User email:", user.email);
    console.log("4. User verified:", user.isVerified);
    console.log("=== GET USER SUCCESSFUL ===");

    return res.status(200).json({ 
      success: true, 
      user 
    });
  } catch (error) {
    console.log("=== GET USER ERROR ===");
    console.error("Get user error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API to get published Images
export const getPublishedImages = async (req, res) => {
  try {
    const publishedImageMessages = await Chat.aggregate([
      {
        $unwind: "$messages",
      },
      {
        $match: {
          "messages.isImage": true,
          "messages.isPublished": true,
        },
      },
      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          userName: "$userName",
        },
      },
    ]);

    return res.status(200).json({ 
      success: true, 
      images: publishedImageMessages.reverse() 
    });
  } catch (error) {
    console.error("Get published images error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};