"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, Send, Mail } from "lucide-react";

// lucide-react v1 removed trademarked brand icons (Github, Linkedin, Facebook,
// Instagram, etc). These are small inline replacements in the same 24x24
// stroke style so the look is unchanged. Swap for official brand SVGs or
// react-icons/si if you'd rather use maintained assets.
function Github(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  );
}

function Linkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function Facebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function Instagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Playground", href: "/playground" },
  { label: "Articles", href: "#articles" },
  { label: "Contacts", href: "#contacts" },
];

const socials = [
  { label: "Github", href: "https://github.com/Code-minner", icon: Github },
  { label: "Linkedin", href: "https://linkedin.com/in/opeyemi-boluwatife", icon: Linkedin },
  { label: "E-mail", href: "mailto:boluwatifeopeyemi@gmail.com", icon: Mail },
  { label: "Telegram", href: "https://t.me/Stem04", icon: Send },
  { label: "Facebook", href: "https://www.facebook.com/share/18xFHZ6gAC/", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/codeminner.tech/", icon: Instagram },
];

// 🎨 Each article carries its own background image. Drop in any file from
//    /public/assets and it'll bleed through the glass panel on top.
// If an image is missing/404s, the card falls back to a gradient instead of
// going blank (see the `onError` handler on the <img> below).
const articles = [
  {
    id: "kafka-golang",
    title: "The simplest example is kafka + golang",
    description:
      "This article presents a simple way to implement a micro-service architecture using Kafka, Golang and Docker.",
    href: "#",
    image: "/assets/gradient.jpg",
  },
  {
    id: "grpc-nextjs",
    title: "Wiring gRPC into a Next.js edge runtime",
    description:
      "A walkthrough of streaming typed data from a Go service straight into React server components.",
    href: "#",
    image: "/assets/gradient.jpg",
  },
  {
    id: "postgres-queues",
    title: "Building reliable queues on plain Postgres",
    description:
      "Why you might not need Kafka or Redis at all, and how SKIP LOCKED gets you most of the way there.",
    href: "#",
    image: "/assets/gradient2.jpg",
  },
];

// Responsive slide width, expressed as Tailwind classes. Unlike the old
// version, the transform math below no longer assumes a fixed percentage —
// it measures the real rendered slide in pixels, so changing these classes
// (or the viewport size) can never desync the carousel again.
const SLIDE_WIDTH_CLASSES = "w-[88%] sm:w-[78%] lg:w-[68%]";

// Animation timing — kept in one place so the loop stays in sync.
const TRANSITION_MS = 650;
const TRANSITION_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

// How long each slide stays before auto-advancing.
const AUTOPLAY_MS = 3500;

// Minimum horizontal drag (px) before a touch/mouse swipe counts as a slide change.
const SWIPE_THRESHOLD = 40;

export default function Hero() {
  const count = articles.length;

  // 🔁 Extended strip for a seamless infinite loop:
  //    [clone of LAST, ...real articles, clone of FIRST]
  //    Index map: 0 = clone last, 1..count = real, count+1 = clone first
  const strip = [articles[count - 1], ...articles, articles[0]];

  // Start on the 2nd real article (extended index 2).
  const [index, setIndex] = useState(2);

  // Transition flag. Starts false so the very first paint doesn't animate,
  // and is toggled off briefly whenever we silently snap from a clone to
  // its real counterpart.
  const [withTransition, setWithTransition] = useState(false);

  // Pause autoplay while the user hovers/touches the carousel or after a manual click.
  const [paused, setPaused] = useState(false);

  // --- Pixel-accurate measurement -------------------------------------
  // The old version positioned slides with a hard-coded percentage, which
  // only stays correct if the rendered slide width exactly matches that
  // number at every breakpoint. Any drift (responsive width classes, a late
  // web font, a scrollbar) pushes the "current" slide out of view. Measuring
  // the actual DOM size removes that failure mode entirely.
  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({ viewport: 0, slide: 0 });

  const measure = useCallback(() => {
    const viewport = viewportRef.current?.offsetWidth ?? 0;
    const slide = slideRef.current?.offsetWidth ?? 0;
    setMetrics((prev) =>
      prev.viewport === viewport && prev.slide === slide
        ? prev
        : { viewport, slide }
    );
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (slideRef.current) ro.observe(slideRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Re-enable transitions once the DOM has settled after a snap (or on mount).
  // Double rAF guarantees the browser has painted the "no-transition" state
  // before we turn transitions back on.
  useEffect(() => {
    if (withTransition) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setWithTransition(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [withTransition]);

  // ⏱️ Autoplay — advances one slide every AUTOPLAY_MS.
  useEffect(() => {
    if (paused) return;
    if (!withTransition) return; // wait until the snap has settled

    const id = setTimeout(() => {
      setIndex((i) => i + 1);
    }, AUTOPLAY_MS);

    return () => clearTimeout(id);
  }, [index, paused, withTransition]);

  const go = (delta: number) => {
    // Ignore clicks while we're silently snapping between clones.
    if (!withTransition) return;
    // Clamp to the extended strip so rapid clicks can't fall off the ends.
    setIndex((i) => Math.max(0, Math.min(count + 1, i + delta)));
  };

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    // Only react to the transform transition — child opacity transitions also
    // bubble up here and would fire this handler again.
    if (e.propertyName !== "transform") return;

    if (index === count + 1) {
      // We just animated onto the clone of the FIRST article.
      // Silently jump to the real FIRST article — visually identical position.
      setWithTransition(false);
      setIndex(1);
    } else if (index === 0) {
      // We just animated onto the clone of the LAST article.
      // Silently jump to the real LAST article.
      setWithTransition(false);
      setIndex(count);
    }
  };

  // --- Touch / mouse swipe ---------------------------------------------
  const dragStartX = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!withTransition) return;
    dragStartX.current = e.clientX;
    setDragOffset(0);
    setIsDragging(true);
    setPaused(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    setDragOffset(e.clientX - dragStartX.current);
  };

  const endDrag = () => {
    if (dragStartX.current === null) return;
    if (dragOffset > SWIPE_THRESHOLD) go(-1);
    else if (dragOffset < -SWIPE_THRESHOLD) go(1);
    dragStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);
    setPaused(false);
  };

  const slideWidth = metrics.slide;
  const centerOffset = (metrics.viewport - slideWidth) / 2;
  const translatePx = centerOffset - index * slideWidth;

  return (
    <section
      className="page-shell section-pad relative overflow-x-clip bg-[#0c0c0b] text-white"
      style={{ fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" }}
    >
      {/* decorative corner ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10"
      />

      {/* nav */}
      <nav className="relative z-10 flex items-start justify-between">
        <div className="text-base leading-tight">
          <p>Opeyemi</p>
          <p>Boluwatife</p>
        </div>

        <ul className="hidden gap-8 pt-1 text-sm text-white/70 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-end gap-1 pt-1 text-sm">
          <button className="text-white/50 transition-colors hover:text-white">
            En
          </button>
          <button className="text-white">Ge</button>
        </div>
      </nav>

      {/* headline */}
      <div className="relative z-10 mt-12 sm:mt-16 lg:mt-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="text-6xl font-bold leading-none tracking-tight sm:text-7xl lg:text-8xl">
            Full-stack
          </h1>

          <a
            href="#projects"
            className="group inline-flex items-center gap-4 rounded-full bg-white py-2 pl-6 pr-2 text-base italic text-[#0c0c0b]"
          >
            Projects
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0c0c0b] text-white transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </span>
          </a>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 md:items-end md:gap-10">
          <p className="max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            My goal is to{" "}
            <em className="italic text-white">write maintainable, clean</em> and{" "}
            <em className="italic text-white">understandable code</em> to
            process development was enjoyable.
          </p>

          <h1 className="text-right text-6xl font-bold leading-none tracking-tight sm:text-7xl lg:text-9xl">
            Developer
          </h1>
        </div>
      </div>

      {/* socials */}
      <ul className="relative z-10 mt-10 flex flex-wrap gap-3">
        {socials.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm italic text-white/90 transition-colors hover:border-white/40 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* article carousel */}
      <div
        className="relative z-10 mt-12 sm:mt-14"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="relative">
          <div
            ref={viewportRef}
            className="overflow-hidden touch-pan-y"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
          >
            <div
              onTransitionEnd={handleTransitionEnd}
              className="flex select-none"
              style={{
                transform: `translateX(${translatePx + dragOffset}px)`,
                transition:
                  withTransition && !isDragging
                    ? `transform ${TRANSITION_MS}ms ${TRANSITION_EASE}`
                    : "none",
              }}
            >
              {strip.map((article, i) => (
                <div
                  key={`${article.id}-${i}`}
                  ref={i === index ? slideRef : undefined}
                  className={`shrink-0 px-2 sm:px-3 ${SLIDE_WIDTH_CLASSES}`}
                  style={{
                    opacity: i === index ? 1 : 0.28,
                    transform: i === index ? "scale(1)" : "scale(0.96)",
                    transition: withTransition
                      ? `opacity ${TRANSITION_MS}ms ${TRANSITION_EASE}, transform ${TRANSITION_MS}ms ${TRANSITION_EASE}`
                      : "none",
                  }}
                >
                  <div
                    className="relative h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1c1c1a] via-[#2a2a26] to-[#0c0c0b] shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:h-[340px] lg:h-[380px]"
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => {
                        // Hide the broken-image glyph and let the gradient
                        // fallback show instead of a blank card.
                        e.currentTarget.style.display = "none";
                      }}
                    />

                    {/*
                      Contrast gradient behind the glass panel.
                      Mobile: bottom-up (panel is at the bottom).
                      Desktop: left-to-right (panel is on the right).
                    */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-black/50" />

                    {/*
                      Frosted glass panel.
                      Mobile: anchored bottom, 70% height, full width.
                      Desktop (sm+): right half, full height.
                    */}
                    <div className="absolute bottom-0 left-0 right-0 flex h-[60%] flex-col justify-end gap-3 border-t border-white/15 bg-white/[0.06] p-5 backdrop-blur-2xl backdrop-saturate-150 sm:inset-y-0 sm:left-auto sm:h-auto sm:w-1/2 sm:justify-center sm:gap-4 sm:border-l sm:border-t-0 sm:p-8">
                      {/* top hairline highlight — sells the "pane of glass" look */}
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                      <h3 className="text-base font-semibold leading-snug sm:text-xl">
                        {article.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-white/70 sm:text-sm">
                        {article.description}
                      </p>
                      <a
                        href={article.href}
                        className="group inline-flex w-fit items-center gap-3 rounded-full bg-white py-1.5 pl-4 pr-1.5 text-xs italic text-[#0c0c0b] sm:py-2 sm:pl-5 sm:pr-2 sm:text-sm"
                      >
                        Read more
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0c0c0b] text-white transition-transform group-hover:translate-x-0.5 sm:h-8 sm:w-8">
                          <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            aria-label="Previous article"
            onClick={() => go(-1)}
            className="absolute left-0 top-1/2 z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#0c0c0b] transition-colors hover:border-white/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next article"
            onClick={() => go(1)}
            className="absolute right-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-white/20 bg-[#0c0c0b] transition-colors hover:border-white/40"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}