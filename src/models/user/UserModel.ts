import { users } from "../../db/schema";
import type { CreateNewUserDTO } from "../../dtos/users/CreateNewUser.dto";
import { db } from "../../db";
import { eq, like, or, sql } from "drizzle-orm";
import type { UpdateUserDTO } from "../../dtos/users/UpdateUser.dto";
import type { FilterAndPagination } from "../../types/FilterAndPagination";

export class UserModel {
  async createNewUser(data: CreateNewUserDTO) {
    const result = await db.insert(users).values(data);

    return result;
  }

  async updateUser(userId: number, data: UpdateUserDTO) {
    const result = await db
      .update(users)
      .set({ ...data })
      .where(eq(users.id, userId));

    return result;
  }

  async softDeleteUser(id: number) {
    const result = await db
      .update(users)
      .set({ deletedAt: new Date() })
      .where(eq(users.id, id));

    return result;
  }

  async getAllUsers({ page, pageSize, orderBy, filter }: FilterAndPagination) {
    if (!page) page = 1;
    if (!pageSize) pageSize = 10;

    const query = db
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
      .orderBy((users) =>
        orderBy === "desc"
          ? sql`${users.createdAt} desc`
          : sql`${users.createdAt} asc`,
      )
      .limit(pageSize ?? 10)
      .offset((page - 1) * pageSize);

    // Só aplica o filtro se ele existir
    if (filter && filter.trim()) {
      query.where(
        or(
          like(users.name, `%${filter}%`),
          like(users.email, `%${filter}%`),
          like(users.username, `%${filter}%`),
        ),
      );
    }

    return await query;
  }

  async getUserById(id: number) {
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        password: users.password,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        deletedAt: users.deletedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user[0];
  }

  async getUserByEmail(email: string) {
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        password: users.password,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        deletedAt: users.deletedAt,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user[0];
  }
}
