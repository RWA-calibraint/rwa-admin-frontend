import { Box, Landmark, LayoutDashboard, Users } from 'lucide-react';

import { MenuItem } from '@components/side-nav/sideNav';

export const SIDE_BARS_KEYS = {
  DASHBOARD: 'dashboard',
  ASSET_MANAGEMENT: 'asset-management',
  PENDING_ASSETS: 'pending-assets',
  REJECTED_ASSETS: 'rejected-assets',
  APPROVED_ASSETS: 'approved-assets',
  TRANSACTIONS: 'transactions',
  USER_MANAGEMENT: 'user-management',
  BUYER_SELLER: 'buyer-seller',
  ADMINISTRATORS: 'administrators',
};

export const SIDE_BAR_LISTS = {
  [SIDE_BARS_KEYS.ASSET_MANAGEMENT]: {
    TITLE: 'Asset Management',
    URL: '',
  },
  [SIDE_BARS_KEYS.DASHBOARD]: {
    TITLE: 'Dashboard',
    URL: '/dashboard',
  },
  [SIDE_BARS_KEYS.PENDING_ASSETS]: {
    TITLE: 'Pending Assets',
    URL: '/asset/pending-assets',
  },
  [SIDE_BARS_KEYS.REJECTED_ASSETS]: {
    TITLE: 'Rejected Assets',
    URL: '/asset/rejected-assets',
  },
  [SIDE_BARS_KEYS.TRANSACTIONS]: {
    TITLE: 'Transactions',
    URL: '/transactions',
  },
  [SIDE_BARS_KEYS.APPROVED_ASSETS]: {
    TITLE: 'Approved Assets',
    URL: '/asset/approved-assets',
  },
  [SIDE_BARS_KEYS.USER_MANAGEMENT]: {
    TITLE: 'User Management',
    URL: '',
  },
  [SIDE_BARS_KEYS.BUYER_SELLER]: {
    TITLE: 'Buyer & Seller',
    URL: '/user-management',
  },
  [SIDE_BARS_KEYS.ADMINISTRATORS]: {
    TITLE: 'Administrators',
    URL: '/administrators',
  },
};

export const SIDE_BAR_ITEMS: MenuItem[] = [
  {
    key: SIDE_BARS_KEYS.DASHBOARD,
    icon: <LayoutDashboard />,
    label: SIDE_BAR_LISTS[SIDE_BARS_KEYS.DASHBOARD].TITLE,
  },
  {
    key: SIDE_BARS_KEYS.ASSET_MANAGEMENT,
    icon: <Box />,
    label: SIDE_BAR_LISTS[SIDE_BARS_KEYS.ASSET_MANAGEMENT].TITLE,
    children: [
      {
        key: SIDE_BARS_KEYS.PENDING_ASSETS,
        label: SIDE_BAR_LISTS[SIDE_BARS_KEYS.PENDING_ASSETS].TITLE,
      },
      {
        key: SIDE_BARS_KEYS.APPROVED_ASSETS,
        label: SIDE_BAR_LISTS[SIDE_BARS_KEYS.APPROVED_ASSETS].TITLE,
      },
      {
        key: SIDE_BARS_KEYS.REJECTED_ASSETS,
        label: SIDE_BAR_LISTS[SIDE_BARS_KEYS.REJECTED_ASSETS].TITLE,
      },
    ],
  },
  {
    key: SIDE_BARS_KEYS.USER_MANAGEMENT,
    icon: <Users />,
    label: SIDE_BAR_LISTS[SIDE_BARS_KEYS.USER_MANAGEMENT].TITLE,
    children: [
      {
        key: SIDE_BARS_KEYS.BUYER_SELLER,
        label: SIDE_BAR_LISTS[SIDE_BARS_KEYS.BUYER_SELLER].TITLE,
      },
      {
        key: SIDE_BARS_KEYS.ADMINISTRATORS,
        label: SIDE_BAR_LISTS[SIDE_BARS_KEYS.ADMINISTRATORS].TITLE,
      },
    ],
  },
  {
    key: SIDE_BARS_KEYS.TRANSACTIONS,
    icon: <Landmark />,
    label: SIDE_BAR_LISTS[SIDE_BARS_KEYS.TRANSACTIONS].TITLE,
  },
];
