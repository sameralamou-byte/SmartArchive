import { create } from "zustand";

import { useSessionDocumentsStore } from "./sessionDocuments";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  email_verified: boolean;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: AuthUser) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  clear: () => {
    useSessionDocumentsStore.getState().clear();
    set({ accessToken: null, user: null });
  },
}));
