"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/data/projects";

const MONO_FONT = { fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" };

function seekToRandomStart(video: HTMLVideoElement) {
  if (Number.isFinite(video.duration) && video.duration > 0.5) {
    video.currentTime = Math.random() * Math.max(video.duration - 0.25, 0);
  }
}

// --- Shared IntersectionObserver -------------------------------------
// The previous version created one `new IntersectionObserver(...)` per
// tile. That's fine for a handful of tiles but doesn't scale — each
// instance is its own observation context the browser has to track. This
// gallery now shares a single observer across every tile; each tile just
// registers/unregisters a callback for its own element.
type VisibilityCallback = (visible: boolean) => void;
const visibilityCallbacks = new WeakMap<Element, VisibilityCallback>();
let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver() {
  if (sharedObserver || typeof IntersectionObserver === "undefined") return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        visibilityCallbacks.get(entry.target)?.(entry.isIntersecting);
      }
    },
    { rootMargin: "200px 0px", threshold: 0 },
  );
  return sharedObserver;
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    const observer = getSharedObserver();
    if (!node || !observer) return;

    visibilityCallbacks.set(node, (visible) => {
      setIsVisible(visible);
      if (visible) setHasEntered(true);
    });
    observer.observe(node);

    return () => {
      observer.unobserve(node);
      visibilityCallbacks.delete(node);
    };
  }, []);

  return { ref, isVisible, hasEntered };
}

/** Same viewfinder corner-bracket motif used across the site's project
 *  grids, so hover state reads consistently everywhere. */
