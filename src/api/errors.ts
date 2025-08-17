import type { Request, Response, NextFunction } from "express";

import { respondWithJSON, respondWithError } from "./json.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Uh oh, spaghetti-o");
  res.status(500).json({
    error: "Something went wrong on our end",
  });
}
