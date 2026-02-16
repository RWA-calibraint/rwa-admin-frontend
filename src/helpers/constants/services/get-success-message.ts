import { ActionType } from '@components/modal/interface';

import { ASSET_MODAL_TYPE } from '../asset.status';
import { DOCUMENT_MODAL_TYPE } from '../document-type';
import { SUCCESS_MESSAGES } from '../succes-messages';

export const getSuccessMessage = (actionType: ActionType): string => {
  switch (actionType) {
    case ASSET_MODAL_TYPE.APPROVE:
      return SUCCESS_MESSAGES.ASSET_APPROVED;
    case ASSET_MODAL_TYPE.LIST:
      return SUCCESS_MESSAGES.ASSET_LIST;
    case ASSET_MODAL_TYPE.REJECT:
      return SUCCESS_MESSAGES.ASSET_REJECTED;
    case ASSET_MODAL_TYPE.HOLD:
      return SUCCESS_MESSAGES.ASSET_HOLD;
    case ASSET_MODAL_TYPE.DELIST:
      return SUCCESS_MESSAGES.ASSET_DELISTED;
    case ASSET_MODAL_TYPE.DELETE:
      return SUCCESS_MESSAGES.ASSET_DELETED;
    case DOCUMENT_MODAL_TYPE.APPROVE:
      return SUCCESS_MESSAGES.DOCUMENT_APPROVED;
    case DOCUMENT_MODAL_TYPE.REJECT:
      return SUCCESS_MESSAGES.DOCUMENT_REJECTED;
    case DOCUMENT_MODAL_TYPE.REMOVE:
      return SUCCESS_MESSAGES.DOCUMENT_APPROVAL_REMOVED;
    default:
      return '';
  }
};
