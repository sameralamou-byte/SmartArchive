import { describe, expect, it } from "vitest";

import { buildDocumentsView, filterDocuments, sortDocuments } from "./documentsState";

const sample = (id: string, title: string, mime = "application/pdf", createdAt = "2026-06-01T10:00:00.000Z") => ({
  id,
  title,
  original_filename: `${id}.pdf`,
  mime_type: mime,
  size_bytes: 100,
  status: "uploaded",
  created_at: createdAt,
});

describe("documentsState", () => {
  it("filters by title and filename", () => {
    const docs = [sample("a", "Insurance policy"), sample("b", "School letter")];
    expect(filterDocuments(docs, "insurance", "all")).toHaveLength(1);
    expect(filterDocuments(docs, "b.pdf", "all")[0]?.id).toBe("b");
  });

  it("filters by mime type", () => {
    const docs = [
      sample("a", "PDF doc", "application/pdf"),
      sample("b", "Photo", "image/jpeg"),
      sample("c", "Text", "text/plain"),
    ];
    expect(filterDocuments(docs, "", "pdf")).toHaveLength(1);
    expect(filterDocuments(docs, "", "image")).toHaveLength(1);
    expect(filterDocuments(docs, "", "other")).toHaveLength(1);
  });

  it("sorts by newest and name", () => {
    const docs = [
      sample("a", "Beta", "application/pdf", "2026-06-02T10:00:00.000Z"),
      sample("b", "Alpha", "application/pdf", "2026-06-01T10:00:00.000Z"),
    ];
    expect(sortDocuments(docs, "newest").map((doc) => doc.id)).toEqual(["a", "b"]);
    expect(sortDocuments(docs, "name").map((doc) => doc.title)).toEqual(["Alpha", "Beta"]);
  });

  it("builds the final view from filter and sort", () => {
    const docs = [
      sample("a", "Insurance policy", "application/pdf", "2026-06-02T10:00:00.000Z"),
      sample("b", "School letter", "application/pdf", "2026-06-01T10:00:00.000Z"),
    ];
    expect(buildDocumentsView(docs, "school", "all", "newest").map((doc) => doc.id)).toEqual(["b"]);
  });
});
