'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

// UI Components

// Styles
import styles from '@styles/components/statsCard.module.scss';

// Interfaces
import { StatsCardProps } from './StatsCard.interface';

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle = 'From last month', change, icon }) => {
  return (
    <div className={styles.metricCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardInfo}>
          <h1 className={styles.cardTitle}>{title}</h1>
          <h2 className={styles.cardValue}>{value}</h2>
        </div>
        <div className={styles.iconWrapper}>{icon}</div>
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.comparisonLabel}>{subtitle}</div>
        <div className={`${styles.changeIndicator} ${change.includes('+') ? styles.positive : styles.negative}`}>
          <div>{change.includes('+') ? <TrendingUp /> : <TrendingDown />}</div>
          {change}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
