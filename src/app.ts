import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";


import authRoutes from "./routes/auth.routes";
import roomRoutes from "./routes/room.routes";
import badgeRoutes from "./routes/badge.routes";
import exerciseTypeRoutes from "./routes/exerciseType.routes";
import adminRoutes from "./routes/admin.routes";
import userClientRoutes from "./routes/userClient.routes";
import userRoutes from "./routes/user.routes";

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


const authSpec = YAML.load("./docs/auth.routes.openapi.yaml");
const roomsSpec = YAML.load("./docs/rooms.routes.openapi.yaml");
const badgesSpec = YAML.load("./docs/badges.routes.openapi.yaml");
const exerciseTypesSpec = YAML.load("./docs/exercise-types.routes.openapi.yaml");
const adminSpec = YAML.load("./docs/admin.routes.openapi.yaml");
const userSpec = YAML.load("./docs/user.routes.openapi.yaml");
const usersSpec = YAML.load("./docs/users.routes.openapi.yaml");

app.use("/api-docs/auth", swaggerUi.serve, swaggerUi.setup(authSpec));
app.use("/api-docs/rooms", swaggerUi.serve, swaggerUi.setup(roomsSpec));
app.use("/api-docs/badges", swaggerUi.serve, swaggerUi.setup(badgesSpec));
app.use("/api-docs/exercise-types", swaggerUi.serve, swaggerUi.setup(exerciseTypesSpec));
app.use("/api-docs/admin", swaggerUi.serve, swaggerUi.setup(adminSpec));
app.use("/api-docs/user", swaggerUi.serve, swaggerUi.setup(userSpec));
app.use("/api-docs/users", swaggerUi.serve, swaggerUi.setup(usersSpec));

import path from "path";
app.get("/api-docs/openapi.yaml", (_req, res) => {
  res.sendFile(path.join(__dirname, "../docs/openapi.yaml"));
});
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

export default app;