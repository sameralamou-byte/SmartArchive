import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../test/test-utils";
import { WeaveNode, WeaveThread } from "../WeaveThread";
import { DocumentMarginalia } from "../DocumentMarginalia";

describe("WeaveThread", () => {
  it("exposes a connection label and is not a button", () => {
    const frameRef = createRef<HTMLDivElement>();
    const originRef = createRef<HTMLElement>();
    const nodeRef = createRef<HTMLSpanElement>();
    render(
      <div ref={frameRef}>
        <mark ref={originRef}>origin</mark>
        <WeaveNode ref={nodeRef} />
        <WeaveThread frameRef={frameRef} originRef={originRef} nodeRef={nodeRef} />
      </div>,
    );
    const graphic = screen.getByRole("img", {
      name: "Connection from the marked sentence to the explanation",
    });
    expect(graphic).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("DocumentMarginalia", () => {
  it("keeps the original wording and adds a subordinate note", () => {
    render(
      <DocumentMarginalia note="Reply-by date">Bitte antworten Sie bis Freitag, den 23. Mai.</DocumentMarginalia>,
    );
    expect(screen.getByText("Bitte antworten Sie bis Freitag, den 23. Mai.")).toBeInTheDocument();
    expect(screen.getByText("Reply-by date")).toBeInTheDocument();
    expect(document.querySelector("[data-hsa-thread-origin]")).toBeTruthy();
  });
});
