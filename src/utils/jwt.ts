import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { UnauthorizedError } from "../errors/unauthorizedError";

const secret = process.env.JWT_SECRET || "default_secret";

interface IPayload {
  userId: number;
  email: string;
}

export const genToken = (payload: IPayload) => {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secret) as IPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedError();
    }

    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError();
    }

    throw new UnauthorizedError();
  }
};
