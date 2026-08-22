import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../test/test-utils";
import { Toggle } from "../Toggle";
import { Checkbox } from "../Checkbox";

describe("Toggle", () => {
  it("reflects checked state via aria-checked", () => {
    render(<Toggle checked onChange={() => {}} label="Notifications" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange with the inverted value when clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Toggle checked={false} onChange={onChange} label="Notifications" />);
    await user.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Checkbox", () => {
  it("toggles native checked state on click", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Accept" />);
    const box = screen.getByRole("checkbox") as HTMLInputElement;
    expect(box.checked).toBe(false);
    await user.click(box);
    expect(box.checked).toBe(true);
  });
});
