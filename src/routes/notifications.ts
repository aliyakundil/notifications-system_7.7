import path from "path";
import { Router } from "express";
import type { Request, Response } from "express";
import { authenticateToken } from "../middleware/httpAuth.js";
import Notification from "../models/Notification.js";
import fileDirName from "../utils/dirname.js";

const router = Router();

const { __dirname } = fileDirName(import.meta.url)

// Создать уведомление + отправить
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  const userId = (req.user as any).userId;
  const { type, title, body } = req.body;

  const notification = await Notification.create({
    userId,
    type,
    title,
    body,
  });

  // отправка в реальном времени
  req.app.get("io").to(`user:${userId}`).emit("notification:new", notification);

  res.json(notification);
});

// Получить список
router.get("/", authenticateToken, async(req: Request, res: Response) => {
  const userId = (req.user as any).userId;
  const { limit = 20, unreadOnly} = req.query;

  const filter: any = { userId };

  if (unreadOnly === "true") {
    filter.read = false;
  }

  const notification = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .limit(Number(limit));

    res.json(notification);
});

// Отметить как прочитание
router.patch("/:id/read", authenticateToken, async (req, res) => {
  const userId = (req.user as any).userId;
  const { id } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, userId },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json({ success: true });
});

export default router;