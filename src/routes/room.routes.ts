import express from "express";
import * as roomController from "../controllers/room.controller";
import { authenticate, requireSuperAdmin } from "../middleware/auth";

const router = express.Router();

router.use(authenticate, requireSuperAdmin);

router.post("/", roomController.createRoom);
router.get("/", roomController.getAllRooms);
router.put("/:id", roomController.updateRoom);
router.delete("/:id", roomController.deleteRoom);
router.post("/:id/approve", roomController.approveRoom);

export default router;
