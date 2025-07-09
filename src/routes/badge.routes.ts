import express from "express";
import Badge from "../models/badge.model";
import { authenticate, requireSuperAdmin } from "../middleware/auth";

const router = express.Router();

router.use(authenticate, requireSuperAdmin);

router.post("/", async (req, res) => {
  const badge = new Badge(req.body);
  await badge.save();
  res.status(201).json(badge);
});

router.get("/", async (_req, res) => {
  const badges = await Badge.find();
  res.json(badges);
});

router.put("/:id", async (req, res) => {
  const badge = await Badge.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(badge);
});

router.delete("/:id", async (req, res) => {
  await Badge.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
