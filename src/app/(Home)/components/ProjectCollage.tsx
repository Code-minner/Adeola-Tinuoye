"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { galleryProjects, type Project } from "@/data/projects";
import { useSmartVideo } from "@/lib/useSmartVideo";
import ScrollReveal from "@/components/ScrollReveal";
import { warmVideo, warmVideos } from "@/lib/warmVideo";

const slides = galleryProjects;
const COUNT = slides.length;

const MONO_FONT = { fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" };

type Layout = { card: number; cardH: number; stageH: number; step: number; mobile: boolean };

/** Everything is sized from the real stage width, so neighbours always peek in. */
function measure(w: number): Layout {
  const mobile = w < 640;
  const card = mobile ? Math.min(w * 0.74, 360) : Math.min(w * 0.46, 640);
  const cardH = card * (mobile ? 1.3 : 0.62);
  return { card, cardH, stageH: cardH + (mobile ? 40 : 80), step: card * (mobile ? 0.64 : 0.74), mobile };
}

function SectionRings() {
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-[300px] w-[300px] -translate-x-1/3 -translate-y-1/3 rounded-full border border-white/10" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-[340px] w-[340px] translate-x-1/3 translate-y-1/3 rounded-full border border-white/10" />
    </>
  );
}

export default function ProjectCollage() {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [layout, setLayout] = useState<Layout>(() => measure(1000));

  const layoutRef = useRef(layout);
  const indexRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<number | null>(null);
  const lockRef = useRef(false);
  const suppressClickRef = useRef(false);
  const dragRef = useRef({ active: false, armed: false, startX: 0, startY: 0, lastX: 0, lastT: 0, velocity: 0 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const apply = () => {
      const next = measure(stage.clientWidth || 360);
      layoutRef.current = next;
      setLayout(next);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const stopAnim = useCallback(() => {
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  }, []);

  const goTo = useCallback(
    (next: number, duration = 520) => {
      const clamped = ((next % COUNT) + COUNT) % COUNT;
      stopAnim();
      lockRef.current = true;

      const from = indexRef.current + dragOffsetRef.current;
      let to = clamped;
      while (to - from > COUNT / 2) to -= COUNT;
      while (to - from < -COUNT / 2) to += COUNT;

      dragOffsetRef.current = 0;
      setDragOffset(0);
      setDragging(false);

      if (Math.abs(to - from) < 0.001) {
        indexRef.current = clamped;
        setIndex(clamped);
        lockRef.current = false;
        return;
      }

      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        const pos = from + (to - from) * eased;
        const base = Math.round(pos);
        indexRef.current = ((base % COUNT) + COUNT) % COUNT;
        dragOffsetRef.current = pos - base;
        setIndex(indexRef.current);
        setDragOffset(pos - base);

        if (t < 1) {
          animRef.current = requestAnimationFrame(tick);
        } else {
          indexRef.current = clamped;
          dragOffsetRef.current = 0;
          setIndex(clamped);
          setDragOffset(0);
          animRef.current = null;
          lockRef.current = false;
        }
      };
      animRef.current = requestAnimationFrame(tick);
    },
    [stopAnim],
  );

  const stepBy = useCallback(
    (dir: 1 | -1) => {
      if (lockRef.current) return;
      goTo(indexRef.current + dir);
    },
    [goTo],
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Warm the first clips before the carousel is fully on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const urls = [
          slides[0]?.video,
          slides[1]?.video,
          slides[slides.length - 1]?.video,
        ].filter(Boolean) as string[];
        warmVideos(urls, "auto");
        io.disconnect();
      },
      { rootMargin: "400px 0px", threshold: 0.01 },
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  // Keep current + neighbours buffered while browsing.
  useEffect(() => {
    const urls = [0, 1, -1, 2, -2].map((d) => {
      const i = ((index + d) % COUNT + COUNT) % COUNT;
      return slides[i]?.video;
    }).filter(Boolean) as string[];
    warmVideos(urls, "auto");
  }, [index]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 8) return;
      e.preventDefault();
      stepBy(e.deltaX > 0 ? 1 : -1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepBy(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepBy(-1);
      }
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("keydown", onKey);
    return () => {
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("keydown", onKey);
      stopAnim();
    };
  }, [stepBy, stopAnim]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-slide-nav]")) return;
    dragRef.current = { active: false, armed: true, startX: e.clientX, startY: e.clientY, lastX: e.clientX, lastT: performance.now(), velocity: 0 };
    suppressClickRef.current = false;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.armed && !drag.active) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (!drag.active) {
      if (Math.hypot(dx, dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.armed = false; // vertical intent: let the page scroll
        return;
      }
      stopAnim();
      lockRef.current = false;
      drag.active = true;
      suppressClickRef.current = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    const now = performance.now();
    const dt = Math.max(now - drag.lastT, 1);
    drag.velocity = ((e.clientX - drag.lastX) / dt) * 16;
    drag.lastX = e.clientX;
    drag.lastT = now;
    // 1 slide == 1 step of pixels, so the card tracks the finger 1:1
    const offset = -dx / layoutRef.current.step;
    dragOffsetRef.current = offset;
    setDragOffset(offset);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const was = drag.active;
    drag.active = false;
    drag.armed = false;
    setDragging(false);

    if (was) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    } else {
      dragOffsetRef.current = 0;
      setDragOffset(0);
      return;
    }

    const coast = (-drag.velocity / layoutRef.current.step) * 3;
    goTo(Math.round(indexRef.current + dragOffsetRef.current + coast));
  };

  const active = slides[index];

  return (
    <section id="projects" className="section-pad relative overflow-x-clip bg-[#0c0c0b]" style={MONO_FONT}>
      <style>{CSS}</style>
      <SectionRings />

      <div className="page-shell relative flex items-end justify-between gap-4">
        <ScrollReveal>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Works</p>
            <p className="mt-2 text-sm text-white/40">Swipe or drag sideways · scroll the page normally</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <p className="text-xs text-white/40">
            {String(index + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
          </p>
        </ScrollReveal>
      </div>

      <div
        ref={stageRef}
        className={`pc-stage ${dragging ? "is-dragging" : ""}`}
        style={{ height: layout.stageH }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="region"
        aria-roledescription="carousel"
        aria-label="Project slides"
        tabIndex={0}
      >
        <div className="pc-scene">
          {slides.map((project, i) => {
            let offset = i - index - dragOffset;
            if (offset > COUNT / 2) offset -= COUNT;
            if (offset < -COUNT / 2) offset += COUNT;
            return (
              <SlideCard
                key={project.id}
                project={project}
                index={i}
                total={COUNT}
                offset={offset}
                layout={layout}
                dragging={dragging}
                suppressClickRef={suppressClickRef}
                onSelect={() => goTo(i)}
                onPlay={() => setOpenIndex(i)}
              />
            );
          })}
        </div>
        <span aria-hidden className="pc-fade pc-fade-l" />
        <span aria-hidden className="pc-fade pc-fade-r" />
      </div>

      <div className="relative z-10 mt-2 flex items-center justify-center gap-4">
        <button type="button" data-slide-nav aria-label="Previous project" onClick={() => stepBy(-1)} className="pc-nav">
          ‹
        </button>
        <p className="min-w-[8rem] max-w-[60vw] truncate text-center text-sm font-medium tracking-wide text-white">{active?.title}</p>
        <button type="button" data-slide-nav aria-label="Next project" onClick={() => stepBy(1)} className="pc-nav">
          ›
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {slides.map((project, i) => (
          <button
            key={project.id}
            type="button"
            data-slide-nav
            aria-label={`Go to ${project.title}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-white" : "w-1.5 bg-white/25 hover:bg-white/45"}`}
          />
        ))}
      </div>

      <VideoLightbox projects={slides} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={(n) => setOpenIndex(n)} />
    </section>
  );
}

const SlideCard = memo(function SlideCard({
  project,
  index,
  total,
  offset,
  layout,
  dragging,
  suppressClickRef,
  onSelect,
  onPlay,
}: {
  project: Project;
  index: number;
  total: number;
  offset: number;
  layout: Layout;
  dragging: boolean;
  suppressClickRef: React.MutableRefObject<boolean>;
  onSelect: () => void;
  onPlay: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const abs = Math.abs(offset);
  const isFront = abs < 0.35;
  const near = abs < 0.85;
  const visible = abs < (layout.mobile ? 1.9 : 2.35);
  const [ready, setReady] = useState(false);

  const rotateY = offset * (layout.mobile ? -24 : -26);
  const x = offset * layout.step;
  const z = isFront ? 40 : -abs * 140;
  const scale = isFront ? 1 : 1 - Math.min(abs, 2) * 0.1;
  const opacity = visible ? 1 - Math.min(abs, 2) * 0.26 : 0;
  const blur = Math.min(abs, 2) * (layout.mobile ? 1.6 : 2.6);
  const brightness = 1 - Math.min(abs, 2) * 0.3;

  // Start from 0 — random seek forces a late download and feels slow.
  useSmartVideo(videoRef, near, { enabled: visible, randomStartOnce: false });

  useEffect(() => {
    setReady(false);
    const video = videoRef.current;
    if (!video || !visible) return;

    const mark = () => setReady(true);
    if (video.readyState >= 2) mark();
    video.addEventListener("loadeddata", mark);
    video.addEventListener("canplay", mark);
    // Kick the network immediately for front/near cards.
    if (near) {
      video.preload = "auto";
      try {
        video.load();
      } catch {
        // ignore
      }
    }

    return () => {
      video.removeEventListener("loadeddata", mark);
      video.removeEventListener("canplay", mark);
    };
  }, [project.video, visible, near]);

  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (isFront) onPlay();
    else onSelect();
  };

  if (!visible) return null;

  return (
    <div
      className={`pc-card ${isFront ? "is-front" : ""} ${dragging ? "no-ease" : ""}`}
      style={{
        width: layout.card,
        height: layout.cardH,
        transform: `translate3d(calc(-50% + ${x.toFixed(1)}px), -50%, ${z.toFixed(1)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
        opacity,
        filter: `brightness(${brightness.toFixed(2)}) blur(${blur.toFixed(1)}px)`,
        zIndex: Math.round(40 - abs * 10),
        pointerEvents: abs < 1.2 ? "auto" : "none",
      }}
    >
      <button
        type="button"
        aria-label={isFront ? `Play ${project.title}` : `Show ${project.title}`}
        onClick={handleClick}
        className="pc-face"
      >
        <span className={`pc-video-shell ${ready ? "is-ready" : ""}`}>
          <video
            ref={videoRef}
            className="h-full w-full object-cover object-center"
            src={project.video}
            muted
            loop
            playsInline
            preload={near ? "auto" : "metadata"}
            disablePictureInPicture
            disableRemotePlayback
          />
        </span>
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {isFront && (
          <span className="pc-play pointer-events-none">
            <PlayIcon className="h-4 w-4 translate-x-0.5" />
          </span>
        )}

        <span className="pointer-events-none absolute left-3 top-3 text-[10px] tracking-[0.15em] text-white/60 sm:text-xs">
          {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>

        <span className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <span className="block text-sm font-semibold text-white sm:text-base">{project.title}</span>
          {isFront && project.summary ? (
            <span className="mt-1 block text-xs leading-snug text-white/80 sm:text-sm line-clamp-2">{project.summary}</span>
          ) : null}
        </span>
      </button>
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
        <button type="button" onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/50">
          ✕
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-3 sm:px-10 sm:pb-4" onClick={(e) => e.stopPropagation()}>
        {projects.length > 1 && (
          <button type="button" aria-label="Previous project" onClick={() => onNavigate((index - 1 + projects.length) % projects.length)} className="absolute left-2 z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/50 sm:flex">
            ‹
          </button>
        )}
        <video key={project.id} className="h-full w-full max-w-[1500px] rounded-lg bg-black object-contain shadow-2xl" src={project.video} controls autoPlay playsInline preload="auto" />
        {projects.length > 1 && (
          <button type="button" aria-label="Next project" onClick={() => onNavigate((index + 1) % projects.length)} className="absolute right-2 z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/50 sm:flex">
            ›
          </button>
        )}
      </div>

      <div className="relative max-h-[26svh] overflow-y-auto border-t border-white/10 px-6 py-5 sm:px-10 sm:py-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-white sm:text-xl">{project.title}</h3>
        {project.summary && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">{project.summary}</p>}
        {project.points.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
            {project.points.map((point) => (
              <li key={point} className="flex gap-2">
                <span aria-hidden className="text-white/40">—</span>
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const CSS = `
.pc-stage{position:relative;width:100%;max-width:1280px;margin:1.5rem auto 0;perspective:1300px;perspective-origin:50% 45%;
  touch-action:pan-y;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;outline:none;cursor:grab}
.pc-stage.is-dragging{cursor:grabbing}
.pc-stage:focus-visible{box-shadow:inset 0 0 0 1px rgba(255,255,255,.35)}
.pc-scene{position:absolute;inset:0;transform-style:preserve-3d}
.pc-card{position:absolute;left:50%;top:50%;will-change:transform,opacity,filter;backface-visibility:hidden}
.pc-face{position:relative;display:block;width:100%;height:100%;overflow:hidden;border-radius:20px;border:1px solid rgba(255,255,255,.12);
  background:#111;text-align:left;cursor:pointer;box-shadow:0 18px 40px -18px rgba(0,0,0,.8);transition:border-color .4s,box-shadow .4s}
.pc-video-shell{position:absolute;inset:0;background:#141412}
.pc-video-shell video{opacity:0;transition:opacity .45s ease}
.pc-video-shell.is-ready video{opacity:1}
.pc-card.is-front .pc-face{border-color:rgba(255,255,255,.34);box-shadow:0 36px 80px -24px rgba(0,0,0,.95),0 0 70px -18px rgba(255,255,255,.16)}
.pc-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s}
.pc-play::before{content:"";position:absolute;width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:rgba(0,0,0,.45);backdrop-filter:blur(4px)}
.pc-play svg{position:relative;color:#fff}
.pc-face:hover .pc-play,.pc-face:focus-visible .pc-play{opacity:1}
@media (hover:none){.pc-play{opacity:1}.pc-play::before{width:42px;height:42px}}
.pc-fade{position:absolute;top:0;bottom:0;width:14%;max-width:140px;z-index:60;pointer-events:none}
.pc-fade-l{left:0;background:linear-gradient(90deg,#0c0c0b,transparent)}
.pc-fade-r{right:0;background:linear-gradient(270deg,#0c0c0b,transparent)}
.pc-nav{width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:50%;border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.8);
  background:transparent;transition:color .2s,border-color .2s;cursor:pointer}
.pc-nav:hover,.pc-nav:focus-visible{border-color:rgba(255,255,255,.55);color:#fff;outline:none}
@media (max-width:640px){.pc-fade{width:8%}}
@media (prefers-reduced-motion:reduce){.pc-face{transition:none}}
`;