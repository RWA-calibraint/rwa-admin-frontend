'use client';

import { Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, Sector, Tooltip } from 'recharts';

// Constants & Styles
import { assetCategories } from '@helpers/constants/mock-data';

import { DonutDataProps, DonutProps, TooltipProps, PieSectorProps } from './PieChart.interface';
import styles from './pieChart.module.scss';

// Interfaces

const RADIAN = Math.PI / 180;
// const CustomLegend: React.FC<LegendProps> = ({ payload }) => {
//   return (
//     <ul className={styles.legendList}>
//       {payload.map((entry, index) => (
//         <li key={`item-${index}`} className={styles.legendItem}>
//           <span
//             className={styles.legendColor}
//             style={{ backgroundColor: entry.color }}
//           ></span>
//           {entry.value}
//         </li>
//       ))}
//     </ul>
//   );
// };

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        {payload.map((entry, index) => (
          <p key={index} className={styles.tooltipItem}>
            <span className={styles.tooltipColor} style={{ backgroundColor: entry?.payload?.payload?.color }}></span>
            <span className={styles.tooltipText}>{entry.name}</span>
            <span className={styles.tooltipValue}>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const renderActiveShape = (props: unknown) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill } = props as PieSectorProps;

  const offset = 8;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + offset * cos;
  const sy = cy + offset * sin;

  return (
    <g>
      <Sector
        cx={sx}
        cy={sy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const DonutChart = ({ title, type, userMetrics, assetMetrics }: DonutProps) => {
  const [isClient, setIsClient] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isLoading = false;
  const colorList = ['#2D8CFF', '#F4A261', '#E9C46A', '#264653', '#E76F51'];
  let data: DonutDataProps[] = [];

  if (type === 'user' && userMetrics) {
    data = userMetrics.response.map(({ status, users }, index) => ({
      value: users,
      name: status,
      color: colorList[index % colorList.length],
    }));
  } else if (assetCategories && assetMetrics) {
    data = assetMetrics.response.map(({ count, category }, index) => ({
      value: count,
      name: category,
      color: colorList[index % colorList.length],
    }));
  }

  if (data.length === 0) {
    data = [{ name: 'No Data Available', value: 1, color: '#D3D3D3' }];
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className={styles.chartWrapper}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.chartContent}>
        {isLoading ? (
          <div>
            <Skeleton active paragraph={{ rows: 6 }} className={styles.skeletonLoader} />
          </div>
        ) : (
          <>
            <PieChart width={300} height={250}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                activeIndex={activeIndex ?? undefined}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {Array.isArray(data) &&
                  data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className={styles.segment}
                      style={{
                        transition: 'transform 0.3s ease-out',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
            {assetCategories.length === 0 && <p className={styles.noDataText}>{`No ${title} available`}</p>}
          </>
        )}
        {/* eslint-disable-next-line no-warning-comments */}
        {/* TODO: For future reference
        <div className={styles.legendContainer}>
        <CustomLegend payload={data.map((d) => ({ value: d.name, color: d.color }))} />
      </div> */}
      </div>
    </div>
  );
};

export default DonutChart;
