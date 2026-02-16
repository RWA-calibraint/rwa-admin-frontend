import { assetSoldInterface } from '@redux/interfaces/dashboard.interface';

interface AssetData {
  radius: [number, number, number, number];
  dataKey: string;
  name: string;
  value: number;
  payload: {
    month: string;
    assets: number;
    usd: number;
  };
  hide: boolean;
}

export interface BarchartProps {
  active?: boolean;
  payload?: AssetData[];
  label?: string;
}

interface BarChartCategories {
  _id: string;
  category: string;
}

interface BarChartResponse {
  assets: assetSoldInterface[];
  categories: BarChartCategories[];
  years: string[];
}

export interface BarChartProps {
  data: BarChartResponse | undefined;
  onYearChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  isLoading: boolean;
  selectedYear: string;
  selectedCategory: string;
}
