import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import WebsiteSecurity from "./WebsiteSecurity";
import { render, screen } from "../test/test-utils";

function renderPage3() {
  return render(
    <MemoryRouter initialEntries={["/security"]}>
      <Routes>
        <Route path="/security" element={<WebsiteSecurity />} />
        <Route path="/" element={<div>HOME_PAGE</div>} />
        <Route path="/register" element={<div>REGISTER_PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("WebsiteSecurity (Page 3)", () => {
  it("renders the trust headline and core sections", () => {
    renderPage3();
    expect(screen.getByRole("heading", { level: 1, name: "Your documents. Protected by design." })).toBeInTheDocument();
    expect(screen.getByText("Your data is yours.")).toBeInTheDocument();
    expect(screen.getByText("You decide what happens.")).toBeInTheDocument();
    expect(screen.getByText("Kept separate, kept safe.")).toBeInTheDocument();
    expect(screen.getByText("You can always see the source.")).toBeInTheDocument();
    expect(screen.getByText("Nothing disappears without you knowing.")).toBeInTheDocument();
    expect(screen.getByText("SmartArchive assists. You decide. You remain responsible.")).toBeInTheDocument();
  });

  it("labels the document lifecycle as a concept, and the hero/source touches as demo data", () => {
    renderPage3();
    expect(screen.getByText("Illustrative example · Concept visualization")).toBeInTheDocument();
    expect(screen.getAllByText("Illustrative example · Demo data").length).toBeGreaterThan(0);
  });

  it("never invents pricing, statistics, or unsupported claims", () => {
    renderPage3();
    const text = document.body.textContent ?? "";
    expect(/€\s?\d+\s?\/\s?month/i.test(text)).toBe(false);
    expect(text).not.toMatch(/Custom Pricing/i);
    expect(text).not.toMatch(/certified|SOC ?2|ISO ?27001|256-bit|GDPR compliant/i);
  });

  it("routes Start for Free and Back to Home correctly", async () => {
    const user = userEvent.setup();
    renderPage3();
    await user.click(screen.getAllByRole("button", { name: "Start for Free" })[0]);
    expect(screen.getByText("REGISTER_PAGE")).toBeInTheDocument();
  });

  it("routes Back to Home to the homepage", async () => {
    const user = userEvent.setup();
    renderPage3();
    await user.click(screen.getAllByRole("button", { name: "Back to Home" })[0]);
    expect(screen.getByText("HOME_PAGE")).toBeInTheDocument();
  });
});
