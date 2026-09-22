import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import Register from "./Register";
import { render, screen, waitFor } from "../test/test-utils";
import { useAuthStore } from "../store/authStore";
import * as authApi from "../api/auth";

vi.mock("../api/auth");

describe("Register", () => {
  beforeEach(() => {
    useAuthStore.getState().clear();
    vi.mocked(authApi.registerAccount).mockReset();
    vi.mocked(authApi.login).mockReset();
    vi.mocked(authApi.fetchCurrentUser).mockReset();
    vi.mocked(authApi.resendVerification)?.mockReset?.();
  });

  it("does not submit when email or password confirmation does not match", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText(/^Full name/), "Alex");
    await user.type(screen.getByLabelText(/^Email/), "alex@example.com");
    await user.type(screen.getByLabelText(/^Confirm email/), "other@example.com");
    await user.type(screen.getByLabelText(/^Password/), "a-strong-password-123");
    await user.type(screen.getByLabelText(/^Confirm password/), "a-strong-password-123");
    await user.type(screen.getByLabelText(/^Archive name/), "Alex archive");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    expect(screen.getByText("Email addresses do not match.")).toBeInTheDocument();
    expect(authApi.registerAccount).not.toHaveBeenCalled();
  }, 15000);

  it("does not submit when confirm password does not match", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText(/^Full name/), "Alex");
    await user.type(screen.getByLabelText(/^Email/), "alex@example.com");
    await user.type(screen.getByLabelText(/^Confirm email/), "alex@example.com");
    await user.type(screen.getByLabelText(/^Password/), "a-strong-password-123");
    await user.type(screen.getByLabelText(/^Confirm password/), "a-different-password-123");
    await user.type(screen.getByLabelText(/^Archive name/), "Alex archive");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    expect(authApi.registerAccount).not.toHaveBeenCalled();
  }, 15000);

  it("marks every required field with a visible asterisk and no optional wording", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText(/^Full name/)).toBeRequired();
    expect(screen.getByLabelText(/^Email/)).toBeRequired();
    expect(screen.getByLabelText(/^Confirm email/)).toBeRequired();
    expect(screen.getByLabelText(/^Password/)).toBeRequired();
    expect(screen.getByLabelText(/^Confirm password/)).toBeRequired();
    expect(screen.getByLabelText(/^Archive name/)).toBeRequired();
    expect(screen.getAllByText("*")).toHaveLength(6);
    expect(screen.queryByText(/optional/i)).not.toBeInTheDocument();
  });

  it("hides register passwords by default and toggles them independently", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );
    const password = screen.getByLabelText(/^Password/);
    const confirm = screen.getByLabelText(/^Confirm password/);
    expect(password).toHaveAttribute("type", "password");
    expect(confirm).toHaveAttribute("type", "password");

    await user.type(password, "a-strong-password-123");
    await user.type(confirm, "a-strong-password-123");

    const [showPassword, showConfirm] = screen.getAllByRole("button", { name: "Show password" });
    await user.click(showPassword);
    expect(password).toHaveAttribute("type", "text");
    expect(confirm).toHaveAttribute("type", "password");
    expect(password).toHaveValue("a-strong-password-123");

    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(password).toHaveAttribute("type", "password");
    expect(password).toHaveValue("a-strong-password-123");

    await user.click(showConfirm);
    expect(confirm).toHaveAttribute("type", "text");
    expect(password).toHaveAttribute("type", "password");
    expect(confirm).toHaveValue("a-strong-password-123");
  }, 15000);

  it("creates an account then goes to check-email without signing in", async () => {
    const user = userEvent.setup({ delay: null });
    vi.mocked(authApi.registerAccount).mockResolvedValue({
      id: "1",
      email: "alex@example.com",
      full_name: "Alex",
      is_active: true,
      organization_id: "org",
      email_verified: false,
    });
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/register/check-email" element={<p>Check your email</p>} />
        </Routes>
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText(/^Full name/), "Alex");
    await user.type(screen.getByLabelText(/^Email/), "alex@example.com");
    await user.type(screen.getByLabelText(/^Confirm email/), "alex@example.com");
    await user.type(screen.getByLabelText(/^Password/), "A-strong-password-123");
    await user.type(screen.getByLabelText(/^Confirm password/), "A-strong-password-123");
    await user.type(screen.getByLabelText(/^Archive name/), "Alex archive");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() => {
      expect(screen.getByText("Check your email")).toBeInTheDocument();
    });
    expect(authApi.login).not.toHaveBeenCalled();
    expect(authApi.registerAccount).toHaveBeenCalledWith({
      email: "alex@example.com",
      password: "A-strong-password-123",
      full_name: "Alex",
      organization_name: "Alex archive",
    });
    expect(useAuthStore.getState().accessToken).toBeNull();
  }, 15000);
});
