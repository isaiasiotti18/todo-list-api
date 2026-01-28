import type { User } from "./User";

export type UserResponseWithoutPassword = Omit<
  User,
  "password" | "deletedAt"
> & {
  id: number;
  name: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};
