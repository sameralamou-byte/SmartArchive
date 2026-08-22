import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../test/test-utils";
import { DocumentListItem } from "../DocumentListItem";
import { Badge } from "../Badge";

describe("DocumentListItem", () => {
  it("renders as static content when not given onClick", () => {
    render(
      <DocumentListItem icon="document" title="Rental contract" subtitle="Uploaded 5 Jun 2026" />,
    );
    expect(screen.getByText("Rental contract")).toBeInTheDocument();
    expect(screen.getByText("Uploaded 5 Jun 2026")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("becomes an interactive button when onClick is provided", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<DocumentListItem icon="document" title="School registration" onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: /School registration/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders trailing content such as a status badge", () => {
    render(
      <DocumentListItem
        icon="document"
        title="Letter from Stadt Frankfurt am Main"
        trailing={<Badge tone="warning">Action needed</Badge>}
      />,
    );
    expect(screen.getByText("Action needed")).toBeInTheDocument();
  });
});
