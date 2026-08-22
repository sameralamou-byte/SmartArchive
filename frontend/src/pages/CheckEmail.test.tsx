import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import CheckEmail from "./CheckEmail";
import { render, screen, waitFor } from "../test/test-utils";
import * as authApi from "../api/auth";

vi.mock("../api/auth");

describe("CheckEmail", () => {
  beforeEach(() => {
    vi.mocked(authApi.resendVerification).mockReset();
    vi.mocked(authApi.resendVerification).mockResolvedValue(undefined);
  });

  it("resends using the email from location state", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={[{ pathname: "/register/check-email", state: { email: "alex@example.com" } }]}>
        <CheckEmail />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Check your email" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Resend confirmation email" }));
    await waitFor(() => {
      expect(authApi.resendVerification).toHaveBeenCalledWith("alex@example.com");
    });
    expect(
      screen.getByText("If this email can be confirmed, a new message is on its way."),
    ).toBeInTheDocument();
  });
});
