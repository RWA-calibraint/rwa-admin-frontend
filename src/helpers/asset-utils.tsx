import { ItemType } from 'antd/es/menu/interface';
import { CircleCheck, Pause, Pencil, Trash2, X } from 'lucide-react';

import { ASSET_MODAL_TYPE, ASSET_STATUS } from './constants/asset.status';

export const getMenuItems = (status: ASSET_STATUS, soldTokens: number, sellerStatus: string) => {
  let menuItems: ItemType[] = [];

  switch (status) {
    case ASSET_STATUS.NEWLY_ADDED:
    case ASSET_STATUS.RE_SUBMITTED: {
      menuItems = [
        {
          key: 'edit-asset',
          label: 'Edit Asset',
          icon: <Pencil className="h-16 w-16" />,
        },
        {
          key: 'reject-asset',
          label: 'Reject Asset',
          icon: <X className="h-16 w-16" />,
        },
        {
          key: 'hold-asset',
          label: 'Hold Asset',
          icon: <Pause className="h-16 w-16" />,
        },
        // {
        //   key: 'update-asset',
        //   label: 'Update Asset',
        //   icon: <CircleArrowUp className="h-16 w-16" />,
        // },
      ];
      break;
    }
    case ASSET_STATUS.HOLD: {
      menuItems = [
        {
          key: 'edit-asset',
          label: 'Edit Asset',
          icon: <Pencil className="h-16 w-16" />,
        },
        {
          key: 'reject-asset',
          label: 'Reject Asset',
          icon: <X className="h-16 w-16" />,
        },
        // {
        //   key: 'update-asset',
        //   label: 'Update Asset',
        //   icon: <CircleArrowUp className="h-16 w-16" />,
        // },
      ];
      break;
    }
    case ASSET_STATUS.LIVE: {
      menuItems = [
        // {
        //   key: 'edit-asset',
        //   label: 'Edit Asset',
        //   icon: <Pencil className="h-16 w-16" />,
        //   disabled: soldTokens > 0,
        // },
        // {
        //   key: 'delist-asset',
        //   label: 'Delist Asset',
        //   icon: <CircleX className="h-16 w-16" />,
        // },
        // {
        //   key: 'delete-asset',
        //   label: 'Delete Asset',
        //   icon: <Trash2 className="h-16 w-16" />,
        //   disabled: soldTokens > 0,
        // },
        // {
        //   key: 'update-asset',
        //   label: 'Update Asset',
        //   icon: <CircleArrowUp className="h-16 w-16" />,
        // },
      ];
      break;
    }
    case ASSET_STATUS.GOING_LIVE: {
      menuItems = [
        {
          key: 'edit-asset',
          label: 'Edit Asset',
          icon: <Pencil className="h-16 w-16" />,
        },
        {
          key: 'hold-asset',
          label: 'Hold Asset',
          icon: <Pause className="h-16 w-16" />,
        },
        {
          key: 'delete-asset',
          label: 'Delete Asset',
          icon: <Trash2 className="h-16 w-16" />,
        },
      ];
      break;
    }
    case ASSET_STATUS.DELISTED: {
      menuItems = [
        {
          key: 'edit-asset',
          label: 'Edit Asset',
          icon: <Pencil className="h-16 w-16" />,
          disabled: soldTokens > 0,
        },
        {
          key: 'list-asset',
          label: 'List Asset',
          icon: <CircleCheck className="h-16 w-16" />,
          disabled: sellerStatus !== 'active',
        },
        {
          key: 'delete-asset',
          label: 'Delete Asset',
          icon: <Trash2 className="h-16 w-16" />,
        },
      ];
      break;
    }
    default: {
      menuItems = [
        {
          key: 'edit-asset',
          label: 'Edit Asset',
          icon: <Pencil className="h-16 w-16" />,
        },
      ];
    }
  }

  return menuItems;
};

export function getStatusClass(status: string): string {
  if (status === ASSET_STATUS.LIVE || status === ASSET_STATUS.NEWLY_ADDED) {
    return 'bg-status-green border-status-outer-green-3';
  } else if (status === ASSET_STATUS.HOLD) {
    return 'bg-hold border-hold-3';
  } else if (status === ASSET_STATUS.RE_SUBMITTED || status === ASSET_STATUS.GOING_LIVE) {
    return 'bg-re-submitted border-resubmitted-3';
  } else {
    return 'bg-status-red border-status-outer-red-3';
  }
}

export const getStatus = (modalType: ASSET_MODAL_TYPE) => {
  switch (modalType) {
    case ASSET_MODAL_TYPE.HOLD:
      return ASSET_STATUS.HOLD;
    case ASSET_MODAL_TYPE.APPROVE:
      return ASSET_STATUS.GOING_LIVE;
    case ASSET_MODAL_TYPE.DELETE:
      return ASSET_STATUS.DELETED;
    case ASSET_MODAL_TYPE.DELIST:
      return ASSET_STATUS.DELISTED;
    case ASSET_MODAL_TYPE.LIST:
      return ASSET_STATUS.LIVE;
    case ASSET_MODAL_TYPE.REJECT:
      return ASSET_STATUS.REJECTED;
    case ASSET_MODAL_TYPE.TOKENS:
      return ASSET_STATUS.NEWLY_ADDED;

    default:
      return ASSET_STATUS.LIVE;
  }
};
