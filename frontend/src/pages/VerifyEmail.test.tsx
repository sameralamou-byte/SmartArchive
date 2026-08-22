import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import VerifyEmail from "./VerifyEmail";
import { render, screen, waitFor } from "../test/test-utils";
import * as authApi from "../api/auth";

vi.mock("../api/auth");

describe("VerifyEmail", () => {
  beforeEach(() => {
    vi.mocked(authApi.verifyEmail).mockReset();
  });

  it("posts the token and does not GET the API", async () => {
    vi.mocked(authApi.verifyEmail).mockResolvedValue({ email_verified: true });
    render(
      <MemoryRouter initialEntries={["/verify-email?token=raw-token"]}>
        <Routes>
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Your email is confirmed.")).toBeInTheDocument();
    });
    expect(authApi.verifyEmail).toHaveBeenCalledWith("raw-token");
  });
});
