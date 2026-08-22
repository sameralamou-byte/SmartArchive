import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useState,
  type HTMLAttributes,
  type RefObject,
} from "react";
import { useLocale } from "../providers/LocaleProvider";

function threadPath(startX: number, startY: number, endX: number, endY: number): string {
  const dx = endX - startX;
  const dy = endY - startY;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return `M ${startX} ${startY} C ${startX + dx * 0.45} ${startY}, ${endX - dx * 0.45} ${endY}, ${endX} ${endY}`;
  }
  return `M ${startX} ${startY} C ${startX} ${startY + dy * 0.45}, ${endX} ${endY - dy * 0.45}, ${endX} ${endY}`;
}

export interface WeaveThreadProps {
  frameRef: RefObject<HTMLElement | null>;
  originRef: RefObject<HTMLElement | null>;
  nodeRef: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Frozen HSA-08 A — Thread connecting a marked document sentence to the Node.
 * Petrol/teal stroke. Not a dashboard rule, not an AI symbol, not interactive.
 */
export function WeaveThread({ frameRef, originRef, nodeRef, className = "" }: WeaveThreadProps) {
  const { t, dir } = useLocale();
  const [d, setD] = useState("");

  const update = useCallback(() => {
    const frame = frameRef.current;
    const origin = originRef.current;
    const node = nodeRef.current;
    if (!frame || !origin || !node) {
      setD("");
      return;
    }

    const frameBox = frame.getBoundingClientRect();
    const originBox = origin.getBoundingClientRect();
    const nodeBox = node.getBoundingClientRect();
    if (frameBox.width < 8 || originBox.width < 1 || nodeBox.width < 1) {
      setD("");
      return;
    }

    const startX = (dir === "rtl" ? originBox.left : originBox.right) - frameBox.left;
    const startY = originBox.top + originBox.height / 2 - frameBox.top;
    const endX = nodeBox.left + nodeBox.width / 2 - frameBox.left;
    const endY = nodeBox.top + nodeBox.height / 2 - frameBox.top;
    setD(threadPath(startX, startY, endX, endY));
  }, [dir, frameRef, nodeRef, originRef]);

  useLayoutEffect(() => {
    update();
    const frame = frameRef.current;
    const origin = originRef.current;
    const node = nodeRef.current;
    window.addEventListener("resize", update);
    if (!frame || typeof ResizeObserver === "undefined") {
      return () => window.removeEventListener("resize", update);
    }
    const observer = new ResizeObserver(() => update());
    observer.observe(frame);
    if (origin) observer.observe(origin);
    if (node) observer.observe(node);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [frameRef, nodeRef, originRef, update]);

  return (
    <svg
      className={`pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible ${className}`}
      role="img"
      aria-label={t("hsa.thread.label")}
    >
      {d ? (
        <path
          d={d}
          fill="none"
          stroke="var(--info)"
          strokeWidth="1.25"
          strokeLinecap="round"
          data-hsa-thread-path=""
        />
      ) : null}
    </svg>
  );
}

/**
 * Frozen HSA-08 A — small matte copper Node where the Thread meets the explanation.
 * Not a button, orb, badge, or character.
 */
export const WeaveNode = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  function WeaveNode({ className = "", ...rest }, ref) {
    return (
      <span
        ref={ref}
        data-hsa-thread-node=""
        className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2 ${className}`}
        aria-hidden
        {...rest}
      />
    );
  },
);
