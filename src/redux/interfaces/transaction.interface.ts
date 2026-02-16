import {
  TRANSACTION_METHOD,
  TRANSACTION_STATUS,
} from "@helpers/constants/transactions";

export interface Transaction {
  _id: string;
  transactionId: string;
  transactionDate: Date;
  tokenCount: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  assetId: string;
  assetName: string;
  amount: number;
  paymentStatus: TRANSACTION_STATUS;
  paymentMethod: TRANSACTION_METHOD;
}

export interface TransactionsApiResponse {
  response_code: number;
  response_status: string;
  response: {
    data: Transaction[];
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
  response_error: null;
}

export interface GetTransactionParams {
  page?: number;
  search?: string;
  size?: number;
  from?: string;
  to?: string;
  paymentStatus?: string;
  paymentMethod?: string;
}
