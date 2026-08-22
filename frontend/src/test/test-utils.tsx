import { render as rtlRender, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "../providers/LocaleProvider";
import { ThemeProvider } from "../providers/ThemeProvider";

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  );
}

export * from "@testing-library/react";

export function render(ui: ReactElement, options?: RenderOptions) {
  return rtlRender(ui, { wrapper: AllProviders, ...options });
}

export function renderWithRouter(ui: ReactElement, route = "/") {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}
