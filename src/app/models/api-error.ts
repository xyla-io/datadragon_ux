export interface ApiError {
  message: string;
}

export function isApiError(object: any): object is ApiError {
  return object.message !== undefined && typeof object.message === 'string';
}
