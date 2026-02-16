// slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { REDUX_SLICES } from "@helpers/constants/redux-silces";

const initialState = {
  transactionsList: [
    {
      id: "TXN001",
      transactionId: "TXN001",
      buyerName: "John Doe",
      sellerName: "Jane Smith",
      assetName: "Classical Art Piece",
      amount: "$500",
      paymentStatus: "Successful",
      paymentMethod: "Stripe",
      transactionDate: "07-01-2025",
      assetStatus: "Shipped",
      commission: "$50",
      payoutStatus: "Paid",
      refundStatus: "Not refunded",
      key: 1,
    },
    {
      id: "TXN002",
      transactionId: "TXN002",
      buyerName: "Emily Clark",
      sellerName: "Robert Lee",
      assetName: "Antique Vase",
      amount: "1.9544 ETH",
      paymentStatus: "Pending",
      paymentMethod: "Wallet",
      transactionDate: "08-01-2025",
      assetStatus: "Pending",
      commission: "$150",
      payoutStatus: "Pending",
      refundStatus: "Refunded",
      key: 2,
    },
  ],
};

const TransactionsSlice = createSlice({
  name: REDUX_SLICES.TRANSACTIONS,
  initialState,
  reducers: {},
});

export const TransactionsReducer = TransactionsSlice.reducer;
