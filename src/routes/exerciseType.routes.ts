import express from "express";
import ExerciseType from "../models/exerciseType.model";
import { authenticate, requireSuperAdmin } from "../middleware/auth";

const router = express.Router();

router.use(authenticate, requireSuperAdmin);

router.post("/", async (req, res) => {
  const et = new ExerciseType(req.body);
  await et.save();
  res.status(201).json(et);
});

router.get("/", async (_req, res) => {
  const ets = await ExerciseType.find();
  res.json(ets);
});

router.put("/:id", async (req, res) => {
  const et = await ExerciseType.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(et);
});

router.delete("/:id", async (req, res) => {
  await ExerciseType.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
