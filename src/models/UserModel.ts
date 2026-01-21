import { users } from "../db/schema";
import type { CreateNewUserDTO } from "../dtos/CreateNewUser.dto";
import { db } from "../db";
import { eq } from "drizzle-orm";

export class UserModel {
  async createNewUser(data: CreateNewUserDTO) {
    const result = await db.insert(users).values(data);

    return result;
  }

  async getUserById(id: number) {
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        deletedAt: users.deletedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user;
  }

  async getAllUsers() {
    const all = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        deletedAt: users.deletedAt,
      })
      .from(users);

    return all;
  }

  async softDeleteUserById(id: number) {
    const result = await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, id));

    return result;
  }
}
