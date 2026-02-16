'use client';

import { Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { TokenDataPoint, TokenMetricsProps, LinechartPayload } from './LineChart.interface';
import styles from './lineChart.module.scss';


const CustomTooltip = ({ active, payload, label }: LinechartPayload) => {
  if (active && payload?.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipTitle}>{label}</p>
        <p className={styles.toolTipSecondary}>
          Minted: <span className={styles.toolTipPrimary}>{payload[0].payload.minted.toLocaleString()}</span>
        </p>
        <p className={styles.toolTipSecondary}>
          Burned: <span className={styles.toolTipPrimary}>{payload[0].payload.burned.toLocaleString()}</span>
        </p>
      </div>
    );
  }

  return null;
};

const TokenLineChartComponent = ({
  data,
  isLoading,
  year,
  month,
  week,
  onYearChange,
  onMonthChange,
  onWeekChange,
  availableWeeks,
}: TokenMetricsProps) => {
  const [chartHeight, setChartHeight] = useState(170);

  useEffect(() => {
    const updateHeight = () => {
      const dynamicHeight = (170 / 880) * window.innerHeight;

      setChartHeight(dynamicHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const formattedData = data?.map((d: TokenDataPoint) => {
    const isDate = /^\d{4}-\d{2}-\d{2}$/.test(d.period); // Check if it's a date

    return {
      ...d,
      period: isDate
        ? new Date(d.period).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : d.period, // If it's not a date, just leave it as is (e.g., 'Week 1')
    };
  });

  const years = [2025, 2024];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.header}>
        <h3 className={styles.chartTitle}>Token Metrics</h3>
        <div className="d-flex align-center justify-center">
          <p className="d-flex align-center f-14-16-400-secondary">
            <span
              style={{
                display: 'inline-block',
                alignItems: 'center',
                width: '15px',
                height: '2px',
                backgroundColor: '#4ade80',
                margin: '8px',
              }}
            ></span>
            Minted
          </p>
          <p className="d-flex align-center f-14-16-400-secondary">
            <span
              style={{
                width: '15px',
                height: '2px',
                backgroundColor: '#f87171',
                margin: '8px',
              }}
            ></span>
            Burned
          </p>
        </div>
        <div className={styles.dropdownContainer}>
          <Select
            value={year}
            onChange={(val) => {
              onYearChange(val);
              onMonthChange(undefined);
              onWeekChange(undefined);
            }}
            options={years.map((year) => ({
              label: `${year}`,
              value: year,
            }))}
            style={{ width: 120, margin: '5px' }}
          />

          <Select
            value={month}
            onChange={(val) => {
              onMonthChange(val);
              onWeekChange(undefined);
            }}
            placeholder="Select Month"
            style={{ width: 120, margin: '5px' }}
            allowClear
          >
            {months.map((m) => (
              <Select.Option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString('default', { month: 'short' })}
              </Select.Option>
            ))}
          </Select>

          {month && (
            <Select
              value={week}
              onChange={onWeekChange}
              placeholder="Select Week"
              style={{ width: 120, margin: '5px' }}
              allowClear
            >
              {availableWeeks.map((w) => (
                <Select.Option key={w} value={w}>
                  Week {w}
                </Select.Option>
              ))}
            </Select>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loaderWrapper}>
          <Spin size="large" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="period"
              tickLine={false}
              tick={{ fontSize: '15px', fill: '#01012E' }}
              axisLine={{ stroke: 'white' }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis hide />
            <CartesianGrid vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="minted"
              stroke="#4ade80"
              strokeWidth={2}
              dot={false}
              style={{ cursor: 'pointer' }}
            />
            <Line
              type="monotone"
              dataKey="burned"
              stroke="#f87171"
              strokeWidth={2}
              dot={false}
              style={{ cursor: 'pointer' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TokenLineChartComponent;
