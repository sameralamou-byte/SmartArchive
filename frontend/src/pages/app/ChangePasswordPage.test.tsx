import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";

import AppRoutes from "../../routes/AppRoutes";
import { render, screen, waitFor } from "../../test/test-utils";
import { useAuthStore } from "../../store/authStore";
import { apiClient, refreshClient } from "../../api/client";

describe("ChangePasswordPage 401 handling", () => {
  const originalAdapter = apiClient.defaults.adapter;

  beforeEach(() => {
    useAuthStore.getState().clear();
    useAuthStore.getState().setAccessToken("memory-access");
    useAuthStore.getState().setUser({
      id: "11111111-1111-1111-1111-111111111111",
      email: "alex@example.com",
      full_name: "Alex",
      is_active: true,
      email_verified: true,
    });
  });

  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter;
    vi.restoreAllMocks();
    useAuthStore.getState().clear();
  });

  it("keeps the session on wrong current password without calling refresh", async () => {
    const user = userEvent.setup({ delay: null });
    const refreshSpy = vi.spyOn(refreshClient, "post");
    apiClient.defaults.adapter = async (config) => {
      const url = String(config.url ?? "");
      if (url.includes("/auth/change-password")) {
        const error = new AxiosError("Unauthorized");
        error.config = { ...(config as InternalAxiosRequestConfig), url };
        error.response = {
          status: 401,
          data: { detail: "Invalid credentials" },
          headers: {},
          config: error.config,
          statusText: "Unauthorized",
        };
        throw error;
      }
      throw new Error(`unexpected ${url}`);
    };

    render(
      <MemoryRouter initialEntries={["/app/account/security"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Change password" })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Current password/), "wrong-password-123");
    await user.type(screen.getByLabelText(/^New password/), "A-new-password-456");
    await user.type(screen.getByLabelText(/Confirm new password/), "A-new-password-456");
    await user.click(screen.getByRole("button", { name: "Update password" }));

    await waitFor(() => {
      expect(screen.getByText("Email or password is incorrect.")).toBeInTheDocument();
    });

    expect(refreshSpy).not.toHaveBeenCalled();
    expect(useAuthStore.getState().accessToken).toBe("memory-access");
    expect(useAuthStore.getState().user?.email).toBe("alex@example.com");
    expect(screen.getByRole("heading", { name: "Change password" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Sign in to SmartArchive" })).not.toBeInTheDocument();
  }, 15000);
});
