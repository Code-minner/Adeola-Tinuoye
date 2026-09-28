"use client";

import { memo } from "react";
import Image from "next/image";
import { ArrowUpRight, Megaphone } from "lucide-react";

// Headings use a plain sans face for contrast against the monospace body
// copy, matching the reference. Swap the fallback if your Geist Sans var is
// named differently.
const sansFont = { fontFamily: "var(--font-geist-sans, ui-sans-serif, system-ui, sans-serif)" };

type SkillGroup = {
  title: string;
  variant: "solid" | "outline";
  items: string[];
};

const skillGroups: SkillGroup[] = [
  {
    title: "Front-end",
    variant: "solid",
    items: [
      "TypeScript",
      "React",
      "Vue",
      "Vuex",
      "Redux Toolkit",
      "NextJs",
      "Nuxt",
      "Jest",
      "GraphQL",
      "React Native",
      "Puppeteer",
      "Enzyme",
    ],
  },
  {
    title: "Styles",
    variant: "outline",
    items: ["SCSS", "SASS", "PostCSS", "Ant.d", "MUI", "Material UI"],
  },
  {
    title: "Back-end",
    variant: "outline",
    items: [
      "Golang",
      "Gin",
      "GORM",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "gRPC",
      "Redis",
      "Kafka",
      "Node",
      "Nest",
      "TypeORM",
      "Microservices",
    ],
  },
  {
    title: "DevOps",
    variant: "outline",
    items: ["Nginx", "Brotli", "Docker", "(CI/CD)", "k8s", "Bash"],
  },
];

// Memoized: these never change after mount, so there's no reason for a
// parent re-render (e.g. from the portrait image loading) to re-render them.
const SkillCard = memo(function SkillCard({ title, variant, items }: SkillGroup) {
  const isSolid = variant === "solid";
  return (
    <div
      className={
        isSolid
          ? "rounded-2xl bg-white p-6 sm:p-7"
          : "rounded-2xl border border-white/15 p-6 sm:p-7"
      }
    >
      <h3
        style={sansFont}
        className={`text-lg font-semibold sm:text-xl ${isSolid ? "text-[#0c0c0b]" : "text-white"}`}
      >
        {title}
      </h3>
      <p
        className={`mt-3 text-sm leading-relaxed ${isSolid ? "text-[#0c0c0b]/70" : "text-white/60"}`}
      >
        {items.join(" / ")}
      </p>
    </div>
  );
});

function PillButton() {
  return (
    <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white p-1.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-full text-[#0c0c0b]">
        <Megaphone className="h-4 w-4" />
      </span>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0c0c0b] text-white">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </div>
  );
}

export default function AboutMe() {
  const [frontEnd, styles, backEnd, devOps] = skillGroups;

  return (
    <section
      className="relative mx-auto w-full max-w-[1200px] px-6 py-16 text-white sm:px-10 sm:py-20 lg:px-14"
      style={{ fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" }}
    >
      {/* header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-sm text-white/50">... /About me ...</p>
        <p className="max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
          Hello! I&apos;m Nikita, I&apos;m a{" "}
          <em className="italic text-white">full-stack developer</em>.
          <br />
          More than <em className="italic text-white">5 years</em> experience.
        </p>
      </div>

      {/* body */}
      <div className="mt-14 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        {/* skill cards */}
        <div className="flex flex-col gap-4">
          <SkillCard {...frontEnd} />

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:flex-1">
              <SkillCard {...styles} />
            </div>
            <PillButton />
          </div>

          <SkillCard {...backEnd} />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="max-w-[240px] pt-1 sm:pt-8">
              <p className="text-sm leading-relaxed text-white/50">
                Some of my{" "}
                <em className="italic text-white/80">
                  favorite technologies, topics, or tools
                </em>{" "}
                that I worked with
              </p>
            </div>
            <div className="w-full sm:flex-1">
              <SkillCard {...devOps} />
            </div>
          </div>
        </div>

        {/* portrait + decorative ring */}
        <div className="relative mx-auto flex w-full max-w-sm items-center justify-center lg:mx-0 lg:max-w-none">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-28 h-[420px] w-[420px] rounded-full border border-white/10 lg:-right-10 lg:-top-32"
          />
          <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-white/[0.02]">
            {/*
              next/image instead of a raw <img>: gives automatic responsive
              srcset, lazy loading below the fold, and modern-format (webp/
              avif) serving without any extra work. `fill` + `sizes` lets it
              size itself off this aspect-[4/5] container.
              object-contain keeps the whole photo visible with nothing
              cropped off the edges — the gradient behind fills any
              letterboxed space so it still looks intentional rather than
              empty. Swap the src for your actual portrait file.
            */}
            <Image
              src="/nikita-portrait.jpg"
              alt="Portrait of Nikita"
              fill
              sizes="(min-width: 1024px) 420px, 90vw"
              className="relative z-10 object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}