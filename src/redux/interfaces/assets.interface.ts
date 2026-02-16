import { AssetData, Document } from '@components/asset-details/interface';
import { ASSET_STATUS } from '@helpers/constants/asset.status';

interface categoryInterface {
  _id: string;
  category: string;
}
export interface AssetInterface {
  _id: string;
  assetId: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  category: categoryInterface;
  listedDate: string;
  images: string[];
  coverImage: string;
  documents: Document[];
  status: string;
  country: string;
  state: string;
  pincode: string;
  qrCode: string | null;
  tag: string | null;
  tokens: number;
  isVerified: boolean;
  verifiedBy: string | null;
  verificationDate: string | null;
  verificationRemarks: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  adminRemarks: string;
  rejectionCount: number;
}

interface assetData {
  data: AssetInterface[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface AssetsResponse {
  response_code: number;
  response_status: string;
  response: assetData;
  response_error: null;
}
export interface AssetResponse {
  response_code: number;
  response_status: string;
  response: AssetData;
  response_error: null;
  data: {
    assetId: string;
    contractTokenId: string;
  };
}
export interface InitialAssetsState {
  approvedAssets: AssetInterface[];
  pendingAssets: AssetInterface[];
  rejectedAssets: AssetInterface[];
}

interface categoryData {
  _id: string;
  category: string;
}
export interface categoryResponse {
  response_code: number;
  response_status: string;
  response: categoryData[];
  response_error: null;
  approvedAssets: AssetInterface[];
  pendingAssets: AssetInterface[];
  rejectedAssets: AssetInterface[];
}

export interface VerifyAsset {
  bodyData: {
    assetId: string;
    status: ASSET_STATUS;
    remarks?: string;
    listedDate?: Date | null;
    tokens?: number;
    isfeaturedAsset?: boolean;
  };
}

export interface UpdateAssetApiResponse {
  response_code: number;
  response_status: string;
  response: string;
  response_error: null;
}

export interface AnalyzeImage {
  metadata: {
    width: number;
    height: number;
    format: string;
  };
  quality: {
    overallScore: number;
    qualityLevel: string;
  };
  recommendation: string;
}
export interface Image {
  data: FormData;
}
export interface AnalyzeImageResponse {
  response_code: number;
  response_status: string;
  response: AnalyzeImage;
  response_error: null;
}
