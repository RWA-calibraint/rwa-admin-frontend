import '@ant-design/v5-patch-for-react-19';
import { CheckCircle2Icon, CircleAlert } from 'lucide-react';

import { ERROR_MESSAGE } from './error-mesage';
import { getNotificationInstance } from './notification-instance';

export const showSuccessToast = (message: string) => {
  const notification = getNotificationInstance();

  notification.open({
    message,
    icon: <CheckCircle2Icon style={{ color: 'green' }} />,
    placement: 'top',
    duration: 5,
    style: {
      textAlign: 'center',
      width: 350,
      borderRadius: '4px',
    },
  });
};

export const showErrorToast = (error: unknown) => {
  const notification = getNotificationInstance();

  let errorMessage;

  if (typeof error === 'string') errorMessage = error;
  if (error && typeof error === 'object') {
    if ('data' in error && typeof error.data === 'object' && error.data !== null) {
      errorMessage = (error.data as { message?: string }).message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
  }

  notification.open({
    message: errorMessage ?? ERROR_MESSAGE.DEFAULT,
    icon: <CircleAlert style={{ color: 'red' }} />,
    placement: 'top',
    duration: 5,
    style: {
      textAlign: 'center',
      width: 350,
      borderRadius: '4px',
      backgroundColor: '#FFF1F1',
    },
  });
};
