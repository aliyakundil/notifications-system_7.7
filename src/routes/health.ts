import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString()  });
});

export default router; 