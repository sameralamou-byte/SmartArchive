import { describe, expect, it } from "vitest";
import { render, screen } from "../../test/test-utils";
import { ThreadIndicator } from "../ThreadIndicator";

describe("ThreadIndicator", () => {
  it("shows the processing label by default", () => {
    render(<ThreadIndicator state="processing" />);
    expect(screen.getByText("SmartArchive is reading the document…")).toBeInTheDocument();
  });

  it("shows the error label in the critical tone", () => {
    render(<ThreadIndicator state="error" />);
    const label = screen.getByText("Something went wrong");
    expect(label).toHaveClass("text-critical");
  });

  it("renders no default label for the completion state (it's a one-time visual settle, not a status line)", () => {
    render(<ThreadIndicator state="completion" />);
    expect(screen.queryByText(/./, { selector: "span" })).not.toBeInTheDocument();
  });

  it("accepts an explicit label override", () => {
    render(<ThreadIndicator state="waiting" label="Custom waiting copy" />);
    expect(screen.getByText("Custom waiting copy")).toBeInTheDocument();
  });
});
