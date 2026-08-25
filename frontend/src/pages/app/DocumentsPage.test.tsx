import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import DocumentsPage from "./DocumentsPage";
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

describe("DocumentsPage", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    useAuthStore.getState().clear();
    useSessionDocumentsStore.getState().clear();
  });

  it("shows a polished empty archive state", () => {
    seedUser();
    render(
      <MemoryRouter>
        <DocumentsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Your archive has no documents yet.")).toBeInTheDocument();
    expect(screen.getByText("SmartArchive suggests. You decide.")).toBeInTheDocument();
    expect(screen.queryByText(/92%/)).not.toBeInTheDocument();
  });

  it("filters session documents by search query", async () => {
    seedUser();
    useSessionDocumentsStore.getState().add({
      id: "doc-1",
      title: "Insurance policy",
      original_filename: "insurance.pdf",
      mime_type: "application/pdf",
      size_bytes: 900,
      status: "uploaded",
      created_at: "2026-05-11T10:00:00.000Z",
    });
    useSessionDocumentsStore.getState().add({
      id: "doc-2",
      title: "School letter",
      original_filename: "school.pdf",
      mime_type: "application/pdf",
      size_bytes: 1200,
      status: "uploaded",
      created_at: "2026-05-12T10:00:00.000Z",
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DocumentsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Insurance policy")).toBeInTheDocument();
    expect(screen.getByText("School letter")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Search"), "school");
    expect(screen.queryByText("Insurance policy")).not.toBeInTheDocument();
    expect(screen.getByText("School letter")).toBeInTheDocument();
  });

  it("routes to understand from a document card", async () => {
    seedUser();
    useSessionDocumentsStore.getState().add({
      id: "doc-1",
      title: "Insurance policy",
      original_filename: "insurance.pdf",
      mime_type: "application/pdf",
      size_bytes: 900,
      status: "uploaded",
      created_at: "2026-05-11T10:00:00.000Z",
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DocumentsPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Open Understand" }));
    expect(mockNavigate).toHaveBeenCalledWith("/app/understand?document=doc-1");
  });
});
