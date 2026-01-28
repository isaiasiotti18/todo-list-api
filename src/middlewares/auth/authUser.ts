import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../errors/unauthorizedError";
import { verifyToken } from "../../utils/jwt";
import { UserService } from "../../services/UserService";

export const makeUserService = () => {
  return new UserService();
};

const userService = makeUserService();

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;

  if (!authorization)
    throw new UnauthorizedError("Invalid Token / Token Not Found.");

  const token = authorization.split(" ")[1];

  const { userId } = verifyToken(token);

  if (!userId) throw new UnauthorizedError("Invalid Token / Token Not Found.");

  const user = await userService.getUserById(userId);

  if (!user) throw new UnauthorizedError("Invalid Token / Token Not Found.");

  req.user = user;

  return next();
};
