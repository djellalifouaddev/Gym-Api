import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, default: 0 },
  pendingInvitations: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

});

export default mongoose.model("Challenge", challengeSchema);
