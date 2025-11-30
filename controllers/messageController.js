import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import openai from "../configs/openai.js";
import { toFile } from "@imagekit/nodejs";


//Controller based on text AI CHAT
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this features",
      });
    }
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
    };
    res.json({ success: true, reply });

    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Controller based on image AI CHAT
export const imageMessageController = async (req, res) => {
  try {

    const userId = req.user._id;

    // Check user credits
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    // Find chat
    const chat = await Chat.findOne({ userId, _id: chatId });

    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    // Add user message to chat
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // Encode prompt for URL
    const encodedPrompt = encodeURIComponent(prompt);

    // Construct ImageKit AI generation URL
    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w800,h-800`;

    // Fetch AI image from ImageKit
    const aiImageResponse = await axios.get(generatedImageUrl, { responseType: "arraybuffer" });

    // Convert image buffer to ImageKit file object
    const fileForUpload = await toFile(Buffer.from(aiImageResponse.data), `${Date.now()}.png`);

    // Upload to ImageKit
    const uploadResponse = await imagekit.files.upload({
      file: fileForUpload,
      fileName: `${Date.now()}.png`,
      folder: "quickgpt",
    });

    // Prepare assistant reply
    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    // Save reply in chat and send response
    chat.messages.push(reply);
    await chat.save();

    res.json({ success: true, reply });

    // Deduct user credits
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
