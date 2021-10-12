export interface Response<T> {
  statusCode: number;
  status: number;
  message: string;
  data: T;
}
