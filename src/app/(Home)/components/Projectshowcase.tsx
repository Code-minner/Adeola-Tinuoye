"use client";

import { ArrowUpRight } from "lucide-react";

const MONO_FONT = { fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" };

// Same brand-icon replacement used in Hero.tsx / Footer.tsx (lucide-react v1
// dropped the trademarked ones). Worth pulling into a shared `icons.tsx` now
// that it's showing up in a third file.
function Github(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  );
}

// A paragraph is a list of segments so a sentence can mix plain text with
// italic emphasis inline, matching the reference copy (e.g. "a cutting-edge
// *microservice-based* application...").
type TextSegment = string | { text: string; emphasis?: boolean };
type Paragraph = TextSegment[];

type ProjectImage = {
  src: string;
  alt: string;
};

type ProjectEntry = {
  id: string;
  title: string;
  stack: string[];
  paragraphs: Paragraph[];
  githubUrl: string;
  /** First image doubles as the small peeking badge tile. */
  images: [ProjectImage, ProjectImage, ProjectImage, ProjectImage];
};

const projectEntries: ProjectEntry[] = [
  {
    id: "gostat",
    title: "Gostat",
    stack: ["Golang", "TypeScript", "Gin", "NextJs", "PostgrSQL", "Redis"],
    paragraphs: [
      [
        { text: "GOStat", emphasis: true },
        " - a cutting-edge ",
        { text: "microservice-based", emphasis: true },
        " application designed to handle ",
        { text: "HTTP request authentication", emphasis: true },
        " and statistics with finesse.",
      ],
      [
        "This project ",
        { text: "comprises several key microservices", emphasis: true },
        ", each contributing to its overall functionality and prowess.",
      ],
    ],
    githubUrl: "https://github.com",
    images: [
      { src: "/projects/gostat/badge.jpg", alt: "Gostat dashboard detail" },
      { src: "/projects/gostat/dashboard.jpg", alt: "Gostat dashboard on a laptop mockup" },
      { src: "/projects/gostat/scene-1.jpg", alt: "Night-sky illustration" },
      { src: "/projects/gostat/scene-2.jpg", alt: "Fox silhouette illustration" },
    ],
  },
  {
    id: "kana-master",
    title: "Kana Master",
    stack: ["TypeScript", "ReactNative", "Redux Toolkit", "i18n", "iOS"],
    paragraphs: [
      [
        "Kana Master is an ",
        { text: "iOS application", emphasis: true },
        " designed for ",
        { text: "learning Katakana and Hiragana", emphasis: true },
        ". It includes various ",
        { text: "tests and practical exercises", emphasis: true },
        " that help in learning and memorizing Japanese characters.",
      ],
      [
        "The app also offers ",
        { text: "audio training for correct pronunciation", emphasis: true },
        " and demonstrates how to properly ",
        { text: "draw each character", emphasis: true },
        ".",
      ],
    ],
    githubUrl: "https://github.com",
    images: [
      { src: "/projects/kana-master/badge.jpg", alt: "Kana Master character detail" },
      { src: "/projects/kana-master/phone.jpg", alt: "Kana Master lesson screen on a phone mockup" },
      { src: "/projects/kana-master/scene-1.jpg", alt: "Illustration of a cat and a desk" },
      { src: "/projects/kana-master/scene-2.jpg", alt: "Illustration detail" },
    ],
  },
];

function ParagraphText({ segments }: { segments: Paragraph }) {
  return (
    <p className="text-sm leading-relaxed text-white/70 sm:text-base">
      {segments.map((segment, i) =>
        typeof segment === "string" ? (
          <span key={i}>{segment}</span>
        ) : (
          <em key={i} className={segment.emphasis ? "italic text-white" : "not-italic"}>
            {segment.text}
          </em>
        ),
      )}
    </p>
  );
}

function MediaCollage({
  images,
  githubUrl,
  title,
}: {
  images: ProjectEntry["images"];
  githubUrl: string;
  title: string;
}) {
  const [badge, main, tall, extra] = images;

  return (
    <div className="relative grid w-full grid-cols-3 grid-rows-3 gap-3 sm:gap-4">
      <div className="relative col-span-2 row-span-2 overflow-hidden rounded-2xl border border-white/10 bg-[#141412]">
        <img src={main.src} alt={main.alt} className="h-full w-full object-cover" loading="lazy" />

        {/* peeking badge, overlapping the corner of the main tile */}
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${title} on GitHub`}
          className="group absolute -bottom-4 -right-4 h-20 w-20 overflow-hidden rounded-2xl border border-white/15 shadow-lg shadow-black/40 sm:h-24 sm:w-24"
        >
          <img src={badge.src} alt={badge.alt} className="h-full w-full object-cover" loading="lazy" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0c0c0b]">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </span>
        </a>
      </div>

      <div className="col-span-1 row-span-3 overflow-hidden rounded-2xl border border-white/10 bg-[#141412]">
        <img src={tall.src} alt={tall.alt} className="h-full w-full object-cover" loading="lazy" />
      </div>

      <div className="col-span-2 row-span-1 overflow-hidden rounded-2xl border border-white/10 bg-[#141412]">
        <img src={extra.src} alt={extra.alt} className="h-full w-full object-cover" loading="lazy" />
      </div>
    </div>
  );
}

function ProjectRow({ project, reverse }: { project: ProjectEntry; reverse: boolean }) {
  return (
    <div
      className={`flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      <div className="flex w-full flex-col gap-5 lg:w-[340px] lg:shrink-0">
        <h3 className="text-2xl font-semibold sm:text-3xl">{project.title}</h3>

        <ul className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/85"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-4">
          {project.paragraphs.map((paragraph, i) => (
            <ParagraphText key={i} segments={paragraph} />
          ))}
        </div>

        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${project.title} on GitHub`}
          className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 p-1.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full text-white">
            <Github className="h-4 w-4" />
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0c0c0b] transition-transform group-hover:translate-x-0.5">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </a>
      </div>

      <div className="w-full lg:flex-1">
        <MediaCollage images={project.images} githubUrl={project.githubUrl} title={project.title} />
      </div>
    </div>
  );
}

export default function ProjectShowcase() {
  return (
    <section
      className="relative mx-auto w-full max-w-[1200px] overflow-hidden bg-[#0c0c0b] px-6 py-16 text-white sm:px-10 sm:py-20 lg:px-14"
      style={MONO_FONT}
    >
      {/* decorative ring, matching the arc used across other sections */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-white/10"
      />

      <p className="relative text-sm font-semibold text-white sm:text-base">... /Projects ...</p>

      <div className="relative mt-14 flex flex-col gap-20 sm:gap-24">
        {projectEntries.map((project, i) => (
          <ProjectRow key={project.id} project={project} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}