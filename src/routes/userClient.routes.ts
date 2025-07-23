import express from "express";
import Challenge from "../models/challenge.model";
import Workout from "../models/workout.model";
import Badge from "../models/badge.model";
import { authenticate, requireUser } from "../middleware/auth";

const router = express.Router();

router.use(authenticate, requireUser);

// Créer un défi
router.post("/challenges", async (req, res) => {
  const userId = (req as any).user.id;
  console.log("Creating challenge for user:", userId);
  const challenge = new Challenge({
    ...req.body,
    createdBy: userId
  });
  await challenge.save();
  res.status(201).json(challenge);
});

// Explorer les défis
router.get("/challenges", async (req, res) => {
  const filters: any = {};
  if (req.query.difficulty) filters.difficulty = req.query.difficulty;
  if (req.query.type) filters.type = req.query.type;
  if (req.query.duration) filters.duration = req.query.duration;

  const challenges = await Challenge.find(filters);
  res.json(challenges);
});

// Suivre un entraînement
router.post("/workouts", async (req, res) => {
  const userId = (req as any).user.id;
  const workout = new Workout({
    ...req.body,
    user: userId
  });
  await workout.save();
  res.status(201).json(workout);
});
// Voir ses entraînements
router.get("/workouts", async (req, res) => {
  const userId = (req as any).user.id;
  const workouts = await Workout.find({ user: userId });
  res.json(workouts);
});
// Classement des utilisateurs
router.get("/leaderboard", async (_req, res) => {
  const leaderboard = await Workout.aggregate([
    { $match: { completed: true } },
    { $group: { _id: "$user", completedCount: { $sum: 1 } } },
    { $sort: { completedCount: -1 } }
  ]);
  res.json(leaderboard);
});
// Voir ses badges
router.get("/badges", async (req, res) => {
  const userId = (req as any).user.id;
  const badges = await Badge.find({ assignedTo: userId });
  res.json(badges);
});
router.post("/challenges/:challengeId/invite", async (req, res) => {
  const { friendId } = req.body;
  const challengeId = req.params.challengeId;
  const challenge = await Challenge.findByIdAndUpdate(
    challengeId,
    { $addToSet: { pendingInvitations: friendId } },
    { new: true }
  );
  if (!challenge) return res.status(404).json({ message: "Challenge not found" });
  res.json({ message: "Invitation envoyée, en attente d'acceptation", challenge });
});
router.post("/challenges/:challengeId/accept", async (req, res) => {
  const userId = (req as any).user.id;
  const challengeId = req.params.challengeId;
  const challenge = await Challenge.findOne({
    _id: challengeId,
    pendingInvitations: userId
  });
  if (!challenge) return res.status(404).json({ message: "Invitation non trouvée" });
  challenge.participants.push(userId);
  challenge.pendingInvitations = challenge.pendingInvitations.filter(
    (id: any) => id.toString() !== userId
  );
  await challenge.save();
  res.json({ message: "Invitation acceptée, tu participes au défi", challenge });
});
router.post("/challenges/:challengeId/complete/:badgeId", async (req, res) => {
  const userId = (req as any).user.id;
  const challengeId = req.params.challengeId;
  const badgeId = req.params.badgeId;

  // Vérifie que le badge existe
  const badgeTemplate = await Badge.findById(badgeId);
  if (!badgeTemplate) return res.status(404).json({ message: "Badge not found" });

  // Attribue le badge à l'utilisateur (crée une nouvelle instance si besoin)
  const badge = new Badge({
    name: badgeTemplate.name,
    description: badgeTemplate.description,
    assignedTo: userId
  });
  await badge.save();
  res.json({ message: "Défi complété et badge attribué", badge });
});
export default router;
