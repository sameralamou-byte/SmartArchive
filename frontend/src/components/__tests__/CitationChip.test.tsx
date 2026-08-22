import { describe, expect, it } from "vitest";
import { render, screen } from "../../test/test-utils";
import { CitationChip } from "../CitationChip";
import { AISuggestion } from "../AISuggestion";

describe("CitationChip", () => {
  it("renders as a link carrying a jump-to-source accessible label", () => {
    render(<CitationChip href="#doc-p3-c4-2">Clause 4.2, p.3</CitationChip>);
    const link = screen.getByRole("link");
    expect(link).toHaveTextContent("Clause 4.2, p.3");
    expect(link.getAttribute("aria-label")).toMatch(/Clause 4.2, p.3$/);
  });
});

describe("AISuggestion", () => {
  it("tags AI-derived content and can carry a trailing citation chip", () => {
    render(
      <AISuggestion trailing={<CitationChip href="#src">Clause 4.2, p.3</CitationChip>}>
        This renewal date is 21 days out.
      </AISuggestion>,
    );
    expect(screen.getByText("AI-suggested")).toBeInTheDocument();
    expect(screen.getByText(/This renewal date is 21 days out/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Clause 4.2, p.3/ })).toBeInTheDocument();
  });
});
