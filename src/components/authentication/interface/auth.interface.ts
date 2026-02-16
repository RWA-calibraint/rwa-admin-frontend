export type AuthAction =
  | { type: "login"; email: string; password: string }
  | { type: "signup"; email: string; password: string; confirmPassword: string }
  | { type: "confirmSignup"; email: string; code: string }
  | { type: "forgotPassword"; email: string }
  | { type: "resetPassword"; email: string; code: string; newPassword: string };

export interface AuthenticationParams {
  email: string;
  password: string;
  code: string;
}
