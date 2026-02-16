// External Libraries

// Ant Design Components
import { Skeleton, Table } from 'antd';
import type { ColumnType } from 'antd/es/table';
import React, { JSX, useMemo } from 'react';

// Internal Components & Interfaces
import { NoDataFound } from '../no-data-found/no-data-found';

import { TableComponentProps } from './table.interface';

// export interface TableComponentProps<T extends Record<string, unknown>> {
//   columns: ColumnsType<T>;
//   data: T[];
//   rowKey: string | ((record: T) => string);
//   loading?: boolean;
//   handleTableChange?: TableProps<T>['onChange'];
//   pagination?: TableProps<T>['pagination'];
//   onRow?: (record: T) => OnRowProps;
// }

export const TableComponent = <T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  loading = false,
  handleTableChange,
  className = '',
  pagination = false,
  onRow,
}: TableComponentProps<T>): JSX.Element => {
  const memoizedColumns = useMemo(() => {
    return columns.map((column) => {
      const newColumn: ColumnType<T> = { ...column };

      newColumn.render = (value: unknown, record: T, index: number) => {
        if (loading) {
          return <Skeleton key={`skeleton-${String(column.key)}-${index}`} title active paragraph={false} />;
        }

        if (column.render) {
          return column.render(value, record, index);
        }

        return value as React.ReactNode;
      };

      return newColumn;
    });
  }, [columns, loading]);

  return (
    <Table<T>
      pagination={pagination}
      scroll={{ y: 'calc(100vh - 320px)' }}
      onChange={handleTableChange}
      rowKey={rowKey}
      onRow={(record) => ({
        ...(onRow ? onRow(record) : {}),
        style: { cursor: 'pointer' },
      })}
      columns={memoizedColumns}
      dataSource={data}
      className={className}
      locale={{
        emptyText: (
          <NoDataFound
            className="h-500"
            title="No Data Found"
            description="Try adjusting your search or filters to find relevant results."
          />
        ),
      }}
    />
  );
};
