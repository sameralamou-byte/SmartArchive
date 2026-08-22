import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import HomePage from "./HomePage";
import { render, screen } from "../../test/test-utils";
import { useAuthStore } from "../../store/authStore";
import { useSessionDocumentsStore } from "../../store/sessionDocuments";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function seedUser() {
  useAuthStore.getState().setAccessToken("access");
  useAuthStore.getState().setUser({
    id: "11111111-1111-1111-1111-111111111111",
    email: "alex@example.com",
    full_name: "Alex",
    is_active: true,
    email_verified: true,
  });
}

describe("HomePage", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    useAuthStore.getState().clear();
    useSessionDocumentsStore.getState().clear();
  });

  it("shows the HSA-08 hero tagline and human-control message", () => {
    seedUser();
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /Alex/ })).toBeInTheDocument();
    expect(screen.getByText("SmartArchive understands what matters.")).toBeInTheDocument();
    expect(screen.getByText("SmartArchive suggests. You decide.")).toBeInTheDocument();
    expect(screen.getByText("The SmartArchive thread")).toBeInTheDocument();
  });

  it("shows a truthful empty archive state without fabricated understanding", () => {
    seedUser();
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Your archive is ready")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Upload a document to begin. SmartArchive will help you understand what matters when understanding is connected.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/92%/)).not.toBeInTheDocument();
  });

  it("uses session documents for the primary focus without inventing interpretation", () => {
    seedUser();
    useSessionDocumentsStore.getState().add({
      id: "doc-1",
      title: "Appointment letter",
      original_filename: "appointment.pdf",
      mime_type: "application/pdf",
      size_bytes: 1200,
      status: "uploaded",
      created_at: "2026-05-12T10:00:00.000Z",
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText("You have 1 items that may need your attention.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Your focus document" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Appointment letter" })).toBeInTheDocument();
    expect(screen.getByText("appointment.pdf")).toBeInTheDocument();
    expect(screen.getAllByText("Document understanding is not connected yet.").length).toBeGreaterThan(0);
  });

  it("routes upload actions to documents and links understand in the sidebar", async () => {
    seedUser();
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Upload a document" }));
    expect(mockNavigate).toHaveBeenCalledWith("/app/documents");

    expect(screen.getByRole("link", { name: "Open Understand" })).toHaveAttribute("href", "/app/understand");
  });
});
