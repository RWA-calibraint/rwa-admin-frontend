import { ENV_CONFIGS } from './configs/env-config';
import { ApiResponse } from './interface';

export const apiClient = {
  post: async <T, U>(endpoint: string, payload: U): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${ENV_CONFIGS.API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data: T = await response.json();

      return { data };
    } catch (error) {
      return { data: {} as T, error: (error as Error).message };
    }
  },
};
