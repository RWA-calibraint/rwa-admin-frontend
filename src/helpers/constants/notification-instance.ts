import type { NotificationInstance } from 'antd/es/notification/interface';

let notificationInstance: NotificationInstance | null = null;

export const setNotificationInstance = (instance: NotificationInstance) => {
  notificationInstance = instance;
};

export const getNotificationInstance = () => {
  if (!notificationInstance) {
    throw new Error('Notification instance not initialized');
  }

  return notificationInstance;
};
