import { categories, todos } from "../../db/schema";
import { db } from "../../db";
import type { CreateNewTodoDTO } from "../../dtos/todo/CreateNewTodo.dto";
import { and, asc, desc, eq, isNull, like, or, SQL, sql } from "drizzle-orm";
import type { UpdateTodoDTO } from "../../dtos/todo/UpdateTodo.dto";
import type { FilterAndPaginationTodo } from "../../types/FilterAndPagination";
import {
  buildPaginationResult,
  validatePagination,
} from "../../utils/helpers/pagination.helper";
import { buildOrderBy } from "./helpers/sorting.helper";
import { buildAllConditions } from "./helpers/filter.helper";
import type { PaginatedTodosResponse } from "../../types/PaginatedTodosResponse ";

export class TodoModel {
  async createNewTodo(data: CreateNewTodoDTO) {
    const result = await db.insert(todos).values(data);

    return result;
  }

  async updateTodoById(id: number, data: UpdateTodoDTO) {
    const conditions = [
      eq(todos.id, id),
      isNull(todos.deletedAt),
      eq(todos.userId, data.userId),
    ];

    await db
      .update(todos)
      .set({
        title: data.title,
        description: data.description,
        endDate: data.endDate,
      })
      .where(and(...conditions));

    return;
  }

  async getTodoById(id: number) {
    return await db.select().from(todos).where(eq(todos.id, id));
  }

  async getAllTodosByUserId(
    userId: number,
    {
      page = 1,
      pageSize = 10,
      orderBy = "asc",
      filter = "",
      categoryId,
      status,
    }: FilterAndPaginationTodo,
  ): Promise<PaginatedTodosResponse> {
    // Validação e paginação
    const {
      page: validPage,
      pageSize: validPageSize,
      offset,
    } = validatePagination(page, pageSize);

    // Construir condições de filtro
    const whereConditions = buildAllConditions(todos, categories, {
      userId,
      categoryId,
      status,
      searchTerm: filter,
    });

    // Construir ordenação
    const orderByClause = buildOrderBy(todos.createdAt, orderBy);

    // Executar queries em paralelo
    const [allTodos, countResult] = await Promise.all([
      db
        .select({
          id: todos.id,
          title: todos.title,
          description: todos.description,
          status: todos.status,
          endDate: todos.endDate,
          categoryId: todos.categoryId,
          categoryName: categories.name,
          createdAt: todos.createdAt,
          updatedAt: todos.updatedAt,
        })
        .from(todos)
        .leftJoin(categories, eq(todos.categoryId, categories.id))
        .where(whereConditions)
        .orderBy(orderByClause)
        .limit(validPageSize)
        .offset(offset),

      db
        .select({ count: sql<number>`count(*)` })
        .from(todos)
        .leftJoin(categories, eq(todos.categoryId, categories.id))
        .where(whereConditions),
    ]);

    // Construir resultado com paginação
    const total = Number(countResult[0]?.count ?? 0);
    const pagination = buildPaginationResult(validPage, validPageSize, total);

    return {
      data: allTodos,
      pagination,
    };
  }

  async softDeleteTodoById(id: number) {
    const result = await db
      .update(todos)
      .set({ deletedAt: new Date() })
      .where(eq(todos.id, id));

    return result;
  }
}
