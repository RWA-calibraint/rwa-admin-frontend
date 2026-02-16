import { useMemo } from 'react';

export const usePagination = <T>(currentPage: number, rowsPerPage: number, filteredData?: T[]) => {
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return filteredData?.slice(startIndex, endIndex);
  }, [filteredData, currentPage, rowsPerPage]);

  return { paginatedData };
};
