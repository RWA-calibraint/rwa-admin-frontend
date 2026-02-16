'use client';

import { Package, PackageCheck, PackageX, Users } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

import BarChartComponent from '@components/BarChart/BarChart';
import LineChartComponent from '@components/LineChart/LineChart';
import SkeletonLoader from '@components/Loader/skeleton.loader';
import DonutChart from '@components/PieChart/PieChart';
import StatsCard from '@components/StatsCard/StatsCard';
import {
  useGetAssetCategoryMetricsQuery,
  useGetAssetCountMetricsQuery,
  useGetAssetSoldMetricsQuery,
  useGetUserCountMetricsQuery,
  useGetUserMetricsQuery,
  useGetTokenCountMetricsQuery,
} from '@redux/apis/dashboard.api';
import styles from '@styles/components/dashboard.module.scss';

const getCurrentDateInfo = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const firstDayOfMonth = new Date(currentYear, now.getMonth(), 1);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const offsetDate = now.getDate() + firstDayWeekday;
  const currentWeek = Math.ceil(offsetDate / 7);

  return { currentYear, currentMonth, currentWeek };
};

const generateWeeksInMonth = (year: number, month: number) => {
  const date = new Date(year, month - 1, 1);
  const weeks = [];
  let week = 1;

  while (date.getMonth() === month - 1) {
    weeks.push(week++);
    date.setDate(date.getDate() + 7);
  }

  return weeks;
};

export default function Dashboard() {
  const { currentYear, currentMonth, currentWeek } = getCurrentDateInfo();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
  const [selectedWeek, setSelectedWeek] = useState<number | undefined>(undefined);
  const [availableWeeks, setAvailableWeeks] = useState<number[]>([]);

  useEffect(() => {
    if (selectedMonth) {
      setAvailableWeeks(generateWeeksInMonth(selectedYear, selectedMonth));
      setSelectedWeek(undefined);
    } else {
      setAvailableWeeks([]);
      setSelectedWeek(undefined);
    }
  }, [selectedMonth, selectedYear]);

  const query = {
    year: selectedYear,
    ...(selectedMonth !== undefined && { month: selectedMonth }),
    ...(selectedWeek !== undefined && { week: selectedWeek }),
  };

  const { data: tokenCountMetrics, isLoading: tokenCountLoading } = useGetTokenCountMetricsQuery(query);
  const DEFAULT_YEAR = new Date().getFullYear().toString();
  const [userSelectedYear, setUserSelectedYear] = useState(DEFAULT_YEAR);
  const [assetSelectedYear, setAssetSelectedYear] = useState(DEFAULT_YEAR);
  const [category, setCategory] = useState('All');
  const { data: assetCategoryMetrics, isLoading: assetCategoryLoading } = useGetAssetCategoryMetricsQuery();
  const { data: assetSoldMetrics, isLoading: assetSoldloading } = useGetAssetSoldMetricsQuery({
    category: category,
    year: assetSelectedYear,
  });
  const { data: userMetrics, isLoading: userStatusloading } = useGetUserMetricsQuery();
  const { data: userCountMetrics, isLoading: userCountloading } = useGetUserCountMetricsQuery(userSelectedYear);
  const { data: assetCountMetrics, isLoading: assetCountloading } = useGetAssetCountMetricsQuery();

  const isLoading = useMemo(() => {
    return (
      assetCategoryLoading ||
      assetSoldloading ||
      userStatusloading ||
      userCountloading ||
      assetCountloading ||
      tokenCountLoading
    );
  }, [
    assetCategoryLoading,
    assetSoldloading,
    userStatusloading,
    userCountloading,
    assetCountloading,
    tokenCountLoading,
  ]);

  function getStatsIcon(title: string) {
    switch (title) {
      case 'Approved Assets':
        return <PackageCheck className={styles.iconWidth} />;
      case 'Rejected Assets':
        return <PackageX className={styles.iconWidth} />;
      case 'Total Users':
        return <Users className={styles.iconWidth} />;
      case 'Tokens Sold':
        return <Package className={styles.iconWidth} />;
      default:
        return <PackageCheck className={styles.iconWidth} />;
    }
  }

  const handleChange = (value: string) => {
    setUserSelectedYear(value);
  };

  const handleYearChange = (value: string) => {
    setAssetSelectedYear(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  return (
    <div className="p-20 bg-background-primary">
      <div className={styles.dashboard}>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            <div className={styles.gridContainer}>
              {assetCountMetrics &&
                assetCountMetrics.response.map((stats) => (
                  <StatsCard
                    key={stats.id}
                    title={stats.title}
                    value={stats.value}
                    change={stats.change}
                    icon={getStatsIcon(stats.title)}
                  />
                ))}
            </div>
            <div className={styles.barContainer}>
              <DonutChart type={'category'} title={'Asset Categories'} assetMetrics={assetCategoryMetrics} />
              <BarChartComponent
                onCategoryChange={handleCategoryChange}
                onYearChange={handleYearChange}
                data={assetSoldMetrics?.response}
                isLoading={assetSoldloading}
                selectedYear={assetSelectedYear}
                selectedCategory={category}
              />
            </div>
            <div className={styles.lineContainer}>
              <LineChartComponent
                type="users"
                showInDashboard={true}
                data={userCountMetrics?.response}
                onChange={handleChange}
              />
              <DonutChart type={'user'} title={'User Management'} userMetrics={userMetrics} />
            </div>
            {/* <div className="w-full p-t-20">
              <TokenLineChartComponent
                data={tokenCountMetrics?.response?.data}
                isLoading={isLoading}
                year={selectedYear}
                month={selectedMonth}
                week={selectedWeek}
                onYearChange={setSelectedYear}
                onMonthChange={setSelectedMonth}
                onWeekChange={setSelectedWeek}
                availableWeeks={availableWeeks}
              />
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}
