// helpers/filter.helper.ts
import { SQL, like, or, eq, isNull, and } from "drizzle-orm";

export interface FilterConditions {
  userId: number;
  categoryId?: number | null;
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
  addSearchFilter(conditions, todosTable, categoriesTable, filters.searchTerm);

  return and(...conditions)!;
}
