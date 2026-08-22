import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../test/test-utils";
import { EnterpriseSidebar } from "../nav/EnterpriseSidebar";

const items = [
  { key: "overview", icon: "workflow" as const, label: "Overview" },
  { key: "knowledge", icon: "search" as const, label: "Knowledge" },
];

describe("EnterpriseSidebar", () => {
  it("marks the active item with aria-current", () => {
    render(<EnterpriseSidebar items={items} activeKey="knowledge" />);
    expect(screen.getByRole("link", { name: "Knowledge" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute("aria-current");
  });

  it("calls onNavigate instead of following the link when provided", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<EnterpriseSidebar items={items} activeKey="overview" onNavigate={onNavigate} />);
    await user.click(screen.getByRole("link", { name: "Knowledge" }));
    expect(onNavigate).toHaveBeenCalledWith("knowledge");
  });

  it("still exposes item labels for assistive tech at the icon-only (tablet) rail width", () => {
    // compactBelowLg hides the label visually below lg but keeps it as the
    // link's accessible name via `title` + the (visually hidden at that
    // width, but still DOM-present) label text.
    render(<EnterpriseSidebar items={items} activeKey="overview" />);
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("title", "Overview");
  });
});
