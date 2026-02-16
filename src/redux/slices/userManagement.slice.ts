import { createSlice } from '@reduxjs/toolkit';

import { REDUX_SLICES } from '@helpers/constants/redux-silces';

import { UserInterface } from '../interfaces/user-management.interface';

interface UserManagementState {
  userList: UserInterface[];
}

const initialState: UserManagementState = {
  userList: [],
};

const userManagementSlice = createSlice({
  name: REDUX_SLICES.USER_MANAGEMENT,
  initialState,
  reducers: {},
});

export const userManagementReducer = userManagementSlice.reducer;
