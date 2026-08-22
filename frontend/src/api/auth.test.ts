import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "../store/authStore";
import { changePassword, login, logoutAccount, refreshSession } from "./auth";
import { apiClient, refreshClient } from "./client";

describe("auth API credentials", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    useAuthStore.getState().clear();
  });

  beforeEach(() => {
    useAuthStore.getState().clear();
  });

  it("posts login, refresh, logout, and change-password with withCredentials", async () => {
    const post = vi.spyOn(apiClient, "post").mockResolvedValue({
      data: { access_token: "access", token_type: "bearer" },
    });

    expect(apiClient.defaults.withCredentials).toBe(true);
    expect(refreshClient.defaults.withCredentials).toBe(true);

    await login("alex@example.com", "a-strong-password-123", false);
    await refreshSession();
    await logoutAccount();
    await changePassword("current-password-123", "a-new-password-456", "a-new-password-456");

    expect(post.mock.calls.map((call) => call[0])).toEqual([
      "/auth/login",
      "/auth/refresh",
      "/auth/logout",
      "/auth/change-password",
    ]);
    expect(post.mock.calls[0][1]).not.toHaveProperty("refresh_token");
    expect(post.mock.calls[3][1]).not.toHaveProperty("refresh_token");
    expect(useAuthStore.getState()).not.toHaveProperty("refreshToken");
    expect(window.localStorage.getItem("refresh_token")).toBeNull();
    expect(window.sessionStorage.getItem("refresh_token")).toBeNull();
    expect(window.localStorage.getItem("access_token")).toBeNull();
  });
});
