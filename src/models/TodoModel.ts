import { categories, todos } from "../db/schema";
import { db } from "../db";
import type { CreateNewTodoDTO } from "../dtos/todo/CreateNewTodo.dto";
import { and, asc, desc, eq, isNull, like, or, SQL, sql } from "drizzle-orm";
import type { UpdateTodoDTO } from "../dtos/todo/UpdateTodo.dto";
import type {
  FilterAndPagination,
  FilterAndPaginationTodo,
} from "../types/FilterAndPagination";

export class TodoModel {
  async createNewTodo(data: CreateNewTodoDTO) {
    const result = await db.insert(todos).values(data);

    return result;
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

  async getAllTodosByUserId(
    userId: number,
    {
      page = 1,
      pageSize = 10,
      orderBy = "asc",
      filter = "",
      categoryId, // NOVO
    }: FilterAndPaginationTodo,
  ) {
    // Validação e sanitização de entrada
    const validPage = Math.max(1, page);
    const validPageSize = Math.min(Math.max(1, pageSize), 100);
    const offset = (validPage - 1) * validPageSize;

    // Construir condições de filtro base
    const conditions: SQL[] = [
      eq(todos.userId, userId),
      isNull(todos.deletedAt),
    ];

    // NOVO: Filtro por categoria específica
    if (categoryId !== undefined && categoryId !== null) {
      conditions.push(eq(todos.categoryId, categoryId));
    }

    // Aplicar filtro de busca geral se existir
    const trimmedFilter = filter.trim();
    if (trimmedFilter) {
      conditions.push(
        or(
          like(todos.title, `%${trimmedFilter}%`),
          like(todos.description, `%${trimmedFilter}%`),
          like(categories.name, `%${trimmedFilter}%`),
        )!,
      );
    }

    // Construir ordenação
    const orderByClause =
      orderBy === "desc" ? desc(todos.createdAt) : asc(todos.createdAt);

    // Executar queries em paralelo para melhor performance
    const [allTodos, countResult] = await Promise.all([
      // Query principal
      db
        .select({
          id: todos.id,
          title: todos.title,
          description: todos.description,
          endDate: todos.endDate,
          categoryId: todos.categoryId,
          categoryName: categories.name,
          createdAt: todos.createdAt,
          updatedAt: todos.updatedAt,
        })
        .from(todos)
        .leftJoin(categories, eq(todos.categoryId, categories.id))
        .where(and(...conditions))
        .orderBy(orderByClause)
        .limit(validPageSize)
        .offset(offset),

      // Query de contagem
      db
        .select({ count: sql<number>`count(*)` })
        .from(todos)
        .leftJoin(categories, eq(todos.categoryId, categories.id))
        .where(and(...conditions)),
    ]);

    // Extrair o count do resultado
    const count = Number(countResult[0]?.count ?? 0);
    const totalPages = Math.ceil(count / validPageSize);

    return {
      data: allTodos,
      pagination: {
        page: validPage,
        pageSize: validPageSize,
        total: count,
        totalPages,
        hasNextPage: validPage < totalPages,
        hasPreviousPage: validPage > 1,
      },
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
