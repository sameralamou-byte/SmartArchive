import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import AppRoutes from "../../../routes/AppRoutes";
import { render, screen, within } from "../../../test/test-utils";
import { HSA_FEATURES_ASSETS, HSA_HOME_ASSETS, HSA_HOW_IT_WORKS_ASSETS } from "./hsaWebsiteAssets";

function renderSite(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe("HSA Home marketing preview (development only)", () => {
  it("renders the new HSA identity on a clear home URL", () => {
    renderSite("/dev/founder-page-review/hsa-website");
    const nav = screen.getByRole("navigation", { name: "Human SmartArchive" });
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "How It Works" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "Features" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "Life (Use Cases)" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "Privacy & Control" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "Pricing" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(within(nav).getAllByRole("link")).toHaveLength(7);
    expect(screen.getAllByText("HSA").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Human SmartArchive").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: /Everything That Matters/ })).toBeInTheDocument();
    expect(screen.getByText("Finally in One Place.")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Get Started" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Get Started →" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "See How It Works" }).length).toBeGreaterThan(0);
    expect(screen.getByText("Your data stays yours")).toBeInTheDocument();
    expect(screen.getByText("Built for real life")).toBeInTheDocument();
    expect(screen.getByText("Private. Secure. Trusted.")).toBeInTheDocument();
    expect(screen.getByText(/Less paperwork/)).toBeInTheDocument();
    expect(screen.getByText(/More life/)).toBeInTheDocument();
    expect(screen.getByAltText(/family at a kitchen table/i)).toHaveAttribute("src", HSA_HOME_ASSETS.hero);
    expect(screen.getByRole("heading", { name: /One SmartArchive/ })).toBeInTheDocument();
    expect(screen.getByText("Many Parts of Your World.")).toBeInTheDocument();
    expect(screen.getByText("Home & Family")).toBeInTheDocument();
    expect(screen.getByText("Clubs & Small Organizations")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "A real document. Then you decide." })).toBeInTheDocument();
    expect(screen.getByText("Capture")).toBeInTheDocument();
    expect(screen.getByText("Connect")).toBeInTheDocument();
    expect(screen.getByText("Act")).toBeInTheDocument();
    expect(screen.getByText("Remind", { exact: true })).toBeInTheDocument();
    expect(screen.getByText("For everyday life and small work, including home and family.")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("keeps baked cards, books, and wall note in the image only", () => {
    renderSite("/dev/founder-page-review/hsa-website");
    expect(screen.queryByText("Memories")).not.toBeInTheDocument();
    expect(screen.queryByText("Finances")).not.toBeInTheDocument();
    expect(screen.queryByText("Health")).not.toBeInTheDocument();
    expect(screen.queryByText("Good People Brighter Days")).not.toBeInTheDocument();
    expect(screen.queryByText("Contact Sales")).not.toBeInTheDocument();
  });

  it("renders How It Works as one continuous uncropped scene", () => {
    renderSite("/dev/founder-page-review/hsa-website/how-it-works");
    const nav = screen.getByRole("navigation", { name: "Human SmartArchive" });
    expect(within(nav).getByRole("link", { name: "How It Works" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "How It Works" })).toHaveAttribute(
      "href",
      "/dev/founder-page-review/hsa-website/how-it-works",
    );
    expect(screen.getByRole("img", { name: /continuous How It Works scene/i })).toHaveAttribute(
      "src",
      HSA_HOW_IT_WORKS_ASSETS.scene,
    );
    expect(screen.queryByText("This page is not specified yet.")).not.toBeInTheDocument();
    expect(screen.queryByText("Life moves forward. HSA keeps up.")).not.toBeInTheDocument();
    expect(screen.queryByText("Organized today. More possibilities tomorrow.")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "How It Works" })).not.toBeInTheDocument();
  });

  it("renders Features as one continuous uncropped landscape", () => {
    renderSite("/dev/founder-page-review/hsa-website/features");
    const nav = screen.getByRole("navigation", { name: "Human SmartArchive" });
    expect(within(nav).getByRole("link", { name: "Features" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Features" })).toHaveAttribute(
      "href",
      "/dev/founder-page-review/hsa-website/features",
    );
    expect(screen.getByRole("img", { name: /continuous HSA Features landscape/i })).toHaveAttribute(
      "src",
      HSA_FEATURES_ASSETS.scene,
    );
    expect(screen.queryByText("This page is not specified yet.")).not.toBeInTheDocument();
    expect(screen.queryByText("More clarity for what matters tomorrow.")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Features" })).not.toBeInTheDocument();
  });

  it("stubs unspecified marketing pages without inventing content", () => {
    renderSite("/dev/founder-page-review/hsa-website/life");
    expect(screen.getByRole("heading", { name: "Life (Use Cases)" })).toBeInTheDocument();
    expect(screen.getByText("This page is not specified yet.")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Human SmartArchive" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "HSA footer" })).toBeInTheDocument();
  });
});
