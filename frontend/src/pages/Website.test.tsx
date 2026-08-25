import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import Website from "./Website";
import { render, screen } from "../test/test-utils";

function renderWebsite() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Website />} />
        <Route path="/register" element={<div>REGISTER_PAGE</div>} />
        <Route path="/login" element={<div>LOGIN_PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Website (public home)", () => {
  it("renders the hero and primary navigation", () => {
    renderWebsite();
    expect(screen.getByRole("heading", { level: 1, name: "A document, understood." })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "For your life" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "For your organization" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Start for Free" }).length).toBeGreaterThan(0);
  });

  it("labels the hero insight card as illustrative demo data", () => {
    renderWebsite();
    expect(screen.getByText("We found 3 things that matter")).toBeInTheDocument();
    expect(screen.getByText("€129.40")).toBeInTheDocument();
    expect(screen.getAllByText("Illustrative example · Demo data").length).toBeGreaterThan(0);
    expect(screen.getByText("Illustrative scene — not a real document")).toBeInTheDocument();
  });

  it("shows the document-to-decision transformation", () => {
    renderWebsite();
    expect(screen.getByText("From a document to what matters.")).toBeInTheDocument();
    for (const label of ["Document", "What does this mean?", "SmartArchive explains", "What do I need to do?", "Your decision"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("labels the Document Hub as illustrative demo data, not real activity", () => {
    renderWebsite();
    expect(screen.getAllByText("Illustrative example · Demo data").length).toBeGreaterThan(1);
    expect(screen.getByText("Electricity Bill — April 2025")).toBeInTheDocument();
  });

  it("shows two HSA and two ESA real-life situations without HSA/ESA labels", () => {
    renderWebsite();
    expect(screen.getByText("A letter you don't understand")).toBeInTheDocument();
    expect(screen.getByText("A bill you don't want to forget")).toBeInTheDocument();
    expect(screen.getByText("An invoice queue you need to clear")).toBeInTheDocument();
    expect(screen.getByText("An employee record you need to find")).toBeInTheDocument();
    expect(screen.queryByText("HSA")).not.toBeInTheDocument();
    expect(screen.queryByText("ESA")).not.toBeInTheDocument();
  });

  it("does not expose internal HSA/ESA naming anywhere on the page", () => {
    renderWebsite();
    expect(screen.getByText("For your life", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByText("For your organization", { selector: "p" })).toBeInTheDocument();
    expect(screen.queryByText(/\bHSA\b/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\bESA\b/)).not.toBeInTheDocument();
  });

  it("labels the ESA constellation/pipeline visual as an illustrative concept", () => {
    renderWebsite();
    expect(screen.getByText("Illustrative example · Concept visualization")).toBeInTheDocument();
    expect(screen.getByText("Invoice received")).toBeInTheDocument();
    expect(screen.getByText("Archived")).toBeInTheDocument();
  });

  it("never invents pricing or a demo-request workflow", () => {
    renderWebsite();
    expect(screen.queryByText(/€\s?\d+\s?\/\s?month/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Request a Demo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Custom Pricing/i)).not.toBeInTheDocument();
  });

  it("uses Sign in, not Log in", () => {
    renderWebsite();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.queryByText("Log in")).not.toBeInTheDocument();
  });

  it("routes Explore SmartArchive Home/Enterprise and Start for Free to registration", async () => {
    const user = userEvent.setup();
    renderWebsite();
    await user.click(screen.getByRole("button", { name: "Explore SmartArchive Enterprise" }));
    expect(screen.getByText("REGISTER_PAGE")).toBeInTheDocument();
  });

  it("sends visitors to sign in", async () => {
    const user = userEvent.setup();
    renderWebsite();
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByText("LOGIN_PAGE")).toBeInTheDocument();
  });
});
