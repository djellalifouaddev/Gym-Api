import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Forbidden: SUPER_ADMIN role required" });
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden: ADMIN role required" });
  }
  next();
};
export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (user?.role !== "USER") {
    return res.status(403).json({ message: "Forbidden: USER role required" });
  }
  next();
};
