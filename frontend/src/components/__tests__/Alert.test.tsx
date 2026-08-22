import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../test/test-utils";
import { Alert } from "../Alert";

describe("Alert", () => {
  it("uses role=alert for critical tone so assistive tech interrupts", () => {
    render(<Alert tone="critical">Upload failed.</Alert>);
    expect(screen.getByRole("alert")).toHaveTextContent("Upload failed.");
  });

  it("uses role=status (polite) for non-critical tones", () => {
    render(<Alert tone="success">Document verified.</Alert>);
    expect(screen.getByRole("status")).toHaveTextContent("Document verified.");
  });

  it("calls onDismiss when the close control is activated", async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(
      <Alert tone="info" onDismiss={onDismiss}>
        Heads up.
      </Alert>,
    );
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
