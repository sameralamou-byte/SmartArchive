import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import Login from "./Login";
import { render, screen, waitFor } from "../test/test-utils";
import { useAuthStore } from "../store/authStore";
import * as authApi from "../api/auth";

vi.mock("../api/auth");

describe("Login", () => {
  beforeEach(() => {
    useAuthStore.getState().clear();
    vi.mocked(authApi.login).mockReset();
    vi.mocked(authApi.fetchCurrentUser).mockReset();
  });

  it("signs in with email and password only", async () => {
    const user = userEvent.setup({ delay: null });
    vi.mocked(authApi.login).mockResolvedValue({
      access_token: "access",
      token_type: "bearer",
    });
    vi.mocked(authApi.fetchCurrentUser).mockResolvedValue({
      id: "1",
      email: "alex@example.com",
      full_name: "Alex",
      is_active: true,
      organization_id: "should-not-be-shown",
      email_verified: true,
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText("Email"), "alex@example.com");
    await user.type(screen.getByLabelText("Password"), "a-strong-password-123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith("alex@example.com", "a-strong-password-123", false);
      expect(useAuthStore.getState().accessToken).toBe("access");
    });
    expect(useAuthStore.getState().user?.full_name).toBe("Alex");
    expect(useAuthStore.getState().user).not.toHaveProperty("organization_id");
  }, 15000);

  it("does not enter the app when email is not verified", async () => {
    const user = userEvent.setup({ delay: null });
    const error = {
      isAxiosError: true,
      response: { status: 403, data: { detail: "Confirm your email before signing in.", code: "email_not_verified" } },
    };
    vi.mocked(authApi.login).mockRejectedValue(error);
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText("Email"), "alex@example.com");
    await user.type(screen.getByLabelText("Password"), "a-strong-password-123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    await waitFor(() => {
      expect(screen.getByText("Confirm your email before signing in.")).toBeInTheDocument();
    });
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(authApi.fetchCurrentUser).not.toHaveBeenCalled();
  }, 15000);

  it("hides the login password by default and can show or hide it", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const password = screen.getByLabelText("Password");
    expect(password).toHaveAttribute("type", "password");
    await user.type(password, "a-strong-password-123");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    expect(password).toHaveValue("a-strong-password-123");
    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(password).toHaveAttribute("type", "password");
    expect(password).toHaveValue("a-strong-password-123");
  }, 15000);
});
