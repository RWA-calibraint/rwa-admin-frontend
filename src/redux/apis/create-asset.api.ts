import { baseApi } from '@redux/apis';
import { API_METHODS, END_POINTS } from '@redux/utils/constants';

export const createAssetApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createAsset: builder.mutation({
      query: (data) => ({
        url: END_POINTS.createAsset,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    uploadDocument: builder.mutation({
      query: (data) => ({
        url: END_POINTS.uploadDocuments,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
  }),
});

export const { useCreateAssetMutation, useUploadDocumentMutation } = createAssetApi;
