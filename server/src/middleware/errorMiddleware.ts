// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/types/errors";
import { ApiMessages } from "../utils/types/apiMessages";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
    return;
  }

  // Fallback for unknown/unexpected errors
  const fallback = ApiMessages.INTERNAL_SERVER_ERROR;

  res.status(fallback.statusCode).json({
    success: false,
    code: fallback.code,
    message: fallback.message,
  });
};
