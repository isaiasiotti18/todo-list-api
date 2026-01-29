export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationResult {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function validatePagination(
  page: number = 1,
  pageSize: number = 10,
  maxPageSize: number = 100,
) {
  const validPage = Math.max(1, page);
  const validPageSize = Math.min(Math.max(1, pageSize), maxPageSize);
  const offset = (validPage - 1) * validPageSize;

  return {
    page: validPage,
    pageSize: validPageSize,
    offset,
  };
}

export function buildPaginationResult(
  validPage: number,
  validPageSize: number,
  total: number,
): PaginationResult {
  const totalPages = Math.ceil(total / validPageSize);

  return {
    page: validPage,
    pageSize: validPageSize,
    total,
    totalPages,
    hasNextPage: validPage < totalPages,
    hasPreviousPage: validPage > 1,
  };
}
