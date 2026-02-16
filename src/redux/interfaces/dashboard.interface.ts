export interface categoryInterface {
  count: number;
  category: string;
}

interface userMetricInterface {
  status: string;
  users: number;
}

interface userCountMetricInterface {
  month: string;
  count: number;
  year: string;
}

interface TokenCountData {
  period: string;
  minted: number;
  burned: number;
}

interface userCountResponse {
  years: string[];
  users: userCountMetricInterface[];
}

interface tokenCountResponse {
  data: TokenCountData[];
}

interface assetCountInterface {
  id: number;
  title: string;
  change: string;
  value: string;
}

export interface assetSoldInterface {
  month: string;
  assets: number;
  usd: number;
  category: string;
  year: string;
}

interface BarChartCategories {
  _id: string;
  category: string;
}

export interface BarChartResponse {
  assets: assetSoldInterface[];
  categories: BarChartCategories[];
  years: string[];
}

export interface AssetMetricsResponse {
  response_code: number;
  response_status: string;
  response: categoryInterface[];
}

export interface UserMetricsResponse {
  response_code: number;
  response_status: string;
  response: userMetricInterface[];
}

export interface UserCountMetricsResponse {
  response_code: number;
  response_status: string;
  response: userCountResponse;
}

export interface TokenCountMetricsResponse {
  response_code: number;
  response_status: string;
  response: tokenCountResponse;
}

export interface assetCountResponse {
  response_code: number;
  response_status: string;
  response: assetCountInterface[];
}

export interface assetSoldResponse {
  response_code: number;
  response_status: string;
  response: BarChartResponse;
}
