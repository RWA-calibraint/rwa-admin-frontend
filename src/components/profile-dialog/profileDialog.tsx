import { Avatar, Divider, Popover } from 'antd';
import Cookies from 'js-cookie';
import { LogOut, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { capitalizeFistLetter } from '@/helpers/services/text-formatter';
import { useGetAdminProfileQuery } from '@/redux/apis/admin.api';

const ProfilePopover: React.FC = () => {
  const router = useRouter();
  const { data: adminProfileResponse, isLoading } = useGetAdminProfileQuery({});

  const handleLogout = () => {
    Cookies.remove('token', { path: '/' });
    router.replace('/login');
    window.location.reload();
  };

  const content = (
    <div className="d-flex flex-column">
      <div className="p-y-12 p-x-14 d-flex flex-column gap-1">
        <p className="f-14-20-500-primary">
          {!isLoading &&
            `${capitalizeFistLetter(adminProfileResponse?.response?.firstName)} ${adminProfileResponse?.response?.lastName}`}
        </p>
        <span className="f-14-20-400-hint">{!isLoading && adminProfileResponse?.response?.email}</span>
      </div>
      <Divider className="custom-divider" />
      <div className="d-flex flex-column p-x-8 p-y-8 gap-2">
        <button
          className="p-x-6 p-y-8 d-flex gap-2 align-center bg-white cursor-pointer"
          style={{ border: 'none' }}
          onClick={() => router.push('/profile')}
        >
          <User size={18} /> <span className="f-14-20-400-primary">Profile</span>
        </button>
      </div>
      <div className="p-x-8 p-y-8">
        <button
          className="p-x-6 p-y-8 d-flex gap-2 align-center bg-white cursor-pointer"
          style={{ border: 'none' }}
          onClick={handleLogout}
        >
          <LogOut size={18} /> <span className="f-14-20-400-primary">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <Popover content={content} trigger="click" style={{ zIndex: '1100' }} placement="bottomRight">
      <Avatar size="large" className="custom-ant-avatar cursor-pointer">
        <Image src="/profile.png" alt="Profile Picture" width={70} height={70} />
      </Avatar>
    </Popover>
  );
};

export default ProfilePopover;
