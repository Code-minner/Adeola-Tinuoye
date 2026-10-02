"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay in ms after the element enters view */
  delay?: number;
  /** Soft horizontal drift instead of a pure rise */
  from?: "up" | "left" | "right";
  as?: "div" | "header" | "span" | "li" | "nav" | "ul";
  /** For above-the-fold (Hero) — animate on mount instead of waiting for scroll */
  eager?: boolean;
};

/**
 * Extremely soft enter-on-scroll. Sticky once visible.
 * Use `eager` for Hero / first viewport so it plays on load.
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  from = "up",
  as: Tag = "div",
  eager = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (!eager) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [eager]);

  useEffect(() => {
    if (eager) return;
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`scroll-reveal scroll-reveal--${from} ${visible ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
