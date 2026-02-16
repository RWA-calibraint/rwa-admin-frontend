export interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  change: string;
  icon?: React.ReactNode;
  className?: string;
}
