// slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { REDUX_SLICES } from "@helpers/constants/redux-silces";

import { transactionData } from "./transactions.mockdata";

const initialState = {
  transactionsList: transactionData,
};

const TransactionsSlice = createSlice({
  name: REDUX_SLICES.TRANSACTIONS,
  initialState,
  reducers: {},
});

export const TransactionsReducer = TransactionsSlice.reducer;
