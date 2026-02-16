'use client';

import { Dropdown, MenuProps } from 'antd';

import { DropdownInterface } from '@components/dropdown/dropdown.interface';

export default function DropdownComponent({
  menuItems,
  triggerAction = ['click'],
  dropdownPlacement,
  label,
  handleClick,
  className,
}: Readonly<DropdownInterface>) {
  const handleMenuClick: MenuProps['onClick'] = (event) => {
    event.domEvent.stopPropagation();
    if (handleClick) {
      handleClick(event);
    }
  };

  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: handleMenuClick,
      }}
      trigger={triggerAction}
      placement={dropdownPlacement}
      className={className}
    >
      {label}
    </Dropdown>
  );
}
