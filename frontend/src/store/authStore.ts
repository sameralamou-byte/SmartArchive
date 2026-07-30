import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clear: () => void;
}

/**
 * Phase 1: in-memory only (per the widget/design-system rule against
 * localStorage in generated artifacts, and to keep token handling simple
 * until the real auth flow is built out). A production build should
 * persist the refresh token in an httpOnly cookie set by the backend,
 * not in browser storage read by JS.
 */
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  clear: () => set({ accessToken: null, refreshToken: null }),
}));
