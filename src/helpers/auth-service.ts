import { apiClient } from "./api-client";
import {
  AuthResponse,
  ConfirmForgotPassword,
  ConfirmSignup,
  Credentials,
} from "./interface";

type Email = Pick<Credentials, "email">;

export const authService = {
  signup: (credentials: Credentials) =>
    apiClient.post<AuthResponse, Credentials>("/auth/signin", credentials),

  confirmSignup: (credentials: ConfirmSignup) =>
    apiClient.post<AuthResponse, ConfirmSignup>(
      "/auth/confirm-signup",
      credentials
    ),

  signin: (credentials: Credentials) =>
    apiClient.post<AuthResponse, Credentials>("/auth/signin", credentials),

  forgotPassword: (credential: Email) =>
    apiClient.post<AuthResponse, Email>("/auth/forgot-password", credential),

  confirmForgotPassword: (credentials: ConfirmForgotPassword) =>
    apiClient.post<AuthResponse, ConfirmForgotPassword>(
      "/auth/confirm-forgot-password",
      credentials
    ),
};
