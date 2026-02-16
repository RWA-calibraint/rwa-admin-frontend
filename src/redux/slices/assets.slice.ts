import { createSlice } from "@reduxjs/toolkit";

import { REDUX_SLICES } from "@helpers/constants/redux-silces";

const assetInitialState = {};

const assetsSlice = createSlice({
  name: REDUX_SLICES.ASSETS,
  initialState: assetInitialState,
  reducers: {},
});

export const assetsReducer = assetsSlice.reducer;
