export type Credentials = {
  email: string;
  password: string;
};

export type ConfirmSignup = Pick<Credentials, 'email'> & {
  confirmationCode: number;
};

export type ConfirmForgotPassword = Credentials & {
  confirmationCode: number;
};

export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export type AuthResponse = {
  admin: Credentials;
  token: string;
};

export interface SearchParamsType {
  page?: string | number;
  size?: string | number;
  status?: string;
  search?: string;
  [key: string]: string | number | undefined;
}

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};
