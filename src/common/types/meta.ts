interface Pagination {
  page?: number;
  per_page?: number;
}
interface Sorting<E> {
  sort_by?: keyof E | undefined;
  sort_order?: 'ASC' | 'DESC';
}
interface GlobalFilter {
  search?: string;
}

export interface MetaRequest<E> extends Pagination, Sorting<E>, GlobalFilter {}

export interface MetaResponse {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
}
