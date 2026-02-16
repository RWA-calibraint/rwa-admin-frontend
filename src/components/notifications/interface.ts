import { SetStateAction } from 'react';

export interface NotificationsProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}
