'use client';

import { DownOutlined } from '@ant-design/icons';
import { Select as AntSelect } from 'antd';
import React from 'react';

// UI Components

// Styles
import './style.scss';

// Interfaces
import { SelectProps } from './Select.interface';

const Select: React.FC<SelectProps> = ({
  placeholder = 'Select',
  options = [],
  onChange,
  defaultValue,
  disabled = false,
  className = '',
  size = 'middle',
  open = false,
  onDropDownChange,
}) => {
  return (
    <AntSelect
      maxTagCount={3}
      className={`custom-select ${className}`}
      placeholder={placeholder}
      onChange={onChange}
      defaultValue={defaultValue}
      disabled={disabled}
      options={options}
      size={size}
      suffixIcon={<DownOutlined className={open ? 'rotate' : ''} />}
      open={open}
      onDropdownVisibleChange={onDropDownChange}
    />
  );
};

export default Select;
