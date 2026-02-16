// slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { REDUX_SLICES } from "@helpers/constants/redux-silces";

const initialState = {
  userList: [
    {
      id: "UM001",
      username: "johndoe123",
      userId: "UM001",
      email: "johndoe@example.com",
      walletAddress: "0x12345abcde67890fghijk12345lmnopqr",
      registeredDate: "15:01:2024",
      accountStatus: "Active",
      transactions: 15,
      key: 1,
    },
    {
      id: "UM002",
      username: "janesmith456",
      userId: "UM002",
      email: "janesmith@example.com",
      walletAddress: "0x98765zyxwv4321lkjihgfedcba09876",
      registeredDate: "12:03:2024",
      accountStatus: "Inactive",
      transactions: 8,
      key: 2,
    },
    {
      id: "UM003",
      username: "emilyclark789",
      userId: "UM003",
      email: "emilyclark@example.com",
      walletAddress: "0xabcde12345fghijk67890lmnop123456",
      registeredDate: "19:05:2024",
      accountStatus: "Active",
      transactions: 5,
      key: 3,
    },
    {
      id: "UM004",
      username: "michaelbrown012",
      userId: "UM004",
      email: "michaelbrown@example.com",
      walletAddress: "0x987654321fedcba0987654321abcdef012",
      registeredDate: "25:06:2024",
      accountStatus: "Active",
      transactions: 20,
      key: 4,
    },
    {
      id: "UM005",
      username: "sarahjones345",
      userId: "UM005",
      email: "sarahjones@example.com",
      walletAddress: "0x1234abcdef67890ghijklm12345nopqrs",
      registeredDate: "30:08:2024",
      accountStatus: "Suspended",
      transactions: 3,
      key: 5,
    },
    {
      id: "UM006",
      username: "jamesmiller678",
      userId: "UM006",
      email: "jamesmiller@example.com",
      walletAddress: "0x54321zyxwv9876abcdef09876lmnopqr",
      registeredDate: "10:11:2024",
      accountStatus: "Active",
      transactions: 12,
      key: 6,
    },
  ],
};

const UserManagementAssetsSlice = createSlice({
  name: REDUX_SLICES.USER_MANAGEMENT,
  initialState,
  reducers: {},
});

export const userManagementAssetsReducer = UserManagementAssetsSlice.reducer;
