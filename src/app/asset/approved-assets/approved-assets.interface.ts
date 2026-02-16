export interface ApprovedAssetsInterface {
  id: string;
  assetId: string;
  images: string[];
  name: string;
  category: string;
  sellerName: string;
  listedDate: string;
  totalViews: number;
  price: string;
  approvalStatus: ApprovalStatus;
  key: string;
  coverImage: string;
}

export type ApprovalStatus = 'Live' | 'Sold' | 'Deleted' | 'Delisted';
