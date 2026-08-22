import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { render, screen } from "../test/test-utils";
import DocumentUnderstanding from "./DocumentUnderstanding";

describe("DocumentUnderstanding (HSA-08)", () => {
  it("keeps the German original as authority and does not show a fake percentage", () => {
    render(<DocumentUnderstanding />);
    expect(screen.getByText("Demonstration content — not a real document")).toBeInTheDocument();
    expect(screen.getByText("Gemeinschaftshinweis (Demo)")).toBeInTheDocument();
    expect(screen.getByText("Bitte antworten Sie bis Freitag, den 23. Mai.")).toBeInTheDocument();
    expect(screen.getByText("Mostly confident")).toBeInTheDocument();
    expect(screen.queryByText(/92%/)).not.toBeInTheDocument();
    expect(screen.queryByText(/87%/)).not.toBeInTheDocument();
    expect(screen.getByText("SmartArchive suggests. You decide.")).toBeInTheDocument();
    expect(screen.getByText("AI-suggested")).toBeInTheDocument();
    expect(document.querySelector("[data-hsa-thread-origin]")).toBeTruthy();
    expect(document.querySelector("[data-hsa-thread-node]")).toBeTruthy();
    expect(
      screen.getByRole("img", { name: "Connection from the marked sentence to the explanation" }),
    ).toBeInTheDocument();
  });

  it("does not add a reminder until the human confirms", async () => {
    const user = userEvent.setup();
    render(<DocumentUnderstanding />);
    await user.click(screen.getByRole("button", { name: "Add a reminder" }));
    expect(screen.getByRole("dialog", { name: "Add this reminder?" })).toBeInTheDocument();
    expect(
      screen.queryByText("Reminder saved. You can change or remove it later."),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(screen.getByText("Reminder saved. You can change or remove it later.")).toBeInTheDocument();
  });

  it("cancels the suggestion without executing it", async () => {
    const user = userEvent.setup();
    render(<DocumentUnderstanding />);
    await user.click(screen.getByRole("button", { name: "Add a reminder" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add a reminder" })).toBeInTheDocument();
  });

  it("switches Arabic to rtl while keeping the German original", async () => {
    const user = userEvent.setup();
    render(<DocumentUnderstanding />);
    await user.click(screen.getByRole("button", { name: "AR" }));
    expect(document.documentElement.dir).toBe("rtl");
    expect(document.documentElement.lang).toBe("ar");
    expect(screen.getByText("Bitte antworten Sie bis Freitag, den 23. Mai.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("فهم هذا المستند");
  });

  it("renders Ukrainian explanation without translating the original", async () => {
    const user = userEvent.setup();
    render(<DocumentUnderstanding />);
    await user.click(screen.getByRole("button", { name: "UK" }));
    expect(document.documentElement.dir).toBe("ltr");
    expect(screen.getByText("Gemeinschaftshinweis (Demo)")).toBeInTheDocument();
    expect(
      screen.getByText("У цьому листі просять відповісти до дати, зазначеної в оригіналі."),
    ).toBeInTheDocument();
  });
});
