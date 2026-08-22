import { describe, expect, it } from "vitest";

import { useSessionDocumentsStore } from "./sessionDocuments";

describe("useSessionDocumentsStore", () => {
  it("keeps only session-uploaded documents and can remove them", () => {
    useSessionDocumentsStore.getState().clear();
    useSessionDocumentsStore.getState().add({
      id: "doc-1",
      title: "letter.pdf",
      original_filename: "letter.pdf",
      mime_type: "application/pdf",
      size_bytes: 10,
      status: "uploaded",
      created_at: "2026-08-16T00:00:00Z",
    });
    expect(useSessionDocumentsStore.getState().getById("doc-1")?.title).toBe("letter.pdf");
    useSessionDocumentsStore.getState().remove("doc-1");
    expect(useSessionDocumentsStore.getState().documents).toEqual([]);
  });
});