function CornerBracket({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-4 w-4 border-white/70 sm:h-5 sm:w-5 ${className}`}
    />
  );
}

export default function SelectedWork() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const openAt = useCallback((id: string) => {
    const idx = projects.findIndex((p) => p.id === id);
    if (idx !== -1) setOpenIndex(idx);
  }, []);

  return (
    <section
      className="relative mx-auto w-full max-w-[1400px] overflow-hidden px-6 py-20 text-white sm:px-10 lg:px-14"
      style={MONO_FONT}
    >
      {/* Section-level rings — page texture around the grid */}
      <div aria-hidden className="pointer-events-none absolute -left-40 -top-32 h-[420px] w-[420px] rounded-full border border-white/10" />
      <div aria-hidden className="pointer-events-none absolute -right-32 top-1/3 h-[260px] w-[260px] rounded-full border border-white/[0.08]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-24 h-[380px] w-[380px] rounded-full border border-white/10" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/4 h-[200px] w-[200px] rounded-full border border-white/[0.06]" />

      <div className="relative flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Selected work</p>
        <p className="text-xs text-white/40">
          {String(projects.length).padStart(2, "0")} projects
        </p>
      </div>

      {/*
        A single responsive bento grid instead of a hand-tiered flex row
        split into "main" vs "extra" projects behind a toggle — every
        project shows here, and the layout adapts on its own at each
        breakpoint instead of relying on hard-coded per-index heights.
      */}
      <div className="relative mt-14 grid grid-cols-2 gap-3 auto-rows-[140px] sm:grid-cols-3 sm:gap-4 sm:auto-rows-[170px] lg:grid-cols-5 lg:gap-5 lg:auto-rows-[190px]">
        {projects.map((project, index) => (
          <Panel
            key={project.id}
            project={project}
            featured={index === 0}
            onOpen={() => openAt(project.id)}
          />
        ))}
      </div>

      <VideoLightbox
        projects={projects}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={(next) => setOpenIndex(next)}
      />
    </section>
  );
}

const Panel = memo(function Panel({
  project,
  featured,
  onOpen,
}: {
  project: Project;
  featured?: boolean;
  onOpen: () => void;
}) {
  const { ref, isVisible, hasEntered } = useInView<HTMLButtonElement>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const startedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotionRef.current) return;

    if (isVisible) {
      if (!startedRef.current) {
        const onReady = () => {
          seekToRandomStart(video);
          startedRef.current = true;
        };
        if (video.readyState >= 1) onReady();
        else video.addEventListener("loadedmetadata", onReady, { once: true });
      }
      void video.play();
    } else {
      video.pause();
    }
  }, [isVisible]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`Play ${project.title}`}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1c1c1a] via-[#201f1b] to-[#0c0c0b] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hovered ? "-translate-y-1 border-white/30" : ""
      } ${featured ? "col-span-2 row-span-2" : ""}`}
    >
      {hasEntered && (
        <video
          ref={videoRef}
          className="h-full w-full object-cover object-center"
          src={project.video}
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <div
        className={`pointer-events-none absolute inset-2.5 transition-opacity duration-300 sm:inset-3 ${hovered ? "opacity-100" : "opacity-0"}`}
      >
        <CornerBracket className="left-0 top-0 border-l-2 border-t-2" />
        <CornerBracket className="right-0 top-0 border-r-2 border-t-2" />
        <CornerBracket className="bottom-0 left-0 border-b-2 border-l-2" />
        <CornerBracket className="bottom-0 right-0 border-b-2 border-r-2" />
      </div>

      <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur-sm">
          <PlayIcon className="h-4 w-4 translate-x-0.5" />
        </span>
      </span>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 text-left sm:p-4">
        <p className="text-xs font-semibold text-white sm:text-sm">{project.title}</p>
        {project.summary && (
          <p
            className={`overflow-hidden text-[11px] leading-snug text-white/80 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-xs ${
              hovered ? "mt-1 max-h-16 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {project.summary}
          </p>
        )}
      </div>
    </button>
  );
});

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function VideoLightbox({
  projects,
  index,
  onClose,
  onNavigate,
}: {
  projects: Project[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const project = index !== null ? projects[index] : null;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (index === null) return;
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNavigate((index + 1) % projects.length);
      if (event.key === "ArrowLeft") onNavigate((index - 1 + projects.length) % projects.length);
    },
    [index, projects.length, onClose, onNavigate],
  );

  useEffect(() => {
    if (!project) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, handleKeyDown]);

  if (!project || index === null) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-50 flex flex-col bg-[#0c0c0b]/[0.98]"
      style={MONO_FONT}
      onClick={onClose}
    >
      <div className="relative flex items-center justify-between px-6 py-5 sm:px-10">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">
          {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/50"
        >
          ✕
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-10"
        onClick={(event) => event.stopPropagation()}
      >
        {/*
          Title/summary/tags now live on the video's own surface instead of
          in a separate panel underneath — a gradient scrim at the top
          keeps them legible without covering the native controls, which
          sit at the bottom of the video.
        */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/85 via-black/35 to-transparent px-6 pb-12 pt-2 sm:px-10">
          <h3 className="text-base font-semibold text-white sm:text-xl">{project.title}</h3>
          {project.summary && (
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-white/80 sm:text-sm">
              {project.summary}
            </p>
          )}
          {project.points.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/60 sm:text-xs">
              {project.points.map((point) => (
                <li key={point} className="flex gap-1.5">
                  <span aria-hidden className="text-white/40">
                    —
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>

        {projects.length > 1 && (
          <button
            type="button"
            aria-label="Previous project"
            onClick={() => onNavigate((index - 1 + projects.length) % projects.length)}
            className="absolute left-2 z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/50 sm:flex"
          >
            ‹
          </button>
        )}

        <video
          key={project.id}
          className="max-h-full max-w-full rounded-lg bg-black object-contain shadow-2xl"
          src={project.video}
          controls
          autoPlay
          playsInline
          preload="auto"
        />

        {projects.length > 1 && (
          <button
            type="button"
            aria-label="Next project"
            onClick={() => onNavigate((index + 1) % projects.length)}
            className="absolute right-2 z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/50 sm:flex"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}