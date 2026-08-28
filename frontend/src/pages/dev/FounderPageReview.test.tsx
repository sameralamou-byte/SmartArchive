import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import FounderPageReview from "./FounderPageReview";
import { render, screen } from "../../test/test-utils";

function renderReview() {
  return render(
    <MemoryRouter>
      <FounderPageReview />
    </MemoryRouter>,
  );
}

describe("FounderPageReview (development only)", () => {
  it("compares Page 1, Page 2, and Page 3 without claiming approval", () => {
    renderReview();
    expect(screen.getByRole("heading", { name: "Founder visual comparison" })).toBeInTheDocument();
    expect(screen.getByText("Dev review — not production")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Page 2 — Current" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Page 2 — Refined old direction" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Page 3" })).toBeInTheDocument();
    expect(screen.getByText("PAGE 2 — CURRENT")).toBeInTheDocument();
    expect(screen.getByText("PAGE 2 — REFINED OLD DIRECTION")).toBeInTheDocument();
    expect(screen.getByText("B — Earlier / original direction")).toBeInTheDocument();
    expect(screen.getByText(/Nothing on this page is Founder-approved/)).toBeInTheDocument();
    expect(screen.getAllByText("A document, understood.").length).toBe(2);
    expect(screen.getByText("Your documents. Protected by design.")).toBeInTheDocument();
    expect(screen.queryByText(/FROZEN/)).not.toBeInTheDocument();
  });

  it("uses the recovered August 15 still and labels missing standalone photos honestly", () => {
    renderReview();
    expect(screen.getByAltText("Recovered August 15 HSA photograph: person reading a document")).toHaveAttribute(
      "src",
      "/assets/dev-founder-review/hsa-aug15-human-document.png",
    );
    expect(screen.getByAltText("Current Page 1 hero: person with a document")).toHaveAttribute(
      "src",
      "/assets/page1/page1_hero_human_document.png",
    );
    expect(screen.getAllByText("Earlier visual direction — source photo required").length).toBeGreaterThan(0);
    expect(screen.getByText("REFERENCE ONLY — ORIGINAL STANDALONE HERO NOT FOUND")).toBeInTheDocument();
    expect(screen.getByText("page3_hero_private_archive.png")).toBeInTheDocument();
    expect(screen.getAllByText("Reference board — not a production photograph").length).toBeGreaterThan(0);
  });

  it("shows the refined Page 2 old-direction prototype with product explanation, not generic AI", () => {
    renderReview();
    expect(screen.getByText("How SmartArchive works")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Bring it in. We understand. You stay in control." })).toBeInTheDocument();
    expect(screen.getByText("Here's what this means")).toBeInTheDocument();
    expect(screen.getByText("Original — Page 1 of 2")).toBeInTheDocument();
    expect(screen.getByText("SmartArchive suggests. You decide.")).toBeInTheDocument();
    expect(screen.getByText("This letter concerns your registration requirement.")).toBeInTheDocument();
    expect(screen.queryByText(/AI brain/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/hologram/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/robot/i)).not.toBeInTheDocument();
  });
});
