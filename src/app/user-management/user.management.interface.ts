export interface UserManagementInterface {
  id: string;
  username: string;
  userId: string;
  email: string;
  walletAddress: string;
  registeredDate: string;
  accountStatus: AccountStatus;
  transactions: number;
}

export type AccountStatus = "Active" | "Inactive" | "Suspended";
