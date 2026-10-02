"use client";

import { playgroundProjects } from "@/data/projects";
import ProjectMotionRow from "./ProjectMotionRow";
import ScrollReveal from "@/components/ScrollReveal";

const MONO = { fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" };

export default function FeaturedProjects() {
  return (
    <section
      id="featured-projects"
      className="page-shell section-pad relative overflow-hidden bg-[#0c0c0b] text-white"
      style={MONO}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 top-8 h-[420px] w-[420px] rounded-full border border-white/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-16 h-[360px] w-[360px] rounded-full border border-white/[0.08]"
      />

      <ScrollReveal className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white sm:text-base">... /Projects ...</p>
          <p className="mt-2 max-w-md text-sm text-white/45">
            Deeper builds outside the collage — left to right, then right to left.
          </p>
        </div>
        <p className="text-xs tracking-[0.18em] text-white/35">
          {String(playgroundProjects.length).padStart(2, "0")} units
        </p>
      </ScrollReveal>

      <div className="relative mt-10 flex flex-col gap-16 sm:mt-12 sm:gap-20 lg:gap-24">
        {playgroundProjects.map((project, index) => (
          <ProjectMotionRow
            key={project.id}
            project={project}
            index={index}
            reverse={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}
