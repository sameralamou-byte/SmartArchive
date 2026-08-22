import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "../store/authStore";
import { apiClient, refreshClient } from "./client";

function axios401(config: InternalAxiosRequestConfig, url: string): AxiosError {
  const error = new AxiosError("Unauthorized");
  error.config = { ...config, url };
  error.response = {
    status: 401,
    data: { detail: "Invalid credentials" },
    headers: {},
    config: error.config,
    statusText: "Unauthorized",
  };
  return error;
}

describe("apiClient credentials and 401 handling", () => {
  const originalApiAdapter = apiClient.defaults.adapter;

  beforeEach(() => {
    useAuthStore.getState().clear();
    useAuthStore.getState().setAccessToken("memory-access");
  });

  afterEach(() => {
    apiClient.defaults.adapter = originalApiAdapter;
    vi.restoreAllMocks();
    useAuthStore.getState().clear();
  });

  it("sends credentialed requests on both auth clients", () => {
    expect(apiClient.defaults.withCredentials).toBe(true);
    expect(refreshClient.defaults.withCredentials).toBe(true);
  });

  it("does not refresh or clear the session on change-password 401", async () => {
    const refreshSpy = vi.spyOn(refreshClient, "post");
    apiClient.defaults.adapter = async (config) => {
      throw axios401(config as InternalAxiosRequestConfig, "/auth/change-password");
    };

    await expect(
      apiClient.post("/auth/change-password", {
        current_password: "wrong",
        new_password: "a-new-password-456",
        new_password_confirm: "a-new-password-456",
      }),
    ).rejects.toMatchObject({ response: { status: 401 } });

    expect(refreshSpy).not.toHaveBeenCalled();
    expect(useAuthStore.getState().accessToken).toBe("memory-access");
  });

  it("still refreshes on genuine authenticated API expiry", async () => {
    vi.spyOn(refreshClient, "post").mockResolvedValue({
      data: { access_token: "rotated-access", token_type: "bearer" },
    } as AxiosResponse);
    let meCalls = 0;
    apiClient.defaults.adapter = async (config) => {
      const url = String(config.url ?? "");
      if (url.includes("/users/me")) {
        meCalls += 1;
        if (meCalls === 1) {
          throw axios401(config as InternalAxiosRequestConfig, "/users/me");
        }
        return {
          data: { email: "alex@example.com" },
          status: 200,
          statusText: "OK",
          headers: {},
          config,
        };
      }
      throw new Error(`unexpected ${url}`);
    };

    const response = await apiClient.get("/users/me");
    expect(refreshClient.post).toHaveBeenCalledWith("/auth/refresh", {});
    expect(useAuthStore.getState().accessToken).toBe("rotated-access");
    expect(response.status).toBe(200);
  });
});

describe("axios defaults", () => {
  it("does not persist tokens on the shared axios instance", () => {
    expect(axios.defaults.withCredentials).not.toBe(true);
  });
});
