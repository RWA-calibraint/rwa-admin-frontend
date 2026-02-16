import { AssetMetricsResponse, UserMetricsResponse } from '@redux/interfaces/dashboard.interface';

export interface AssetData {
  name: string;
  value: number;
  color: string;
}

export interface LegendProps {
  payload: { value: string; color: string }[];
}

interface PayloadStyle {
  transform: string;
  transition: string;
  zIndex: number;
  position: string;
}

interface PayloadData {
  name: string;
  value: number;
  color: string;
}

interface AssetPayload {
  payload: PayloadData;
  stroke: string;
  fill: string;
  cx: string;
  cy: string;
  name: string;
  value: number;
  color: string;
  className: string;
  style: PayloadStyle;
}

export interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: AssetPayload }[];
}

export interface DonutProps {
  type: string;
  title: string;
  userMetrics?: UserMetricsResponse | undefined;
  assetMetrics?: AssetMetricsResponse | undefined;
}

export interface DonutDataProps {
  value: number;
  name: string;
  color: string;
}

export interface PieSectorProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  percent: number;
  value: number;
  name: string;
}
