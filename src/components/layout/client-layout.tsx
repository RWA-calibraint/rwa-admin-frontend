'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import ErrorPage from '@/app/not-found';

import NavigationMenu from './navigation-menu';

const validRoutes = [
  '/',
  '/dashboard',
  '/settings',
  '/profile',
  '/asset/rejected-assets',
  '/create-asset',
  '/login',
  '/asset',
  '/asset/pending-assets',
  '/asset/approved-assets',
  '/user-management',
  '/transactions',
];

function ClientLayout({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();

  const isValidRoute = validRoutes.some((route) => pathname.startsWith(route));

  if (!isValidRoute) {
    return <ErrorPage />;
  }

  return <NavigationMenu>{children}</NavigationMenu>;
}
export default ClientLayout;
