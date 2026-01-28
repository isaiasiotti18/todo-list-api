import type { UserResponseWithoutPassword } from "../../types/UserResponseWithoutPassword";

declare global {
  namespace Express {
    interface Request {
      user?: UserResponseWithoutPassword;
    }
  }
}
