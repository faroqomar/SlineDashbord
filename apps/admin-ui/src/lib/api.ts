import axios from 'axios';
import { type ServiceResult, failure } from '@sline/shared';

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'https://slineapi-production.up.railway.app';

const api = axios.create({
  baseURL: `${apiBaseUrl}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Type-safe wrapper for API calls.
 */
export async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: any
): Promise<ServiceResult<T>> {
  try {
    const response = await api({ method, url, data });
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data?.error;
    return failure(
      apiError?.code || 'FETCH_ERROR',
      apiError?.message || error.message,
      apiError?.details
    );
  }
}

export default api;