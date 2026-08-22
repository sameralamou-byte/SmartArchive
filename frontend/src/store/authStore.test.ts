import { beforeEach, describe, expect, it } from "vitest";

import { useAuthStore } from "./authStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().clear();
  });

  it("starts with no access token", () => {
    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state).not.toHaveProperty("refreshToken");
  });

  it("setAccessToken stores the access token only", () => {
    useAuthStore.getState().setAccessToken("access-123");

    const state = useAuthStore.getState();
    expect(state.accessToken).toBe("access-123");
    expect(state).not.toHaveProperty("refreshToken");
  });

  it("clear resets the access token to null", () => {
    useAuthStore.getState().setAccessToken("access-123");
    useAuthStore.getState().setUser({
      id: "1",
      email: "a@example.com",
      full_name: "Alex",
      is_active: true,
      email_verified: true,
    });
    useAuthStore.getState().clear();

    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
  });
});
