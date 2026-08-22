import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { LocaleProvider, useLocale } from "./LocaleProvider";

function Probe() {
  const { locale, dir, setLocale, t } = useLocale();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="dir">{dir}</span>
      <span data-testid="translated">{t("confidence.high")}</span>
      <span data-testid="missing-key">{t("this.key.does.not.exist")}</span>
      <button onClick={() => setLocale("ar")}>to-ar</button>
      <button onClick={() => setLocale("de")}>to-de</button>
      <button onClick={() => setLocale("ru")}>to-ru</button>
      <button onClick={() => setLocale("uk")}>to-uk</button>
    </div>
  );
}

describe("LocaleProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("dir");
    document.documentElement.removeAttribute("lang");
  });

  it("defaults to English, ltr", () => {
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("locale")).toHaveTextContent("en");
    expect(screen.getByTestId("dir")).toHaveTextContent("ltr");
    expect(screen.getByTestId("translated")).toHaveTextContent("Mostly confident");
  });

  it("falls back to the key itself when a translation is missing", () => {
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("missing-key")).toHaveTextContent("this.key.does.not.exist");
  });

  it("switches to rtl and sets document.documentElement.dir when locale is Arabic", async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    );
    await user.click(screen.getByText("to-ar"));
    expect(screen.getByTestId("dir")).toHaveTextContent("rtl");
    expect(document.documentElement.dir).toBe("rtl");
    expect(document.documentElement.lang).toBe("ar");
  });

  it("stays ltr for German", async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    );
    await user.click(screen.getByText("to-de"));
    expect(screen.getByTestId("dir")).toHaveTextContent("ltr");
    expect(screen.getByTestId("translated")).toHaveTextContent("Größtenteils sicher");
  });

  it("stays ltr for Russian and translates with Cyrillic", async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    );
    await user.click(screen.getByText("to-ru"));
    expect(screen.getByTestId("dir")).toHaveTextContent("ltr");
    expect(document.documentElement.lang).toBe("ru");
    expect(screen.getByTestId("translated")).toHaveTextContent("В основном уверенно");
  });

  it("stays ltr for Ukrainian", async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    );
    await user.click(screen.getByText("to-uk"));
    expect(screen.getByTestId("dir")).toHaveTextContent("ltr");
    expect(screen.getByTestId("translated")).toHaveTextContent("Здебільшого впевнено");
  });

  it("persists the chosen locale to localStorage", async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    );
    await act(async () => {
      await user.click(screen.getByText("to-ar"));
    });
    expect(window.localStorage.getItem("smartarchive.locale")).toBe("ar");
  });
});
