// src/middlewares/errorHandler.ts
import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../errors/appError";
import { z } from "zod";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      message: "Dados inválidos",
      errors: error.message,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode,
    });
  }

  console.error("Erro não tratado:", error);

  return res.status(500).json({
    message: "Erro interno do servidor",
  });
}
