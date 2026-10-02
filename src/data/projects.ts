export type Project = {
  id: string;
  title: string;
  video: string;
  summary: string;
  points: string[];
  cell: string;
  frame: string;
  inGrid: boolean;
  tag?: string;
  status?: "live" | "beta" | "lab";
  year?: string;
  stack?: string[];
};

export const projects: Project[] = [
  {
    id: "urban",
    title: "Urban",
    video: "/videos/urban.mp4",
    summary: "Screen recording of the Urban project.",
    points: [],
    cell: "row-span-2 flex items-center justify-center",
    frame: "aspect-[3/4]",
    inGrid: true,
  },
  {
    id: "hers",
    title: "Hers",
    video: "/videos/hers.mp4",
    summary: "Screen recording of the Hers project.",
    points: [],
    cell: "flex items-end justify-center",
    frame: "aspect-[4/5]",
    inGrid: true,
  },
  {
    id: "prosplug",
    title: "Prosplug",
    video: "/videos/prosplug.mp4",
    summary:
      "A marketplace for finding skilled tradespeople and talented professionals across fashion, tech, beauty, entertainment, and more.",
    points: [
      "Search-led discovery of people and services",
      "Built for hiring across several industries",
      "Product walkthrough of the live interface",
    ],
    cell: "row-span-2 flex items-center justify-center",
    frame: "aspect-[3/4]",
    inGrid: true,
  },
  {
    id: "sole",
    title: "Sole",
    video: "/videos/sole.mp4",
    summary: "Screen recording of the Sole project.",
    points: [],
    cell: "flex items-end justify-center",
    frame: "aspect-[4/5]",
    inGrid: true,
  },
  {
    id: "netan",
    title: "Netan",
    video: "/videos/Netanrecoding.mp4",
    summary:
      "Technology studio site for software, cybersecurity, and cloud work — built around helping a business innovate, secure, and scale.",
    points: [
      "Software development, cybersecurity, and cloud",
      "Company story and service presentation",
      "Recorded walkthrough of the site",
    ],
    cell: "row-span-2 flex items-center justify-center",
    frame: "aspect-[3/4]",
    inGrid: true,
  },
  {
    id: "maven",
    title: "Maven",
    video: "/videos/maven.mp4",
    summary: "Screen recording of the Maven project.",
    points: [],
    cell: "flex items-start justify-center",
    frame: "aspect-[4/5]",
    inGrid: true,
  },
  {
    id: "constance",
    title: "Constance",
    video: "/videos/constance.mp4",
    summary: "Screen recording of the Constance project.",
    points: [],
    cell: "flex items-start justify-center",
    frame: "aspect-[4/5]",
    inGrid: true,
  },
  {
    id: "fgs",
    title: "FGS",
    video: "/videos/fgs.mp4",
    summary:
      "A logistics-facing product surface — route clarity, status, and operational flow in one clean pass.",
    points: ["Ops dashboard flow", "Status-first UI", "Built for speed on the floor"],
    cell: "",
    frame: "aspect-[4/5]",
    inGrid: false,
    tag: "OPS",
    status: "live",
    year: "2025",
    stack: ["TypeScript", "NextJs", "Node", "PostgreSQL", "Redis"],
  },
  {
    id: "mammut",
    title: "Mammut",
    video: "/videos/mammut.mp4",
    summary:
      "A brand-and-product experiment with heavy motion, bold frames, and a storefront that moves like a campaign.",
    points: ["Campaign-grade motion", "Storefront storytelling", "High-impact product frames"],
    cell: "",
    frame: "aspect-[4/5]",
    inGrid: false,
    tag: "COMMERCE",
    status: "beta",
    year: "2025",
    stack: ["React", "TypeScript", "NextJs", "SCSS", "Framer"],
  },
  {
    id: "mitchell-adam",
    title: "Mitchell Adam",
    video: "/videos/MitchellAdam.mp4",
    summary:
      "A personal brand site with editorial pacing — portrait, story, and services laid out like a studio reel.",
    points: ["Editorial layout", "Portrait-led storytelling", "Studio-grade presentation"],
    cell: "",
    frame: "aspect-[4/5]",
    inGrid: false,
    tag: "STUDIO",
    status: "lab",
    year: "2024",
    stack: ["NextJs", "TypeScript", "Tailwind", "GSAP"],
  },
];

export const galleryProjects = projects.filter((project) => project.inGrid);
export const playgroundProjects = projects.filter((project) => !project.inGrid);
