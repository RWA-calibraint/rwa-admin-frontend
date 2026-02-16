import { SelectProps } from 'antd';

import { DateRange } from '@components/date-picker/interface';

export interface TableMenuComponentInterface {
  selectList: SelectOptions[];
  defaultSearchValue?: string;
  onSearchValueChange: (value: string) => void;
  datePickerOptions: {
    enable?: boolean;
    onChange: (data: DateRange) => void;
  };
  onAssetClick?: () => void;
  onResetClick?: () => void;
}
export interface SelectOptions {
  title: string;
  className: string;
  options: SelectProps['options'];
  onChange: (value: string[]) => void;
}
