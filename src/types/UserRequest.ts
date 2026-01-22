import { type Request } from "express";
import { type User } from "./User";

export interface UserRequest extends Request {
  user?: User | User[];
}
