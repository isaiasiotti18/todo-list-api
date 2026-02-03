import type { TodoStatus } from "./TodoStatus";

export type FilterAndPagination = {
  page?: number;
  pageSize?: number;
  orderBy?: "desc" | "asc";
  filter: string | "";
};

export type FilterAndPaginationTodo = FilterAndPagination & {
  categoryId?: number;
  status?: TodoStatus;
};
