export type ApiResponse<T> = {
  success: boolean;
  message: string;
  payload: T;
};

export const buildApiResponse = <T>(success: boolean, message: string, payload: T): ApiResponse<T> => ({
  success,
  message,
  payload,
});
