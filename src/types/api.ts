export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta?: {
    pagination: PaginationMeta;
  };
};
