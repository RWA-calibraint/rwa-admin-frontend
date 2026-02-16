'use client';

import { App } from 'antd';
import { useEffect } from 'react';

import { setNotificationInstance } from '@/helpers/constants/notification-instance';

export default function NotificationProvider() {
  const { notification } = App.useApp();

  useEffect(() => {
    setNotificationInstance(notification);
  }, [notification]);

  return null;
}
