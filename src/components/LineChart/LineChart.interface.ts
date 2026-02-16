interface Option {
  value: string;
  label: string;
}
type ChartType = 'users' | 'price' | 'tokens';
export interface ChartData {
  month: string;
  count: number;
  year: string;
}

interface userCountResponse {
  years: string[];
  users: ChartData[];
}
export interface LineChartProps {
  type: ChartType;
  data: userCountResponse | undefined;
  options?: Option[];
  onChange?: (value: string) => void;
  dropDownChange?: (value: boolean) => void;
  showInDashboard: boolean;
  isLoading?: boolean;
  selectedYear?: string;
}

interface AssetData {
  radius: [number, number, number, number];
  dataKey: string;
  name: string;
  color: string;
  value: number;
  payload: {
    minted: string;
    burned: string;
    month: string;
    users: number;
  };
  stroke: string;
  strokeWidth: string;
  hide: boolean;
}

export interface LinechartPayload {
  active?: boolean;
  payload?: AssetData[];
  label?: string;
}
export interface TokenDataPoint {
  period: string;
  minted: number;
  burned: number;
}

export interface TokenMetricsProps {
  data: TokenDataPoint[] | undefined;
  isLoading?: boolean;
  year: number;
  month?: number;
  week?: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number | undefined) => void;
  onWeekChange: (week: number | undefined) => void;
  availableWeeks: number[];
}
