export enum TRANSACTION_METHOD {
  STRIPE = "stripe",
  WALLET = "wallet",
}

export enum TRANSACTION_STATUS {
  COMPLETED = "completed",
  PENDING = "pending",
  FAILED = "failed",
  REFUNDED = "refunded",
}
