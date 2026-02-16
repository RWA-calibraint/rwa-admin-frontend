import { FormInstance, UploadFile } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { Descendant } from 'slate';

export interface AssetHistoryType {
  key: number;
  listedDate: string | null;
  price: number;
  hasAddedRow: boolean;
}

export interface EditAssetHistoryProps {
  form?: FormInstance<unknown>;
  rows: AssetHistoryType[];
  setRows: Dispatch<SetStateAction<AssetHistoryType[]>>;
}

export interface CategoryOptions {
  label: string;
  value: string;
  key: string;
}
export interface EditAssetDetailsProps {
  form?: FormInstance<unknown>;
  categoryOptions: CategoryOptions[];
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  setCategory?: React.Dispatch<React.SetStateAction<string>>;
  description: Descendant[];
  setDescription: Dispatch<SetStateAction<Descendant[]>>;
  isTokensSold?: boolean;
  assetPrice?: number;
  assetTokens?: number;
  onTokenError?: (hasError: boolean) => void;
}
