// helpers/filter.helper.ts
import { SQL, like, or, eq, isNull, and } from "drizzle-orm";
import type { TodoStatus } from "../../../types/TodoStatus";

export interface FilterConditions {
  userId: number;
  categoryId?: number | null;
  status?: TodoStatus;
  searchTerm?: string;
}

export function buildBaseConditions<T extends Record<string, any>>(
  table: T,
  userId: number,
): SQL[] {
  return [eq(table.userId, userId), isNull(table.deletedAt)];
}

export function addCategoryFilter<T extends Record<string, any>>(
  conditions: SQL[],
  table: T,
  categoryId?: number | null,
): void {
  if (categoryId !== undefined && categoryId !== null) {
    conditions.push(eq(table.categoryId, categoryId));
  }
}

export function statusCondition<T extends Record<string, any>>(
  conditions: SQL[],
  table: T,
  status?: TodoStatus,
): void {
  if (status !== undefined && status !== null) {
    conditions.push(eq(table.status, status));
  }
}

export function addSearchFilter<
  T extends Record<string, any>,
  C extends Record<string, any>,
>(
  conditions: SQL[],
  todosTable: T,
  categoriesTable: C,
  searchTerm?: string,
): void {
  const trimmed = searchTerm?.trim();

  if (trimmed) {
    conditions.push(
      or(
        like(todosTable.title, `%${trimmed}%`),
        like(todosTable.description, `%${trimmed}%`),
        like(categoriesTable.name, `%${trimmed}%`),
      )!,
    );
  }
}

export function buildAllConditions<
  T extends Record<string, any>,
  C extends Record<string, any>,
>(todosTable: T, categoriesTable: C, filters: FilterConditions): SQL {
  const conditions = buildBaseConditions(todosTable, filters.userId);

  addCategoryFilter(conditions, todosTable, filters.categoryId);
  statusCondition(conditions, todosTable, filters.status);
  addSearchFilter(conditions, todosTable, categoriesTable, filters.searchTerm);

  return and(...conditions)!;
}
