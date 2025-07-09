import express from "express";
import Room from "../models/room.model";
import Challenge from "../models/challenge.model";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = express.Router();

router.use(authenticate, requireAdmin);

// Voir les infos de sa propre salle
router.get("/room", async (req, res) => {
  const userId = (req as any).user.id;
  const room = await Room.findOne({ owner: userId });
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room);
});

// Mettre à jour sa propre salle
router.put("/room", async (req, res) => {
  const userId = (req as any).user.id;
  const room = await Room.findOneAndUpdate({ owner: userId }, req.body, { new: true });
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room);
});

// Proposer un défi pour sa salle
router.post("/challenges", async (req, res) => {
  const userId = (req as any).user.id;
  const room = await Room.findOne({ owner: userId });
  if (!room) return res.status(404).json({ message: "Room not found" });

  const challenge = new Challenge({
    ...req.body,
    room: room._id,
    createdBy: userId,
    score: req.body.score || 0
  });
  await challenge.save();
  res.status(201).json(challenge);
});

// Lister les défis proposés pour sa salle
router.get("/challenges", async (req, res) => {
  const userId = (req as any).user.id;
  const room = await Room.findOne({ owner: userId });
  if (!room) return res.status(404).json({ message: "Room not found" });

  const challenges = await Challenge.find({ room: room._id });
  res.json(challenges);
});

export default router;
