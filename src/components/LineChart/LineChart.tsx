'use client';

import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { months } from '@helpers/constants/constants';

import Select from '../Select/Select';

import { LinechartPayload, LineChartProps } from './LineChart.interface';
import styles from './lineChart.module.scss';

const CustomTooltip = ({ active, payload, label }: LinechartPayload) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipTitle}>{label}</p>
        <p className={styles.toolTipSecondary}>
          Users
          <span className={styles.toolTipPrimary}>{payload[0]?.payload?.users?.toLocaleString()}</span>
        </p>
      </div>
    );
  }

  return null;
};

const LineChartComponent = ({ data, showInDashboard, type, onChange, isLoading = false }: LineChartProps) => {
  const [open, setOpen] = useState(false);
  const uniqueYears = data?.years;
  const dataMap = new Map(data?.users && data.users.map(({ count, month }) => [month.slice(0, 3), count]));
  const dataArray = months.map((m) => ({
    month: m,
    users: dataMap.get(m) || 0,
  }));

  const dropDownChange = (value: boolean) => {
    setOpen(value);
  };
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

  return (
    <>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <div className={styles.chartWrapper}>
          {showInDashboard && (
            <div className={styles.header}>
              <h3 className={styles.chartTitle}>User Growth Metrics</h3>
              <div>
                <Select
                  open={Boolean(open)}
                  options={
                    uniqueYears &&
                    uniqueYears.map((year) => ({
                      label: year.toString(),
                      value: year,
                    }))
                  }
                  defaultValue={uniqueYears && uniqueYears[0]}
                  onChange={onChange}
                  onDropDownChange={dropDownChange}
                />
              </div>
            </div>
          )}

          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={dataArray}>
              <XAxis
                dataKey="month"
                tickLine={false}
                tick={{ fontSize: '12px', fill: '#01012E' }}
                axisLine={{ stroke: 'white' }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ddd', strokeWidth: 1 }} />
              <CartesianGrid vertical={false} />
              <Line
                type="monotone"
                dataKey={type}
                stroke="#1B7FAE"
                strokeWidth={2}
                dot={false}
                style={{ cursor: 'pointer' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default LineChartComponent;
