import mongoose from "mongoose";

const VerificationTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

export default mongoose.model("VerificationToken", VerificationTokenSchema);
