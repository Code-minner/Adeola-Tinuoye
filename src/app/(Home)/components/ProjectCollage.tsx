"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { galleryProjects, type Project } from "@/data/projects";
import { useSmartVideo } from "@/lib/useSmartVideo";

const collage = galleryProjects;

const MONO_FONT = { fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" };

// --- Shared IntersectionObserver -------------------------------------
// One `new IntersectionObserver(...)` per tile doesn't scale — each
// instance is its own observation context the browser tracks separately.
// Every tile now registers a callback against a single shared observer
// instead, so the grid costs one observation context total, however many
// tiles it has.
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
    // Starts loading a little before a tile is actually visible, so
    // playback is ready by the time it's fully in view.
    { rootMargin: "120px 0px", threshold: 0.2 },
  );
  return sharedObserver;
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  // Sticky once true: mounts the <video> the first time the tile nears the
  // viewport, and never unmounts it again (so scrolling back and forth
  // doesn't re-fetch the file).
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

/**
 * Three standalone decorative rings — top-left, bottom-right, middle-left.
 * Positioned against the section edges with negative translate offsets so
 * they're partially cropped by the section's `overflow-hidden`, giving that
 * "bleeding off the edge" look.
 */
function SectionRings() {
  return (
    <>
      {/* top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[300px] w-[300px] -translate-x-1/3 -translate-y-1/3 rounded-full border border-white/10"
      />
      {/* bottom-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[340px] w-[340px] translate-x-1/3 translate-y-1/3 rounded-full border border-white/10"
      />
      {/* middle-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08]"
      />
    </>
  );
}

export default function ProjectCollage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Stable across renders so React.memo below actually skips re-rendering
  // tiles that aren't the one being hovered.
  const handleOpen = useCallback((id: string) => setActiveId(id), []);
  const handleClose = useCallback(
    (id: string) => setActiveId((current) => (current === id ? null : current)),
    [],
  );
  // Click target: opens the fullscreen player, separate from the hover
  // preview above so tapping on mobile (no hover) still works.
  const handlePlay = useCallback((id: string) => {
    const idx = collage.findIndex((p) => p.id === id);
    if (idx !== -1) setOpenIndex(idx);
  }, []);

  return (
    <section
      id="projects"
      className="page-shell section-pad relative overflow-hidden bg-[#0c0c0b]"
      style={MONO_FONT}
    >
      <SectionRings />

      <div className="relative flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Works</p>
          <p className="mt-2 text-sm text-white/40 md:hidden">Tap a frame to open the reel</p>
        </div>
        <p className="text-xs text-white/40">{String(collage.length).padStart(2, "0")} projects</p>
      </div>

      <div className="collage-grid relative mx-auto mt-8 grid w-full grid-cols-2 items-center justify-center gap-2.5 sm:mt-10 sm:gap-3 md:mt-12 md:gap-4 lg:gap-5">
        {collage.map((project, i) => (
          <ProjectTile
            key={project.id}
            project={project}
            index={i}
            total={collage.length}
            active={activeId === project.id}
            onOpen={handleOpen}
            onClose={handleClose}
            onPlay={handlePlay}
          />
        ))}
      </div>

      <VideoLightbox
        projects={collage}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={(next) => setOpenIndex(next)}
      />
    </section>
  );
}

/** Small L-shaped bracket used at each corner of a tile — a viewfinder/scope
 *  reticle that frames the shot on hover. This is the one deliberate "tech"
 *  motif for the grid; everything else stays quiet so this reads on purpose. */
function CornerBracket({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-4 w-4 border-white/70 sm:h-5 sm:w-5 ${className}`}
    />
  );
}

const ProjectTile = memo(function ProjectTile({
  project,
  index,
  total,
  active,
  onOpen,
  onClose,
  onPlay,
}: {
  project: Project;
  index: number;
  total: number;
  active: boolean;
  onOpen: (id: string) => void;
  onClose: (id: string) => void;
  onPlay: (id: string) => void;
}) {
  const { ref, isVisible, hasEntered } = useInView<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useSmartVideo(videoRef, isVisible, { enabled: hasEntered });

  // Stable per-tile handlers, tied to project.id so they don't get
  // recreated on every render of this tile.
  const openThis = useCallback(() => onOpen(project.id), [onOpen, project.id]);
  const closeThis = useCallback(() => onClose(project.id), [onClose, project.id]);
  const playThis = useCallback(() => onPlay(project.id), [onPlay, project.id]);

  return (
    <div
      ref={ref}
      className={`${project.cell} ${active ? "z-20" : "z-0"}`}
      onMouseEnter={openThis}
      onMouseLeave={closeThis}
    >
      <div
        className={`relative w-full origin-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#1c1c1a] via-[#201f1b] to-[#0c0c0b] transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:rounded-2xl ${project.frame} ${active ? "scale-[1.03] border-white/35 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.45)] md:scale-110 lg:scale-[1.18]" : "scale-100"}`}
      >
        <button
          type="button"
          aria-label={`Play ${project.title}`}
          aria-expanded={active}
          onClick={playThis}
          onFocus={openThis}
          onBlur={closeThis}
          className="absolute inset-0 block cursor-pointer border-0 bg-transparent p-0"
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
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur-sm">
              <PlayIcon className="h-4 w-4 translate-x-0.5" />
            </span>
          </span>
        </button>

        {/* viewfinder brackets — fade in only on the active tile */}
        <div
          className={`pointer-events-none absolute inset-2.5 transition-opacity duration-300 sm:inset-3 ${active ? "opacity-100" : "opacity-0"}`}
        >
          <CornerBracket className="left-0 top-0 border-l-2 border-t-2" />
          <CornerBracket className="right-0 top-0 border-r-2 border-t-2" />
          <CornerBracket className="bottom-0 left-0 border-b-2 border-l-2" />
          <CornerBracket className="bottom-0 right-0 border-b-2 border-r-2" />
        </div>

        {/* index readout, top-left — echoes the lightbox's 01 / 05 counter */}
        <span className="pointer-events-none absolute left-3 top-3 text-[10px] tracking-[0.15em] text-white/50 sm:text-xs">
          {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>

        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-3 sm:p-4">
          <div>
            <h2 className="text-sm font-semibold leading-tight text-white sm:text-base">{project.title}</h2>
            <p
              className={`overflow-hidden text-xs leading-snug text-white/85 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-sm ${active ? "mt-1 max-h-24 opacity-100" : "max-h-0 opacity-0"}`}
            >
              {project.summary}
            </p>
          </div>
        </div>
      </div>
    </div>
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
      className="fixed inset-0 z-50 flex flex-col bg-[#0c0c0b]/[0.98] backdrop-blur-md"
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

      <div className="relative border-t border-white/10 px-6 py-6 sm:px-10" onClick={(event) => event.stopPropagation()}>
        <h3 className="text-lg font-semibold text-white sm:text-xl">{project.title}</h3>
        {project.summary && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">{project.summary}</p>}
        {project.points.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
            {project.points.map((point) => (
              <li key={point} className="flex gap-2">
                <span aria-hidden className="text-white/40">
                  —
                </span>
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}