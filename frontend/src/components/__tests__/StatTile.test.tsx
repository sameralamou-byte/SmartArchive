import { describe, expect, it } from "vitest";
import { render, screen } from "../../test/test-utils";
import { StatTile } from "../StatTile";

describe("StatTile", () => {
  it("always pairs the number with a label and context line, never a bare number", () => {
    render(<StatTile label="Alerts" value={7} sub="Requires attention" tone="critical" />);
    expect(screen.getByText("Alerts")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("Requires attention")).toBeInTheDocument();
  });

  it("renders without a sub line when none is given", () => {
    render(<StatTile label="Documents" value="128,421" />);
    expect(screen.getByText("128,421")).toBeInTheDocument();
  });
});
