import { apiClient } from "./client";
import type { TokenResponse, UserRead } from "./types";

export async function login(
  email: string,
  password: string,
  rememberMe = false,
): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/auth/login", {
    email,
    password,
    remember_me: rememberMe,
  });
  return data;
}

export async function registerAccount(payload: {
  email: string;
  password: string;
  full_name: string;
  organization_name: string;
}): Promise<UserRead> {
  const { data } = await apiClient.post<UserRead>("/auth/register", payload);
  return data;
}

export async function fetchCurrentUser(): Promise<UserRead> {
  const { data } = await apiClient.get<UserRead>("/users/me");
  return data;
}

export async function verifyEmail(token: string): Promise<{ email_verified: boolean }> {
  const { data } = await apiClient.post<{ email_verified: boolean }>("/auth/verify-email", { token });
  return data;
}

export async function resendVerification(email: string): Promise<void> {
  await apiClient.post("/auth/resend-verification", { email });
}

export async function refreshSession(): Promise<string> {
  const { data } = await apiClient.post<TokenResponse>("/auth/refresh", {});
  return data.access_token;
}

export async function logoutAccount(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function forgotPassword(email: string): Promise<void> {
  await apiClient.post("/auth/forgot-password", { email });
}

export async function resetPassword(
  token: string,
  password: string,
  passwordConfirm: string,
): Promise<void> {
  await apiClient.post("/auth/reset-password", {
    token,
    password,
    password_confirm: passwordConfirm,
  });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  newPasswordConfirm: string,
): Promise<void> {
  await apiClient.post("/auth/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
    new_password_confirm: newPasswordConfirm,
  });
}
