import jwt from "jsonwebtoken";

const secret = process.env.SIGN_HASH;

interface IPayload {}

export const jwtVerifySign = (token: string): IPayload | null => {
  try {
    if (!token) return null;
    const data = jwt.verify(token, secret as string) as IPayload;
    return data;
  } catch {
    return null;
  }
};
