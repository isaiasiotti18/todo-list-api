import type { TodoWithCategory } from "./TodoWithCategory";

export interface PaginatedTodosResponse {
  data: TodoWithCategory[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
