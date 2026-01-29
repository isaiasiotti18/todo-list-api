// helpers/sorting.helper.ts
import { asc, desc, SQL, type AnyColumn } from "drizzle-orm";

export type SortOrder = "asc" | "desc";

export function buildOrderBy<T extends AnyColumn>(
  column: T,
  order: SortOrder = "asc",
): SQL {
  return order === "desc" ? desc(column) : asc(column);
}
