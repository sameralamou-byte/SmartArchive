import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import AppRoutes from "../../../routes/AppRoutes";
import { render, screen, within } from "../../../test/test-utils";
import { HSA_PAGE1_ASSETS } from "./hsaWebsiteAssets";

function renderSite(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe("HSA connected website preview (development only)", () => {
  it("renders one shared header and the approved Page 1 hero", () => {
    renderSite("/dev/founder-page-review/website");
    const nav = screen.getByRole("navigation", { name: "SmartArchive" });
    expect(within(nav).getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "How it works" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "Security & Privacy" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "For Home" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "For Business" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "About us" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Sign in" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Start for free" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: /Your life/ })).toBeInTheDocument();
    expect(screen.getByText("Organized.")).toBeInTheDocument();
    expect(screen.getByAltText("A person reading an important document at a desk")).toHaveAttribute(
      "src",
      HSA_PAGE1_ASSETS.hero,
    );
    expect(screen.getByText("Understood")).toBeInTheDocument();
    expect(screen.getByText("Deadline detected")).toBeInTheDocument();
    expect(screen.getByText("Action suggested")).toBeInTheDocument();
    expect(screen.getByText(/Awaiting Founder review/)).toBeInTheDocument();
  });

  it("uses the approved Understand, Remember, Automate, and Connect stills", () => {
    renderSite("/dev/founder-page-review/website");
    expect(
      screen.getByAltText("Understand: hands holding a letter. We explain what it means in plain language."),
    ).toHaveAttribute("src", HSA_PAGE1_ASSETS.understand);
    expect(screen.getByAltText("Remember: a phone reminder for an electricity bill deadline.")).toHaveAttribute(
      "src",
      HSA_PAGE1_ASSETS.remember,
    );
    expect(
      screen.getByAltText("Automate: a laptop workflow classifying, extracting, organizing, and archiving a document."),
    ).toHaveAttribute("src", HSA_PAGE1_ASSETS.automate);
    expect(screen.getByAltText("Connect: Weave shows how your documents relate.")).toHaveAttribute(
      "src",
      HSA_PAGE1_ASSETS.connect,
    );
    expect(screen.getByText("Local stores and markets")).toBeInTheDocument();
    expect(screen.getByText("Small / simple offices")).toBeInTheDocument();
    expect(screen.getByText("Local store or workshop")).toBeInTheDocument();
    expect(screen.queryByText(/robot/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/hologram/i)).not.toBeInTheDocument();
  });

  it("shows How it works as the same website, not a separate product", () => {
    renderSite("/dev/founder-page-review/website/how-it-works");
    expect(screen.getByRole("heading", { name: "A real document. Then you decide." })).toBeInTheDocument();
    expect(screen.getByText("SmartArchive suggests. You decide.")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "SmartArchive" })).toBeInTheDocument();
  });

  it("keeps For Home personal and For Business as ESA", () => {
    renderSite("/dev/founder-page-review/website/for-home");
    expect(screen.getByRole("heading", { name: "For life, household, and small work." })).toBeInTheDocument();
    expect(screen.getByText("Freelancer or small personal project")).toBeInTheDocument();
  });

  it("states the ESA boundary on For Business", () => {
    renderSite("/dev/founder-page-review/website/for-business");
    expect(screen.getByRole("heading", { name: "Enterprise SmartArchive" })).toBeInTheDocument();
    expect(screen.getByText(/departments, enterprise teams/i)).toBeInTheDocument();
    expect(screen.getByText(/ESA architecture is not implemented/)).toBeInTheDocument();
  });
});
