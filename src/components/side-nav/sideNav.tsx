'use client';

import { Menu, MenuProps } from 'antd';
import Image from 'next/image';
import { redirect, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// UI Components

// Constants & Helpers
import { SIDE_BAR_ITEMS, SIDE_BAR_LISTS, SIDE_BARS_KEYS } from '@helpers/sidebar-utils';

// Styles
import './_sidenav.module.scss';

export type MenuItem = Required<MenuProps>['items'][number];
export default function Sidebar() {
  const pathname = usePathname();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const getKeyFromPath = (path: string) => {
    const key = Object.entries(SIDE_BAR_LISTS).find(([, value]) => value.URL === path)?.[0];

    return key;
  };
  const getParentKey = useCallback((path: string) => {
    const currentKey = getKeyFromPath(path);

    if (!currentKey) return null;
    for (const item of SIDE_BAR_ITEMS) {
      if (item && 'children' in item && item.children) {
        const found = item.children.some((child) => child && child.key === currentKey);

        if (found) {
          return item.key?.toString();
        }
      }
    }

    return null;
  }, []);

  useEffect(() => {
    const currentKey = getKeyFromPath(pathname);

    if (currentKey) {
      setSelectedKeys([currentKey]);
    }
    //  else {
    //   const key = SIDE_BARS_KEYS.;

    //   setSelectedKeys([key]);
    // }
  }, [getParentKey, pathname]);

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (SIDE_BAR_LISTS[key]?.URL) {
      redirect(SIDE_BAR_LISTS[key].URL);
    }
  };

  return (
    <div className="sidebar">
      <div className="position-sticky top-8">
        <div
          className="logo"
          onClick={() => {
            redirect('/dashboard');
          }}
        >
          <Image src="/RWA_Logo.svg" alt="rareagora logo" height={36} width={36} />{' '}
          <button className="f-18-20-700-logo main-button cursor-pointer font-brand">RareAgora</button>
        </div>
        <div className="height-80 gap-2 f-14-26-400-side-nav-text">
          <Menu
            onClick={onClick}
            selectedKeys={selectedKeys}
            openKeys={[SIDE_BARS_KEYS.ASSET_MANAGEMENT, SIDE_BARS_KEYS.USER_MANAGEMENT]}
            mode="inline"
            items={SIDE_BAR_ITEMS}
            className="ant-menu"
            expandIcon={() => null}
          />
        </div>
      </div>
    </div>
  );
}
