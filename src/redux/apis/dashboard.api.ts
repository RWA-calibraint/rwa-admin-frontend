import {
  assetCountResponse,
  AssetMetricsResponse,
  assetSoldResponse,
  UserCountMetricsResponse,
  UserMetricsResponse,
  TokenCountMetricsResponse,
} from '../interfaces/dashboard.interface';
import { END_POINTS } from '../utils/constants';

import { baseApi } from '.';

export const dashboardApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAssetCategoryMetrics: builder.query<AssetMetricsResponse, void>({
      query: () => END_POINTS.getAssetCategories,
    }),
    getAssetCountMetrics: builder.query<assetCountResponse, void>({
      query: () => END_POINTS.getAssetCountMetrics,
    }),
    getAssetSoldMetrics: builder.query<assetSoldResponse, { category: string; year: string }>({
      query: ({ category, year }) => END_POINTS.getAssetSoldMetrics(category, year),
    }),
    getUserMetrics: builder.query<UserMetricsResponse, void>({
      query: () => END_POINTS.getUserMetrics(),
    }),
    getUserCountMetrics: builder.query<UserCountMetricsResponse, string>({
      query: (year) => END_POINTS.getUserCountMetrics(year),
    }),
    getTokenCountMetrics: builder.query<TokenCountMetricsResponse, { year: number; month?: number; week?: number }>({
      query: ({ year, month = 0, week = 0 }) => END_POINTS.getTokenCountMetrics(year, month, week),
    }),
  }),
});

export const {
  useGetAssetCategoryMetricsQuery,
  useGetAssetCountMetricsQuery,
  useGetAssetSoldMetricsQuery,
  useGetUserMetricsQuery,
  useGetUserCountMetricsQuery,
  useGetTokenCountMetricsQuery,
} = dashboardApi;
