export interface TransactionsListInterface {
  id: string;
  transactionId: string;
  buyerName: string;
  sellerName: string;
  assetName: string;
  amountUSD: string;
  amountETH: string;
  tokensBrought: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionDate: string;
  assetStatus: AssetStatus;
  commission: string;
  payoutStatus: PayoutStatus;
  refundStatus: RefundStatus;
  key: number;
}

export enum PaymentStatus {
  successful = "Successful",
  pending = "Pending",
  failed = "Failed",
}

export type PaymentMethod = "Stripe" | "Wallet";
export type RefundStatus = "Refunded" | "Not refunded";
export type AssetStatus = "Shipped" | "Pending" | "Not Shipped";
export type PayoutStatus = "Paid" | "Pending" | "Failed";
