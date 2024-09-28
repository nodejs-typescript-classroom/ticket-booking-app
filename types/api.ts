export type ApiResponse<T> = {
  message: string;
  error?: string;
  data: T;
  statusCode?: number;
}