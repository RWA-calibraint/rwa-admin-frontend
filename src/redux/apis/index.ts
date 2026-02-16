import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

import { ENV_CONFIGS } from '@helpers/configs/env-config';
import { ERROR_MESSAGE } from '@helpers/constants/error-mesage';
import { showErrorToast } from '@helpers/constants/toast.notification';

const baseQuery = fetchBaseQuery({
  baseUrl: ENV_CONFIGS.API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = Cookies.get('token');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // if (!(body instanceof FormData)) {
    //   headers.set('Content-Type', 'application/json');
    // }
    return headers;
  },
});

const baseQueryWithAuth: typeof baseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    Cookies.remove('token');
    showErrorToast(new Error(ERROR_MESSAGE.SESSION_EXPIRED));
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithAuth,
  endpoints: () => ({}),
});
