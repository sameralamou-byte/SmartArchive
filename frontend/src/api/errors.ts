import axios from "axios";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) return fallback;
  if (error.response?.status === 429) {
    return "Too many attempts. Try again shortly.";
  }
  const detail = error.response?.data?.detail;
  if (typeof detail === "string" && detail.trim()) return detail;
  return fallback;
}

export function isUnauthorized(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

export function isConflict(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 409;
}

export function isForbidden(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 403;
}

export function isEmailNotVerified(error: unknown): boolean {
  if (!axios.isAxiosError(error) || error.response?.status !== 403) return false;
  const data = error.response.data as { code?: string; detail?: { code?: string } | string };
  if (data?.code === "email_not_verified") return true;
  return typeof data?.detail === "object" && data.detail?.code === "email_not_verified";
}

export function isRateLimited(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 429;
}
