import { todos } from "../db/schema";
import { db } from "../db";
import type { CreateNewTodoDTO } from "../dtos/CreateNewTodo.dto";
import { and, eq, isNull } from "drizzle-orm";
import type { UpdateTodoDTO } from "../dtos/UpdateTodo.dto";

export class TodoModel {
  async createNewTodo(data: CreateNewTodoDTO): Promise<void> {
    await db.insert(todos).values(data);
    return;
  }

  async updateTodoById(id: number, data: UpdateTodoDTO) {
    await db
      .update(todos)
      .set({
        title: data.title,
        description: data.description,
        endDate: data.endDate,
      })
      .where(and(eq(todos.id, id), isNull(todos.deletedAt)));

    return;
  }

  async getTodoById(id: number) {
    return await db.select().from(todos).where(eq(todos.id, id));
  }

  async getAllTodosByUserId(userId: number) {
    const allTodos = await db
      .select({
        id: todos.id,
        title: todos.title,
        description: todos.description,
        endDate: todos.endDate,
        createdAt: todos.createdAt,
        updatedAt: todos.updatedAt,
        deletedAt: todos.deletedAt,
      })
      .from(todos)
      .where(eq(todos.userId, userId));

    return allTodos;
  }

  async softDeleteTodoById(id: number) {}
}
