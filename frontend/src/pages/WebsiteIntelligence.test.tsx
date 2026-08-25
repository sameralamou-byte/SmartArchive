import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import WebsiteIntelligence from "./WebsiteIntelligence";
import { render, screen } from "../test/test-utils";

function renderPage2() {
  return render(
    <MemoryRouter initialEntries={["/how-it-works"]}>
      <Routes>
        <Route path="/how-it-works" element={<WebsiteIntelligence />} />
        <Route path="/" element={<div>HOME_PAGE</div>} />
        <Route path="/register" element={<div>REGISTER_PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("WebsiteIntelligence (Page 2)", () => {
  it("renders the document-centered hero, distinct from Page 1", () => {
    renderPage2();
    expect(screen.getByRole("heading", { level: 1, name: "See what SmartArchive understands." })).toBeInTheDocument();
    expect(screen.queryByText("A document, understood.")).not.toBeInTheDocument();
  });

  it("labels real capabilities as demo data and future ones as concept visualization", () => {
    renderPage2();
    expect(screen.getAllByText("Illustrative example · Demo data").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Illustrative example · Concept visualization").length).toBeGreaterThan(0);
  });

  it("asks the core question and marks Translate/Prepare/Respond as concept, not shipped", () => {
    renderPage2();
    expect(screen.getByText("Would you like help with this?")).toBeInTheDocument();
    expect(screen.getByText("SmartArchive assists. The user decides.")).toBeInTheDocument();
    expect(screen.getAllByText("Concept").length).toBe(3);
  });

  it("switches context panels and shows the legal disclaimer only for high-stakes domains", async () => {
    const user = userEvent.setup();
    renderPage2();
    expect(screen.getByText("Residence / immigration correspondence")).toBeInTheDocument();
    expect(screen.getByText("Illustrative guidance — not legal or tax advice.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "School" }));
    expect(screen.getByText("School communication")).toBeInTheDocument();
    expect(screen.queryByText("Illustrative guidance — not legal or tax advice.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Court" }));
    expect(screen.getByText("Court correspondence")).toBeInTheDocument();
    expect(screen.getByText("Illustrative guidance — not legal or tax advice.")).toBeInTheDocument();
  });

  it("never invents pricing or unsupported production claims", () => {
    renderPage2();
    expect(screen.queryByText(/€\s?\d+\s?\/\s?month/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Custom Pricing/i)).not.toBeInTheDocument();
  });

  it("labels the reminders timeline as demo data (a real capability)", () => {
    renderPage2();
    expect(screen.getByText("Don't miss what comes next.")).toBeInTheDocument();
    expect(screen.getByText("Reminder scheduling stays user-controlled.")).toBeInTheDocument();
  });

  it("labels the connected history as a concept, not a shipped feature", () => {
    renderPage2();
    expect(screen.getByText("Keep the whole story connected.")).toBeInTheDocument();
    expect(screen.getByText("Outcome / history")).toBeInTheDocument();
  });

  it("routes Start for Free to registration and Back to Home to the homepage", async () => {
    const user = userEvent.setup();
    renderPage2();
    await user.click(screen.getAllByRole("button", { name: "Back to Home" })[0]);
    expect(screen.getByText("HOME_PAGE")).toBeInTheDocument();
  });
});
