import { API_METHODS, END_POINTS } from '../utils/constants';

import { baseApi } from '.';

export const adminApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAdminProfile: builder.query({
      query: () => ({
        url: END_POINTS.getAdminProfile,
        method: API_METHODS.GET,
      }),
    }),
    updateAdminProfile: builder.mutation({
      query: ({ adminProfile, updateType }) => ({
        url: END_POINTS.updateAdminProfile,
        method: API_METHODS.PUT,
        body: {
          adminProfile,
          updateType,
        },
      }),
    }),
    getAllAdmins: builder.query({
      query: ({ page = 1, size = 10, searchValue = '' }) => ({
        url: END_POINTS.getAllAdmins(page, size, searchValue),
        method: API_METHODS.GET,
      }),
    }),
    deleteAdmin: builder.mutation({
      query: (_id) => ({
        url: END_POINTS.deleteAdmin(_id),
        method: API_METHODS.DELETE,
      }),
    }),
  }),
});

export const { useGetAdminProfileQuery, useUpdateAdminProfileMutation, useGetAllAdminsQuery, useDeleteAdminMutation } =
  adminApi;
