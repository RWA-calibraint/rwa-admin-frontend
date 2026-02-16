import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { REDUX_SLICES } from "@helpers/constants/redux-silces";

const initialState = {
  totalDataCount: 0,
};

const PaginationSlice = createSlice({
  name: REDUX_SLICES.PAGINATION,
  initialState,
  reducers: {
    updateTotalDataCount: (state, action: PayloadAction<number>) => {
      state.totalDataCount = action.payload;
    },
  },
});

export const { updateTotalDataCount } = PaginationSlice.actions;
export const PaginationReducer = PaginationSlice.reducer;
