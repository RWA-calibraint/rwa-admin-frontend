// Ant Design Imports
import { GetProp } from "antd";
import { TablePaginationConfig, TableProps } from "antd/es/table";
import { ColumnsType, SorterResult } from "antd/es/table/interface";

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<unknown>["field"];
  sortOrder?: SorterResult<unknown>["order"];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

export interface CommonColumnType {
  title: { head: string; tooltip: string; url?: string; chip?: boolean };
  dataIndex: string;
  key: string;
  enableSort: boolean;
  enableFilter: boolean;
  filterValues?: { text: string; value: string }[];
  enableFilterSearch?: boolean;
}

export interface TableComponentProps<T extends Record<string, unknown>> {
  columns: ColumnsType<T>;
  data: T[];
  rowKey: string | ((record: T) => string);
  loading?: boolean;
  handleTableChange?: TableProps<T>["onChange"];
  pagination?: TableProps<T>["pagination"];
  className?: string;
  onRow?: (record: T) => OnRowProps;
}

export interface OnRowProps {
  onClick?: (event: React.MouseEvent<HTMLTableRowElement>) => void;
  onDoubleClick?: (event: React.MouseEvent<HTMLTableRowElement>) => void;
  onContextMenu?: (event: React.MouseEvent<HTMLTableRowElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLTableRowElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLTableRowElement>) => void;
}
