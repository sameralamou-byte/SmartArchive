import { describe, expect, it } from "vitest";
import { render, screen } from "../../test/test-utils";
import { ConfidenceThread } from "../ConfidenceThread";

describe("ConfidenceThread", () => {
  it("shows the plain-language label next to the subject, never a bare number", () => {
    render(<ConfidenceThread value={0.92} level="high" subject="Renewal date extracted" />);
    expect(screen.getByText("Renewal date extracted")).toBeInTheDocument();
    expect(screen.getByText("Mostly confident")).toBeInTheDocument();
    expect(screen.queryByText("92%")).not.toBeInTheDocument();
  });

  it("exposes the value via role=progressbar for assistive tech", () => {
    render(<ConfidenceThread value={0.61} level="medium" subject="Vendor match" />);
    const bar = screen.getByRole("progressbar", { name: "Vendor match" });
    expect(bar).toHaveAttribute("aria-valuenow", "61");
  });

  it("clamps out-of-range values instead of producing an invalid width", () => {
    render(<ConfidenceThread value={1.4} level="low" subject="Clause interpretation" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });
});
