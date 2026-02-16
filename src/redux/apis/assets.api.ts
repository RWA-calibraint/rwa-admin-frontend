import {
  AnalyzeImageResponse,
  AssetResponse,
  AssetsResponse,
  categoryResponse,
  Image,
  UpdateAssetApiResponse,
  VerifyAsset,
} from '../interfaces/assets.interface';
import { NotificationsParams, NotificationsResponse } from '../interfaces/notifications.interface';
import { AssetListParams } from '../interfaces/user-management.interface';
import { API_METHODS, END_POINTS } from '../utils/constants';

import { baseApi } from '.';

// Interface for the token action request body
interface TokenAction {
  contractTokenId: string; // Changed from number to string
  amount: number;
  price: number;
}

// Interface for the token action response
interface TokenActionResponse {
  transactionUrl: string;
}

export const assetsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPendingAssets: builder.query<AssetsResponse, AssetListParams>({
      query: ({ search = '', category = '', status = '', page = 1, size = 10, startDate = '', endDate = '' }) =>
        END_POINTS.getPendingAssets(search, category, status, page, size, startDate, endDate),
    }),
    getApprovedAssets: builder.query<AssetsResponse, AssetListParams>({
      query: ({ search = '', category = '', status = '', page = 1, size = 10, startDate = '', endDate = '' }) =>
        END_POINTS.getApprovedAssets(search, category, status, page, size, startDate, endDate),
    }),
    getRejectedAssets: builder.query<AssetsResponse, AssetListParams>({
      query: ({ search = '', category = '', status = '', page = 1, size = 10, startDate = '', endDate = '' }) =>
        END_POINTS.getRejectedAssets(search, category, status, page, size, startDate, endDate),
    }),
    getAssetCategories: builder.query<categoryResponse, void>({
      query: () => END_POINTS.getCategoryList,
    }),
    getAssetDetail: builder.query<AssetResponse, string>({
      query: (assetId) => ({
        url: END_POINTS.getAssetDetail(assetId),
        method: API_METHODS.GET,
      }),
    }),
    getIsFeaturedAsset: builder.query({
      query: () => ({
        url: END_POINTS.checkFeatured,
        method: API_METHODS.GET,
      }),
    }),
    verifyAsset: builder.mutation<UpdateAssetApiResponse, VerifyAsset>({
      query: ({ bodyData }) => ({
        url: END_POINTS.verifyAsset,
        method: API_METHODS.PATCH,
        body: bodyData,
      }),
    }),
    verifyDocument: builder.mutation({
      query: (data) => ({
        url: END_POINTS.verifyDocument,
        method: API_METHODS.PATCH,
        body: data,
      }),
    }),
    deleteAsset: builder.mutation({
      query: (assetId) => ({
        url: END_POINTS.deleteAsset(assetId),
        method: API_METHODS.DELETE,
      }),
    }),
    updateTokens: builder.mutation({
      query: (data) => ({
        url: END_POINTS.updateTokens,
        method: API_METHODS.PATCH,
        body: data,
      }),
    }),
    createAsset: builder.mutation({
      query: (data) => ({
        url: END_POINTS.createAsset,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    editAsset: builder.mutation({
      query: ({ assetId, data }) => ({
        url: END_POINTS.editAsset(assetId),
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    analyseImage: builder.mutation<AnalyzeImageResponse, Image>({
      query: ({ data }) => ({
        url: END_POINTS.analyseImage,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    getAllNotifications: builder.query<NotificationsResponse, void>({
      query: () => ({
        url: END_POINTS.getNotifications,
        method: API_METHODS.GET,
      }),
    }),
    readSingleNotification: builder.mutation<NotificationsResponse, NotificationsParams>({
      query: (id) => ({
        url: END_POINTS.readSingleNotification(id),
        method: API_METHODS.POST,
      }),
    }),
    readAllNotifications: builder.mutation<NotificationsResponse, void>({
      query: () => ({
        url: END_POINTS.readAllNotifications,
        method: API_METHODS.POST,
      }),
    }),
    mintTokens: builder.mutation<TokenActionResponse, TokenAction>({
      query: (data) => ({
        url: END_POINTS.mintTokens,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    burnTokens: builder.mutation<TokenActionResponse, TokenAction>({
      query: (data) => ({
        url: END_POINTS.burnTokens,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    updateAssetPrice: builder.mutation({
      query: ({ price, assetId }) => ({
        url: END_POINTS.updateAssetPrice(assetId),
        method: API_METHODS.PATCH,
        body: { price },
      }),
    }),
    approveAsset: builder.mutation({
      query: (assetId) => ({
        url: END_POINTS.approveAsset(assetId),
        method: API_METHODS.PATCH,
      }),
    }),
  }),
});

export const {
  useGetPendingAssetsQuery,
  useGetApprovedAssetsQuery,
  useGetRejectedAssetsQuery,
  useGetAssetCategoriesQuery,
  useGetAssetDetailQuery,
  useGetIsFeaturedAssetQuery,
  useVerifyAssetMutation,
  useVerifyDocumentMutation,
  useDeleteAssetMutation,
  useUpdateTokensMutation,
  useCreateAssetMutation,
  useEditAssetMutation,
  useAnalyseImageMutation,
  useGetAllNotificationsQuery,
  useReadAllNotificationsMutation,
  useReadSingleNotificationMutation,
  useMintTokensMutation,
  useBurnTokensMutation,
  useUpdateAssetPriceMutation,
  useApproveAssetMutation,
} = assetsApi;
