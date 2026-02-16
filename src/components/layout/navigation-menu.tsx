'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

import { PATH_LIST } from '@helpers/constants/authentication-paths';
import { PAGINATION_PATHS } from '@helpers/constants/pagination-paths';
import { useAppSelector } from '@redux/store';

import Navbar from '../header/header';
import { PaginationComponent } from '../pagination/pagination';
import Sidebar from '../side-nav/sideNav';

import { NavProps } from './interface';

const NavigationMenu = ({ children }: NavProps) => {
  const pathName = usePathname();

  const totalDataCount = useAppSelector((state) => state.pagination.totalDataCount);

  if (PATH_LIST.has(pathName.split('/')[1])) return <>{children}</>;

  const SCREENS_WITH_BG = ['/create-asset', '/asset-edit'];
  const applyBackground = SCREENS_WITH_BG.some((path) => pathName.startsWith(path));

  return (
    <div className="layout">
      <Sidebar />
      <Suspense>
        <div className="main overflow-auto">
          <div
            className="d-flex justify-space-between flex-column"
            style={applyBackground ? { backgroundColor: '#F4F4F5' } : {}}
          >
            <Navbar />
            {children}
          </div>
          {PAGINATION_PATHS.has(pathName) && totalDataCount > 10 && (
            <PaginationComponent totalDataCount={totalDataCount} className="" />
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default NavigationMenu;
