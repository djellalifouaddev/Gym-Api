import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["SUPER_ADMIN", "ADMIN", "USER"], required: true },
  active: { type: Boolean, default: true },
  score: { type: Number, default: 0 },
});

export default mongoose.model("User", userSchema);
