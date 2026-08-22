import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../test/test-utils";
import { UnderstandBar } from "../UnderstandBar";

describe("UnderstandBar", () => {
  it("uses the question-form placeholder on Home density", () => {
    render(<UnderstandBar density="home" />);
    expect(screen.getByPlaceholderText("What would you like to understand?")).toBeInTheDocument();
  });

  it("uses the command-form placeholder on Enterprise density", () => {
    render(<UnderstandBar density="enterprise" />);
    expect(
      screen.getByPlaceholderText("Search across your entire knowledge base…"),
    ).toBeInTheDocument();
  });

  it("only shows the scan action on Home density (same component, adapted tool set)", () => {
    render(<UnderstandBar density="enterprise" onUpload={() => {}} onScan={() => {}} onVoice={() => {}} />);
    expect(screen.queryByLabelText("Scan document")).not.toBeInTheDocument();
    render(<UnderstandBar density="home" onUpload={() => {}} onScan={() => {}} onVoice={() => {}} />);
    expect(screen.getByLabelText("Scan document")).toBeInTheDocument();
  });

  it("calls the upload handler", async () => {
    const onUpload = vi.fn();
    const user = userEvent.setup();
    render(<UnderstandBar density="home" onUpload={onUpload} />);
    await user.click(screen.getByLabelText("Upload document"));
    expect(onUpload).toHaveBeenCalledTimes(1);
  });
});
