"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { useSmartVideo } from "@/lib/useSmartVideo";

const MONO = { fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" };

function VideoStage({ project, reverse }: { project: Project; reverse: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = stageRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.35, rootMargin: "40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useSmartVideo(videoRef, visible);

  return (
    <div ref={stageRef} className="relative w-full">
      <div
        className={`absolute -top-3 z-20 rounded-full border border-white/15 bg-[#0c0c0b]/85 px-3 py-1 text-[10px] tracking-[0.2em] text-white/55 backdrop-blur-md ${
          reverse ? "left-3" : "right-3"
        }`}
      >
        {project.tag ?? "LAB"} · {project.year ?? "2025"}
      </div>

      <div className="futuristic-panel relative overflow-hidden rounded-[28px] border border-white/12 bg-[#10100e]">
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),transparent_30%,transparent_70%,rgba(186,230,253,0.07))]" />

        <div className="relative aspect-[16/11] overflow-hidden sm:aspect-[16/10]">
          {visible ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={project.video}
              muted
              loop
              playsInline
              preload="none"
            />
          ) : (
            <div className="h-full w-full bg-[#141412]" aria-hidden />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/55 via-transparent to-black/20" />

          <span aria-hidden className="absolute left-4 top-4 h-5 w-5 border-l-2 border-t-2 border-white/50" />
          <span aria-hidden className="absolute right-4 top-4 h-5 w-5 border-r-2 border-t-2 border-white/50" />
          <span aria-hidden className="absolute bottom-4 left-4 h-5 w-5 border-b-2 border-l-2 border-white/50" />
          <span aria-hidden className="absolute bottom-4 right-4 h-5 w-5 border-b-2 border-r-2 border-white/50" />

          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Live capture</p>
              <p className="mt-1 text-sm font-medium text-white">{project.title}</p>
            </div>
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] backdrop-blur-md ${
                project.status === "live"
                  ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-300"
                  : project.status === "beta"
                    ? "border-amber-200/30 bg-amber-200/10 text-amber-200"
                    : "border-sky-200/30 bg-sky-200/10 text-sky-200"
              }`}
            >
              {project.status ?? "lab"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-px border-t border-white/10 bg-white/5">
          {project.points.slice(0, 3).map((point) => (
            <div key={point} className="bg-[#0c0c0b] px-3 py-3 text-[11px] leading-snug text-white/55 sm:px-4">
              {point}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectMotionRow({
  project,
  reverse,
  index,
}: {
  project: Project;
  reverse: boolean;
  index: number;
}) {
  const rowRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = rowRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={rowRef}
      className={`reveal-row flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14 ${
        reverse ? "lg:flex-row-reverse" : ""
      } ${inView ? "is-visible" : ""}`}
      style={MONO}
      data-from={reverse ? "right" : "left"}
    >
      <div className="reveal-copy flex w-full flex-col gap-5 lg:w-[340px] lg:shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[11px] tracking-[0.2em] text-white/40">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent" />
        </div>

        <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{project.title}</h3>

        <ul className="flex flex-wrap gap-2.5">
          {(project.stack ?? []).map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-sm text-white/85 transition-colors hover:border-white/35"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-white/70 sm:text-base">
            <em className="italic text-white">{project.title}</em>
            {" — "}
            {project.summary}
          </p>
          {project.points[0] ? (
            <p className="text-sm leading-relaxed text-white/70 sm:text-base">
              This build focuses on{" "}
              <em className="italic text-white">{project.points[0].toLowerCase()}</em>
              {project.points[1] ? (
                <>
                  {" "}
                  and <em className="italic text-white">{project.points[1].toLowerCase()}</em>
                </>
              ) : null}
              .
            </p>
          ) : null}
        </div>

        <Link
          href="#contacts"
          className="group mt-1 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 p-1.5 transition-colors hover:border-white/40"
        >
          <span className="px-3 text-sm text-white/80">Case notes</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0c0c0b] transition-transform group-hover:translate-x-0.5">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      <div className="reveal-media w-full lg:flex-1">
        <VideoStage project={project} reverse={reverse} />
      </div>
    </article>
  );
}
