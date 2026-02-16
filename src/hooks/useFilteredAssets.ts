import { useState, useMemo } from 'react';

import { UseFilteredAssetsProps } from '@hooks/hooks.interfaces';
import { AssetInterface } from '@redux/interfaces/assets.interface';

const stripTime = (date: Date | null) => {
  if (!date) return null;
  const newDate = new Date(date);

  newDate.setHours(0, 0, 0, 0);

  return newDate;
};

export const useFilteredAssets = ({ assetData }: UseFilteredAssetsProps) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const categorySet = useMemo(
    () => new Set(selectedCategory.map((category) => category.toLowerCase())),
    [selectedCategory],
  );

  const statusSet = useMemo(() => new Set(selectedStatus.map((status) => status.toLowerCase())), [selectedStatus]);

  const filteredAssets = useMemo(() => {
    const [startDate, endDate] = dateRange.map(stripTime);
    const lowerCaseSearch = searchValue.toLowerCase().trim();

    return assetData.filter(({ name, category, status, createdAt }: AssetInterface) => {
      const assetDate = stripTime(new Date(createdAt));

      return (
        name.toLowerCase().includes(lowerCaseSearch) &&
        (!categorySet.size || categorySet.has(String(category))) &&
        (!statusSet.size || statusSet.has(status.toLowerCase())) &&
        (!startDate ||
          !endDate ||
          (assetDate && startDate && endDate && assetDate >= startDate && assetDate <= endDate))
      );
    });
  }, [assetData, categorySet, statusSet, searchValue, dateRange]);

  return {
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    filteredAssets,
    setDateRange,
    searchValue,
    setSearchValue,
  };
};
