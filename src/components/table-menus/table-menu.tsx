'use client';

import { Select } from 'antd';
import { X } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

import Button from '../Button/Button';
import DateRangePicker from '../date-picker/datePicker';
import { DateRange } from '../date-picker/interface';
import { SearchBox } from '../search-box/search-box';

import '../Select/style.scss';
import { TableMenuComponentInterface } from './table-menu.interface';

export const TableMenuComponents: FC<TableMenuComponentInterface> = ({
  selectList,
  datePickerOptions,
  defaultSearchValue = '',
  onSearchValueChange,
  onAssetClick,
  onResetClick,
}) => {
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({});
  const [searchValue, setSearchValue] = useState('');
  const [selectedDate, setSelectedDate] = useState<DateRange | null>(null);

  useMemo(() => {
    setFiltersApplied(
      searchValue.length > 0 ||
        Object.values(selectedValues).some((values) => values.length > 0) ||
        (selectedDate !== null && selectedDate.some((date) => date !== null)),
    );
  }, [searchValue, selectedValues, selectedDate]);

  const handleSelectChange = (title: string, values: string[]) => {
    setSelectedValues((prev) => ({ ...prev, [title]: values }));
  };

  const handleReset = () => {
    setSearchValue('');
    setSelectedValues({});
    setSelectedDate(null);
    setFiltersApplied(false);
    onResetClick?.();
  };

  return (
    <div className="d-flex justify-space-between align-center">
      <div className="d-flex align-center m-t-20 m-x-20 gap-3">
        <SearchBox
          value={searchValue || defaultSearchValue}
          placeHolder="Search"
          className="w-300"
          onChange={(value) => {
            setSearchValue(value);
            onSearchValueChange(value);
          }}
        />
        {selectList.map((select) => (
          <Select
            key={select.title}
            showSearch={false}
            maxTagCount={2}
            mode="multiple"
            style={{ width: '100%' }}
            className={select.className}
            placeholder={select.title}
            value={selectedValues[select.title] || []}
            onChange={(values) => {
              handleSelectChange(select.title, values);
              select.onChange(values);
            }}
            tokenSeparators={[',']}
            options={select.options}
          />
        ))}
        {datePickerOptions.enable && (
          <DateRangePicker
            onChange={(date) => {
              setSelectedDate(date ?? null);
              datePickerOptions.onChange(date);
            }}
            className="h-44"
            value={selectedDate}
          />
        )}
        {filtersApplied && (
          <button type="button" className="reset-btn" onClick={handleReset}>
            Reset <X className="h-16 w-16" />
          </button>
        )}
      </div>
      {onAssetClick && (
        <Button className="m-t-20 w-155 m-x-20 p-x-20 p-y-20" onClick={onAssetClick}>
          Submit New Asset
        </Button>
      )}
    </div>
  );
};
