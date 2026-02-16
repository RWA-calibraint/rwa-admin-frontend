'use client';
import { Header } from 'antd/es/layout/layout';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import NotificationPopOver from '../notifications/notification-popover';
import ProfileDropdown from '../profile-dialog/profileDialog';

const Navbar = () => {
  const pathName = usePathname();
  const [open, setOpen] = useState<boolean>(false);
  const getTitle = () => {
    if (pathName.includes('pending-asset')) return 'Pending Asset';
    if (pathName.includes('approved-asset')) return 'Approved Asset';
    if (pathName.includes('rejected-asset')) return 'Rejected Asset';
    if (pathName.includes('dashboard')) return 'Dashboard';
    if (pathName.includes('user-management')) return 'User management';
    if (pathName.includes('transactions')) return 'Transactions';
    if (pathName.includes('create-asset')) return 'Submit New Asset';
    if (pathName.includes('asset-edit')) return 'Edit Asset';
    if (pathName.includes('profile')) return 'Profile';
    if (pathName.includes('administrators')) return 'Administrators';

    return 'Asset Details';
  };

  return (
    <Header>
      <h1 className="heading">{getTitle()}</h1>
      <div className="heading-menu">
        <NotificationPopOver open={open} setOpen={setOpen} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ProfileDropdown />
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
