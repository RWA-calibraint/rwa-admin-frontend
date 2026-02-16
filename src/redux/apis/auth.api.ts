import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

import { ENV_CONFIGS } from '@helpers/configs/env-config';

import { API_METHODS, END_POINTS } from '../utils/constants';

const baseQuery = fetchBaseQuery({
  baseUrl: ENV_CONFIGS.API_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');

    return headers;
  },
  responseHandler: async (response) => {
    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: END_POINTS.signup,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    signin: builder.mutation({
      query: (data) => ({
        url: END_POINTS.signin,
        method: API_METHODS.POST,
        body: data,
      }),
      async onQueryStarted(_args, { queryFulfilled }) {
        const { data } = await queryFulfilled;

        if (data?.accessToken) {
          Cookies.set('token', data.accessToken, {
            expires: 1,
            secure: true,
            sameSite: 'Strict',
          });
        }
      },
    }),
    confirmSignup: builder.mutation({
      query: (data) => ({
        url: END_POINTS.confirmSignup,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: END_POINTS.forgetPassword,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: END_POINTS.resetPassword,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: END_POINTS.verifyOtp,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useConfirmSignupMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} = authApi;
