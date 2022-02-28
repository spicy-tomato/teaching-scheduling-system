export interface ResponseModel<T> {
  data: T;
}

export interface PaginationResponseModel<T> extends ResponseModel<T> {
  meta: {
    last_page: number;
  };
}
