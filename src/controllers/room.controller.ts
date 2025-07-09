import { Request, Response } from "express";
import Room from "../models/room.model";

export const createRoom = async (req: Request, res: Response) => {
  const room = new Room(req.body);
  await room.save();
  res.status(201).json(room);
};

export const getAllRooms = async (_req: Request, res: Response) => {
  const rooms = await Room.find();
  res.json(rooms);
};

export const updateRoom = async (req: Request, res: Response) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(room);
};

export const deleteRoom = async (req: Request, res: Response) => {
  await Room.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

export const approveRoom = async (req: Request, res: Response) => {
  const room = await Room.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
  res.json(room);
};