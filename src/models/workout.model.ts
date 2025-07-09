import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
  date: { type: Date, default: Date.now },
  durationMinutes: Number,
  caloriesBurned: Number,
  completed: { type: Boolean, default: false }
});

export default mongoose.model("Workout", workoutSchema);
