import mongoose from "mongoose";

const exerciseTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  musclesTargeted: [String]
});

export default mongoose.model("ExerciseType", exerciseTypeSchema);