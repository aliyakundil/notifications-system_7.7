import type { Request, Response, NextFunction } from "express"

interface ApiError extends Error {
  status?: number;
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const status = err.status || 500;

  console.error("Error:", {
    message: err.message,
    status,
    stack: err.stack,
  });

  res.status(status).json({
    success: false,
    error: err.message,
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: "Not found!",
    message: `Route ${req.originalUrl} does not exist`,
  });
}