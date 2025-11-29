import express from "express";
import { createChat } from "../controllers/chatController";
import { protect } from "../middlewares/auth";

const chatRouter = express.Router();

chatRouter.get("/create", protect, createChat);
