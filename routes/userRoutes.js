import express from "express";
import {
  forgotPassword,
  getPublishedImages,
  getUser,
  loginUser,
  registerUser,
  resetPassword,
  verifyUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.get("/verify/:token", verifyUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.get("/data", protect, getUser);
userRouter.get("/published-images",  getPublishedImages);

export default userRouter;
