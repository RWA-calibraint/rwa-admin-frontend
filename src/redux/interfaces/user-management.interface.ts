import { USER_STATUS } from '@helpers/constants/user-account-status';

export interface UserInterface {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  status: USER_STATUS;
  email: string;
  password: string;
  cognitoSubId: string;
  createdAt: string;
  updatedAt: string;
  suspendExpiryAt: string;
  walletAddress: string;
  phoneNumber: string;
  transactions: number;
  address: string;
  country: string;
  city: string;
  state: string;
  postalCode: string;
  building: string;
  description: string;
  __v: number;
}
export interface UserApiResponse {
  response_code: number;
  response_status: string;
  response: {
    data: UserInterface[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  response_error: null;
}

export interface UpdateUserAsBlockOrActiveApiResponse {
  response_code: number;
  response_status: string;
  response: string;
  response_error: null;
}

export interface UpdateUserAsBlockOrActiveParams {
  userId: string;
  bodyData: { status: USER_STATUS; description: string };
}

export interface UpdateUserAsSuspend {
  userId: string;
  bodyData: { suspendExpiryAt?: string; description: string };
}

export interface GetUserListParams {
  status?: string;
  search?: string;
  page?: number;
  size?: number;
  userId?: number;
}

export interface AssetListParams {
  status?: string;
  search?: string;
  category?: string;
  page?: number;
  size?: number;
  userId?: number;
  startDate?: string;
  endDate?: string;
}
