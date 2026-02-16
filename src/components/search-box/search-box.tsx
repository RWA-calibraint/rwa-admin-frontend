import { Input } from 'antd';
import { Search, X } from 'lucide-react';
import { FC } from 'react';

// Interfaces
import { SearchBoxProps } from '@components/search-box/search-box.interface';

// Icons

export const SearchBox: FC<SearchBoxProps> = ({
  placeHolder = 'Search',
  className = '',
  autoFocus = false,
  onChange,
  value,
}) => {
  return (
    <Input
      autoFocus={autoFocus}
      value={value}
      className={`${className} bg-white`}
      placeholder={placeHolder}
      onChange={({ target: { value } }) => onChange(value)}
      prefix={<Search />}
      allowClear={{ clearIcon: <X className="cursor-pointer img-16" /> }}
    />
  );
};
