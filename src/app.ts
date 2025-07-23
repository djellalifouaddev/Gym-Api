import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import roomRoutes from "./routes/room.routes";
import badgeRoutes from "./routes/badge.routes";
import exerciseTypeRoutes from "./routes/exerciseType.routes";
import adminRoutes from "./routes/admin.routes";
import userClientRoutes from "./routes/userClient.routes";
import userRoutes from "./routes/user.routes";
import { createUsers } from "./services/createUsers";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/badges", badgeRoutes);
app.use("/exercise-types", exerciseTypeRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userClientRoutes);
app.use("/users", userRoutes);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("MongoDB connected")
createUsers().catch(console.error);
  })
  .catch((err) => console.error("MongoDB connection error:", err));


export default app;