import { Badge, Empty, Popover } from 'antd';
import { Bell, CheckCheck } from 'lucide-react';

import {
  useGetAllNotificationsQuery,
  useReadAllNotificationsMutation,
  useReadSingleNotificationMutation,
} from '@/redux/apis/assets.api';
import { showErrorToast, showSuccessToast } from '@helpers/constants/toast.notification';
import { timeAgo } from '@helpers/services/time-ago';

import './notification.module.scss';

import { NotificationsProps } from './interface';

const NotificationPopOver = ({ open, setOpen }: NotificationsProps) => {
  const { data: notifications, refetch } = useGetAllNotificationsQuery(undefined, { pollingInterval: 60000 });
  const [readAllNotifications] = useReadAllNotificationsMutation();
  const [readSingleNotification] = useReadSingleNotificationMutation();

  const handleClick = async (type: 'single' | 'all', id?: string) => {
    try {
      if (type === 'single') {
        await readSingleNotification(id as string);
      } else {
        await readAllNotifications();
      }
      refetch();
      showSuccessToast('Notification marked as viewed');
    } catch (error) {
      refetch();
      showErrorToast(error);
    }
  };

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const count = notifications?.response.filter((item) => !item.isRead);
  const showMarkAll = notifications?.response.some((item) => !item.isRead);

  const content = (
    <div className="border-primary-1 radius-6 bg-white w-450 max-h-500 d-flex flex-column overflow-auto notification">
      <div
        className="p-y-20 p-x-24 d-flex align-center gap-5 justify-space-between w-450 bg-white border-primary-1 position-sticky top-0"
        style={{ borderTopLeftRadius: '6px', borderTopRightRadius: '6px', borderLeft: 0, borderRight: 0 }}
      >
        <p className="f-16-20-500-primary">Notifications</p>
        {notifications?.response && notifications?.response.length > 0 && showMarkAll && (
          <div
            className="d-flex align-center gap-2 cursor-pointer"
            onClick={() => {
              handleClick('all');
            }}
          >
            <CheckCheck size={16} className="f-14-16-400-secondary" />
            <p className="f-14-16-400-secondary">Mark all as read</p>
          </div>
        )}
      </div>
      <div className="overflow-y-scroll d-flex flex-column">
        {notifications?.response && notifications?.response?.length > 0 ? (
          notifications?.response.map((item) => (
            <div
              key={item._id}
              className={`p-r-32 p-l-16 p-y-20 d-flex gap-2 border-primary-1 ${item.isRead ? 'bg-white' : 'bg-brand'} cursor-pointer`}
              onClick={() => {
                handleClick('single', item._id);
              }}
            >
              {!item.isRead && <div className="min-w-10 min-h-10 w-10 h-10 radius-100 bg-brand-secondary m-t-6" />}
              <div className="d-flex flex-column gap-6">
                <p className="f-14-20-400-primary">{item.message}</p>
                <p className="f-12-16-400-tertiary">{timeAgo(item.createdAt)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 d-flex align-center justify-center w-450">
            <Empty imageStyle={{ width: '70px', height: '70px' }} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      style={{ zIndex: '10' }}
      placement="bottomRight"
      arrow={false}
      className="notification"
      styles={{
        body: { width: '450px', maxHeight: '500px' },
      }}
    >
      <div className={`p-10 h-40 w-40 d-flex align-center justify-center ${open ? 'bg-brand' : 'bg-white'} radius-100`}>
        <Bell
          className={`${open ? 'icon-brand-secondary' : 'icon-primary'} cursor-pointer`}
          onClick={toggleOpen}
          size={20}
        />
        <Badge
          count={count?.length ?? 0}
          style={{
            backgroundColor: '#ED1515',
            width: 20,
            height: 20,
            lineHeight: '20px',
            fontSize: '12px',
            color: '#fff',
            position: 'absolute',
            top: '-23px',
            right: '-8px',
            padding: '0',
          }}
        />
      </div>
    </Popover>
  );
};

export default NotificationPopOver;
