import {
  GetUserListParams,
  UpdateUserAsBlockOrActiveApiResponse,
  UpdateUserAsBlockOrActiveParams,
  UpdateUserAsSuspend,
  UserApiResponse,
} from '../interfaces/user-management.interface';
import { API_METHODS, END_POINTS } from '../utils/constants';

import { baseApi } from '.';

export const userManagementApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUserList: builder.query<UserApiResponse, GetUserListParams>({
      query: ({ status = '', search = '', page = 1, size = 10 }) => {
        const baseUrl = END_POINTS.getUserList(page, size, search);

        return { url: status.trim() ? `${baseUrl}&status=${status}` : baseUrl };
      },
    }),
    updateUserAsBlockOrActive: builder.query<UpdateUserAsBlockOrActiveApiResponse, UpdateUserAsBlockOrActiveParams>({
      query: ({ userId, bodyData }) => ({
        url: END_POINTS.updateUserAsBlockedOrActive(userId),
        method: API_METHODS.PATCH,
        body: bodyData,
      }),
    }),
    updateUserAsSuspend: builder.query<UpdateUserAsBlockOrActiveApiResponse, UpdateUserAsSuspend>({
      query: ({ userId, bodyData }) => ({
        url: END_POINTS.updateUserAsSuspend(userId),
        method: API_METHODS.PATCH,
        body: bodyData,
      }),
    }),
    getUser: builder.query({
      query: (id) => ({
        url: END_POINTS.getUser(id),
        method: API_METHODS.GET,
      }),
    }),
    sendUserFeedback: builder.mutation({
      query: ({ userId, feedback }) => ({
        url: END_POINTS.sendUserFeedback,
        method: API_METHODS.PATCH,
        body: { userId, feedback },
      }),
    }),
  }),
});

export const {
  useGetUserListQuery,
  useLazyUpdateUserAsSuspendQuery,
  useLazyUpdateUserAsBlockOrActiveQuery,
  useGetUserQuery,
  useSendUserFeedbackMutation,
} = userManagementApi;
