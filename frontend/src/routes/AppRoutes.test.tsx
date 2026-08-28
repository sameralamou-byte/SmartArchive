import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import AppRoutes from "./AppRoutes";
import { render, screen } from "../test/test-utils";
import { useAuthStore } from "../store/authStore";
import { useSessionDocumentsStore } from "../store/sessionDocuments";

vi.mock("../api/auth", () => ({
  fetchCurrentUser: vi.fn(),
  login: vi.fn(),
  registerAccount: vi.fn(),
  verifyEmail: vi.fn(),
  resendVerification: vi.fn(),
  logoutAccount: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  changePassword: vi.fn(),
  refreshSession: vi.fn(),
}));

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe("AppRoutes", () => {
  beforeEach(() => {
    useAuthStore.getState().clear();
    useSessionDocumentsStore.getState().clear();
  });

  it("sends unauthenticated visitors from /app to sign in", async () => {
    renderRoute("/app");
    expect(await screen.findByRole("heading", { name: "Sign in to SmartArchive" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Organization")).not.toBeInTheDocument();
  });

  it("does not require an organization on the login form", () => {
    renderRoute("/login");
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Remember me")).toBeInTheDocument();
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    expect(screen.queryByLabelText("Organization")).not.toBeInTheDocument();
  });

  it("asks for an archive name on register, not an organization", () => {
    renderRoute("/register");
    expect(screen.getByLabelText(/^Archive name/)).toBeInTheDocument();
    expect(screen.queryByLabelText("Organization")).not.toBeInTheDocument();
  });

  it("protects /app and shows Home without Family, Billing, or Archive nav", async () => {
    useAuthStore.getState().setAccessToken("access");
    useAuthStore.getState().setUser({
      id: "11111111-1111-1111-1111-111111111111",
      email: "alex@example.com",
      full_name: "Alex",
      is_active: true,
      email_verified: true,
    });
    renderRoute("/app");
    expect(await screen.findByRole("heading", { name: /Alex/ })).toBeInTheDocument();
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Documents").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Understand").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Reminders").length).toBeGreaterThan(0);
    expect(screen.queryByText("Family")).not.toBeInTheDocument();
    expect(screen.queryByText("Billing")).not.toBeInTheDocument();
    expect(screen.queryByText("Entitlement")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Archive" })).not.toBeInTheDocument();
  });

  it("shows a truthful empty documents state", async () => {
    useAuthStore.getState().setAccessToken("access");
    useAuthStore.getState().setUser({
      id: "11111111-1111-1111-1111-111111111111",
      email: "alex@example.com",
      full_name: "Alex",
      is_active: true,
      email_verified: true,
    });
    renderRoute("/app/documents");
    expect(
      await screen.findByText("Your archive has no documents yet."),
    ).toBeInTheDocument();
  });

  it("does not display tenant or account identifiers on the account page", async () => {
    useAuthStore.getState().setAccessToken("access");
    useAuthStore.getState().setUser({
      id: "11111111-1111-1111-1111-111111111111",
      email: "alex@example.com",
      full_name: "Alex",
      is_active: true,
      email_verified: true,
    });
    renderRoute("/app/account");
    expect(await screen.findByText("alex@example.com")).toBeInTheDocument();
    expect(screen.queryByText("organization_id")).not.toBeInTheDocument();
    expect(screen.queryByText("account_id")).not.toBeInTheDocument();
    expect(screen.queryByText("org_id")).not.toBeInTheDocument();
    expect(screen.queryByText("11111111-1111-1111-1111-111111111111")).not.toBeInTheDocument();
  });

  it("leaves Family on the development Home dashboard only", async () => {
    renderRoute("/dev/home-dashboard");
    expect(await screen.findByText("Family")).toBeInTheDocument();
  });

  it("exposes the Founder visual comparison only on a development route", async () => {
    renderRoute("/dev/founder-page-review");
    expect(await screen.findByRole("heading", { name: "Founder visual comparison" })).toBeInTheDocument();
    expect(screen.getByText("Dev review — not production")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open connected HSA website preview" })).toHaveAttribute(
      "href",
      "/dev/founder-page-review/website",
    );
  });

  it("exposes the connected HSA website preview only on a development route", async () => {
    renderRoute("/dev/founder-page-review/website");
    expect(await screen.findByRole("heading", { name: /Your life/ })).toBeInTheDocument();
    expect(screen.getByText("Organized.")).toBeInTheDocument();
  });

  it("does not wire public Page 2 or Page 3 into production routes", () => {
    renderRoute("/how-it-works");
    expect(screen.getByText("Page not found.")).toBeInTheDocument();
  });

  it("does not wire /security as a production Page 3 route", () => {
    renderRoute("/security");
    expect(screen.getByText("Page not found.")).toBeInTheDocument();
  });
});
