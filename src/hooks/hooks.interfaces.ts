import React, { SetStateAction } from 'react';

import { Document } from '@components/asset-details/interface';
import { ActionType, DocType } from '@components/modal/interface';
import { AssetInterface } from '@redux/interfaces/assets.interface';

export interface UseFilteredAssetsProps {
  assetData: AssetInterface[];
}

export interface UseModalProps {
  openModal: (type: string, actionType: ActionType, approval?: boolean) => void;
  setIsModalPreview: React.Dispatch<SetStateAction<boolean>>;
  setSelectedDocument: React.Dispatch<SetStateAction<Document | null>>;
  setPreviewModalType: React.Dispatch<SetStateAction<DocType>>;
}
