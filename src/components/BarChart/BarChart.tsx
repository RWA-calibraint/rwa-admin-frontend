'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

import Select from '../Select/Select';

import { BarChartProps, BarchartProps } from './BarChart.interface';
import styles from './BarChart.module.scss';

const CustomTooltip = ({ active, payload, label }: BarchartProps) => {
  if (active && payload && payload.length && payload[0]?.value > 0) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipTitle}>{label}</p>
        <p className={styles.toolTipSecondary}>
          Assets
          <span className={styles.toolTipPrimary}>{payload[0]?.value}</span>
        </p>
        <p className={styles.toolTipSecondary}>
          USD
          <span className={styles.toolTipPrimary}>${payload[0]?.payload?.usd?.toLocaleString()}</span>
        </p>
      </div>
    );
  }

  return null;
};

const BarChartComponent = ({ data, onYearChange, selectedYear, selectedCategory, onCategoryChange }: BarChartProps) => {
  const categories = data?.categories;
  const years = data?.years;
  const categoryOptions =
    categories &&
    categories.map(({ _id, category }) => ({
      value: _id,
      label: category.replace('-', ' '),
    }));
  const yearOptions = years && years.map((year) => ({ value: year, label: year }));
  const [chartHeight, setChartHeight] = useState(170);
  const [barSize, setBarSize] = useState(40);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [openYear, setOpenYear] = useState(false);
  const onDropDownCategoryChange = (value: boolean) => {
    setOpen(value);
  };
  const onDropDownYearChange = (value: boolean) => {
    setOpenYear(value);
  };

  useEffect(() => {
    const updateHeight = () => {
      const dynamicHeight = (170 / 880) * window.innerHeight;
      const barvalue = (40 / 1366) * window.innerWidth;

      setChartHeight(dynamicHeight);
      setBarSize(barvalue);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.header}>
        <h3 className={styles.chartTitle}>Asset Tokens Sold</h3>
        <div className={styles.filters}>
          <Select
            placeholder="Category"
            onChange={onCategoryChange}
            open={open}
            defaultValue={selectedCategory}
            options={categoryOptions}
            onDropDownChange={onDropDownCategoryChange}
          />
          <Select
            placeholder="Year"
            onChange={onYearChange}
            open={openYear}
            defaultValue={selectedYear}
            options={yearOptions}
            onDropDownChange={onDropDownYearChange}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data?.assets} barSize={barSize}>
          <XAxis
            dataKey="month"
            tickLine={false}
            tick={{ fontSize: '12px', fill: '#01012E' }}
            axisLine={{ stroke: 'white' }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <CartesianGrid vertical={false} />
          <Bar
            dataKey="assets"
            radius={[8, 8, 0, 0]}
            onMouseEnter={(_, index) => setHoveredBar(index)}
            onMouseLeave={() => setHoveredBar(null)}
            style={{ cursor: 'pointer' }}
          >
            {data &&
              data.assets.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={hoveredBar === index ? '#1b7FAE' : '#50B7E0'} />
              ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
