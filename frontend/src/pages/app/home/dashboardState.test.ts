import { describe, expect, it } from "vitest";

import { buildDashboardViewState, threadActiveIndex } from "./dashboardState";

const sampleDoc = (id: string, title: string) => ({
  id,
  title,
  original_filename: `${id}.pdf`,
  mime_type: "application/pdf",
  size_bytes: 100,
  status: "uploaded",
  created_at: "2026-05-12T10:00:00.000Z",
});

describe("dashboardState", () => {
  it("starts at Document when the archive is empty", () => {
    expect(threadActiveIndex(0)).toBe(0);
    expect(buildDashboardViewState([]).threadActiveIndex).toBe(0);
  });

  it("advances to Understand when a session document exists", () => {
    const docs = [sampleDoc("a", "Letter A")];
    const view = buildDashboardViewState(docs);
    expect(view.threadActiveIndex).toBe(1);
    expect(view.primaryDocument?.id).toBe("a");
    expect(view.attentionDocuments).toHaveLength(0);
  });

  it("does not duplicate the primary document in the attention list", () => {
    const docs = [sampleDoc("a", "Primary"), sampleDoc("b", "Secondary"), sampleDoc("c", "Third")];
    const view = buildDashboardViewState(docs);
    expect(view.attentionDocuments.map((doc) => doc.id)).toEqual(["b", "c"]);
    expect(view.connectedDocuments.map((doc) => doc.id)).toEqual(["b", "c"]);
  });

  it("keeps a single secondary document in connected documents only", () => {
    const docs = [sampleDoc("a", "Primary"), sampleDoc("b", "Secondary")];
    const view = buildDashboardViewState(docs);
    expect(view.attentionDocuments).toHaveLength(0);
    expect(view.connectedDocuments.map((doc) => doc.id)).toEqual(["b"]);
  });
});
