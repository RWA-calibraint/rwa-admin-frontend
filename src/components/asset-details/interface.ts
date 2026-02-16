import { SetStateAction } from 'react';

import { ASSET_STATUS } from '@helpers/constants/asset.status';
import { STATUS } from '@helpers/constants/document-status';
import { DOCUMENT_TYPE } from '@helpers/constants/document-type';

import { DocType, ActionType } from '../modal/interface';

export type DocumentTypes =
  | DOCUMENT_TYPE.LAB_REPORTS
  | DOCUMENT_TYPE.CERTIFICATES
  | DOCUMENT_TYPE.LEGAL_HEIR_CERTIFICATES
  | DOCUMENT_TYPE.AWARDS
  | DOCUMENT_TYPE.PROOF_OF_OWNERSHIP
  | DOCUMENT_TYPE.NOC
  | DOCUMENT_TYPE.OTHERS;

export type Status = STATUS.APPROVED | STATUS.PENDING | STATUS.REJECTED;
export interface Document {
  _id: string;
  type: DocumentTypes;
  documentName: string;
  assetId: string;
  documentUrl: string;
  status: Status;
}

type AssetStatus =
  | ASSET_STATUS.LIVE
  | ASSET_STATUS.GOING_LIVE
  | ASSET_STATUS.NEWLY_ADDED
  | ASSET_STATUS.RE_SUBMITTED
  | ASSET_STATUS.SOLD
  | ASSET_STATUS.HOLD
  | ASSET_STATUS.DELISTED
  | ASSET_STATUS.DELETED
  | ASSET_STATUS.REJECTED;

interface SellerId {
  firstName: string;
  lastName: string;
  createdAt: string;
  status: string;
  walletAddress: string;
}
interface Category {
  category: string;
  _id: string;
}

export interface PriceHistory {
  _id: string;
  year: string;
  price: string;
}
export interface AssetData {
  _id: string;
  assetId: string;
  name: string;
  description: string;
  price: number;
  pricePerToken: number;
  priceHistory: PriceHistory[];
  sellerId: SellerId;
  category: Category;
  images: string[];
  coverImage: string;
  status: AssetStatus;
  country: string;
  state: string;
  address: string;
  pincode: string;
  locationUrl?: string;
  isVerified: boolean;
  tokens: number;
  adminRemarks?: string;
  listedDate: string;
  verificationDate: string;
  documents: Document[];
  soldTokens: number;
  __v: number;
  favourites?: number;
  city: string;
  createdAt: string;
  likesCount: number;
  viewsCount: number;
  availableTokens: number;
  isAdminAsset: boolean;
  listings: ListingInterface[];
  listingActivity: ListingInterface[];
  assetOwners: OwnershipInterface[];
  contractTokenId?: string;
  ContractListingId?: string;
}

export interface UserDetailsData {
  _id?: string;
  email?: string;
  pasword?: string;
  phoneNumber?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  building?: string;
  postalCode?: string;
  stripeAccountId?: string;
  rewardPoints?: number;
}

export interface ListingInterface {
  _id: string;
  assetId: string;
  sellerId: UserDetailsData;
  tokenPrice: number;
  tokens: number;
  createdTokens: number;
  createdTokenPrice: number;
  userAsset?: boolean;
  createdAt: string;
  deletedAt: string;
}

export interface OwnershipInterface {
  name: string;
  tokenCount: number;
  purchasedDate: string;
}

export interface AssetDetailProps {
  assetData: AssetData;
  refetch: () => Promise<unknown>;
}

export interface LeftSectionProps {
  assetData: AssetData;
  images: string[];
  documents: Document[];
  tokens: number;
  status: ASSET_STATUS;
  selectedImage: string | undefined | null;
  setSelectedImage: React.Dispatch<SetStateAction<string | undefined | null>>;
  selectedDocument: Document | null;
  setIsModalPreview: React.Dispatch<SetStateAction<boolean>>;
  setPreviewModalType: React.Dispatch<SetStateAction<DocType>>;
  approveAsset: () => void;
  listAsset: () => void;
}

export interface RightSectionProps {
  assetData: AssetData;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<SetStateAction<boolean>>;
  openModal: (type: string, actionType: ActionType, approval?: boolean) => void;
  setIsModalPreview: React.Dispatch<SetStateAction<boolean>>;
  setSelectedDocument: React.Dispatch<SetStateAction<Document | null>>;
  selectedDocument: Document | null;
  setPreviewModalType: React.Dispatch<SetStateAction<DocType>>;
  setModalPreviewDoc?: React.Dispatch<SetStateAction<Document | null>>;
}

export interface PriceChartProps {
  priceHistory: PriceHistory[];
  showInDashboard?: boolean;
  type?: string;
  onChange?: (value: string) => void;
  isLoading?: boolean;
}

interface PriceData {
  radius: [number, number, number, number];
  dataKey: string;
  name: string;
  color: string;
  value: number;
  payload: {
    year: string;
    price: string;
  };
  stroke: string;
  strokeWidth: string;
  hide: boolean;
}
export interface PriceChartPayload {
  active?: boolean;
  payload?: PriceData[];
  label?: string;
}
