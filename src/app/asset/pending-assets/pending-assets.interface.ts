export interface PendingAssetsInterface {
  id: string;
  assetId: string;
  images: string[];
  assetName: string;
  category: string;
  sellerName: string;
  submittedDate: string;
  submissionStatus: SubmissionStatus;
  adminRemarks: string;
  coverImage: string;
  createdAt: Date;
}

export type SubmissionStatus = 'Newly Added' | 'Resubmission';
