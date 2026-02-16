'use client';

import { Pagination } from 'antd';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

// Hooks
import { PaginationInterface } from '@components/pagination/pagination.interface';
import { useUrlSearchParams } from '@hooks/useUrlSearchParams';

// Constants & Interfaces
import { PAGINATION_DATA_TYPE } from './pagination.constants';

export const PaginationComponent: FC<PaginationInterface> = ({ totalDataCount }) => {
  const { getParam, updateSearchParams } = useUrlSearchParams();
  const pathName = usePathname();

  const dataType = PAGINATION_DATA_TYPE[pathName] ?? PAGINATION_DATA_TYPE.ASSETS;
  const page = Number(getParam('page', '1'));
  const size = Number(getParam('size', '10'));

  return (
    <div className="d-flex align-center justify-space-between bg-white m-b-20  m-x-20">
      <p className="f-14-16-500-secondary">{`Showing ${(page - 1) * size + 1} - ${Math.min(page * size, totalDataCount)} of ${totalDataCount} ${dataType}`}</p>
      <Pagination
        current={page}
        pageSize={size}
        showSizeChanger
        total={totalDataCount}
        onChange={(page, pageSize) => updateSearchParams({ page, size: pageSize })}
      />
    </div>
  );
};
