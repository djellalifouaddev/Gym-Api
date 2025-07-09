import express from "express";
import User from "../models/user.model";
import { authenticate, requireSuperAdmin } from "../middleware/auth";

const router = express.Router();

router.use(authenticate, requireSuperAdmin);

// Liste des utilisateurs
router.get("/", async (_req, res) => {
  const users = await User.find({}, "-password"); // ne pas renvoyer le mot de passe
  res.json(users);
});

// Désactiver un utilisateur
router.patch("/:id/deactivate", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { active: false }, { new: true, select: "-password" });
  res.json(user);
});

// Activer un utilisateur
router.patch("/:id/activate", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { active: true }, { new: true, select: "-password" });
  res.json(user);
});

// Supprimer un utilisateur
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
