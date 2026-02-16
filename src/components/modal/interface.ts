import React, { SetStateAction } from 'react';

import { getStatus } from '@helpers/asset-utils';
import { ASSET_MODAL_TYPE, ASSET_STATUS, ASSSET_ACTION, PAYMENT_STATUS } from '@helpers/constants/asset.status';
import { STATUS } from '@helpers/constants/document-status';
import { DOC_TYPE, DOCUMENT_MODAL_TYPE } from '@helpers/constants/document-type';
import { USER_STATUS } from '@helpers/constants/user-account-status';

import { AssetData, Document } from '../asset-details/interface';

export type ActionType =
  | ASSET_MODAL_TYPE.APPROVE
  | ASSET_MODAL_TYPE.DELETE
  | ASSET_MODAL_TYPE.DELIST
  | ASSET_MODAL_TYPE.HOLD
  | ASSET_MODAL_TYPE.RELEASE
  | ASSET_MODAL_TYPE.LIST
  | ASSET_MODAL_TYPE.REJECT
  | ASSET_MODAL_TYPE.TOKENS
  | ASSET_MODAL_TYPE.EDIT
  | DOCUMENT_MODAL_TYPE.APPROVE
  | DOCUMENT_MODAL_TYPE.REJECT
  | DOCUMENT_MODAL_TYPE.REMOVE
  | USER_STATUS.ACTIVE
  | USER_STATUS.BLOCKED
  | USER_STATUS.SUSPENDED
  | PAYMENT_STATUS.REFUND
  | USER_STATUS.TERMINATED;
export interface ModalProps {
  type: string;
  isOpen: boolean;
  setIsOpen?: React.Dispatch<SetStateAction<boolean>>;
  actionType: ActionType;
  className?: string;
  onDateChange?: (value: string) => void;
  hasSuspensionPeriod?: boolean;
  remarks?: boolean;
  name?: string;
  closable?: boolean;
  issueTokens?: boolean;
  isApproveAssetModal?: boolean;
  remarksText?: string | undefined;
  setRemarksText?: React.Dispatch<SetStateAction<string>>;
  tokens?: string;
  setTokens?: React.Dispatch<SetStateAction<string>>;
  listedDate?: Date | null;
  setListedDate?: React.Dispatch<SetStateAction<Date | null>>;
  handleConfirm: () => void;
  handleCancel: () => void;
  assetId?: string;
  price?: number;
  featuredAsset?: boolean;
  setFeaturedAsset?: React.Dispatch<SetStateAction<boolean>>;
  loading?: boolean;
}
interface ContentWithoutFn {
  heading: string;
  description: string;
  handleConfirm?: () => void;
  handleCancel?: () => void;
}

export interface ModalContent {
  pending: {
    approve: ContentWithoutFn;
    hold: ContentWithoutFn;
    release: ContentWithoutFn;
    reject: ActionContent;
    list: ActionContent;
    delete: ActionContent;
  };

  approved: {
    approve: ContentWithoutFn;
    delist: ContentWithoutFn;
    reject: ActionContent;
    delete: ActionContent;
    hold: ContentWithoutFn;
  };

  rejected: {
    approve: ActionContent;
    delete: ActionContent;
    reject: ContentWithoutFn;
  };

  users: {
    [USER_STATUS.SUSPENDED]: {
      heading: string;
      showBlockDate: boolean;
      description: (name: string) => string;
    };

    [USER_STATUS.TERMINATED]: {
      heading: string;
      description: (name: string) => string;
    };
    [USER_STATUS.ACTIVE]: {
      heading: string;
      description: (name: string) => string;
    };
  };

  transactions: {
    approve: ActionContent;
  };
  assets: {
    hold: ContentWithoutFn;
    reject: ContentWithoutFn;
    approve: ContentWithoutFn;
    tokens: ContentWithoutFn;
    delist: ContentWithoutFn;
    delete: ContentWithoutFn;
    list: ContentWithoutFn;
  };
  documents: {
    [DOCUMENT_MODAL_TYPE.REMOVE]: ContentWithoutFn;
    [DOCUMENT_MODAL_TYPE.REJECT]: ContentWithoutFn;
    [DOCUMENT_MODAL_TYPE.APPROVE]: ContentWithoutFn;
  };
}

export type ActionContent = {
  heading: string;
  description: string | ((name: string) => string);
};

export type ModalTypeContent = {
  [key: string]: ActionContent;
};

export type DocType = DOC_TYPE.DOCUMENT | DOC_TYPE.IMAGE;
export interface PreviewModalProps {
  type: DocType;
  selectedImage?: string | undefined | null;
  selectedDocument?: Document | null;
  isOpen: boolean;
  handleApprove?: () => void;
  handleReject?: () => void;
  handleClose: () => void;
  closable: boolean;
  status?: ASSET_STATUS;
}

export interface AssetPayload {
  assetId: string | undefined;
  tokens?: number;
  remarks?: string;
  listedDate?: string;
  status: ReturnType<typeof getStatus>;
  isVerified?: boolean;
}

export interface DocumentPayload {
  documentId: string;
  status: STATUS;
  remarks?: string;
  isVerified?: boolean;
}

export interface TokenModalProps {
  type: ASSSET_ACTION.MINT | ASSSET_ACTION.BURN | ASSSET_ACTION.UPDATE;
  isOpen: boolean;
  className?: string;
  handleCancel: () => void;
  handleConfirm: () => void;
  closable?: boolean;
  price: number;
  tokens: number;
  issuedTokens: number;
  currentValue: number;
  setTokens: React.Dispatch<SetStateAction<number>>;
  availableTokens: number;
  setPrice: React.Dispatch<SetStateAction<number>>;
  assetData: AssetData;
}

export interface TokenState {
  mint: {
    tokens: number;
    price: number;
  };
  burn: {
    tokens: number;
    price: number;
  };
}
