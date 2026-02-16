import { MenuProps } from 'antd';
import { JSX } from 'react';

export interface DropdownInterface {
  menuItems: MenuProps['items'];
  label: JSX.Element;
  triggerAction?: Array<'click' | 'hover' | 'contextMenu'>;
  dropdownPlacement: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'top' | 'bottom';
  handleClick: MenuProps['onClick'];
  className?: string;
}

export interface MenuInfo {
  key: string;
  keyPath: string[];
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

export type MenuClickEventHandler = (info: MenuInfo) => void;
