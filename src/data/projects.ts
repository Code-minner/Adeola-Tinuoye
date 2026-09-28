export type Project = {
  id: string;
  title: string;
  video: string;
  summary: string;
  points: string[];
  cell: string;
  frame: string;
  inGrid: boolean;
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
    summary: "Screen recording of the FGS project.",
    points: [],
    cell: "",
    frame: "aspect-[4/5]",
    inGrid: false,
  },
  {
    id: "mammut",
    title: "Mammut",
    video: "/videos/mammut.mp4",
    summary: "Screen recording of the Mammut project.",
    points: [],
    cell: "",
    frame: "aspect-[4/5]",
    inGrid: false,
  },
  {
    id: "mitchell-adam",
    title: "Mitchell Adam",
    video: "/videos/MitchellAdam.mp4",
    summary: "Screen recording of the Mitchell Adam project.",
    points: [],
    cell: "",
    frame: "aspect-[4/5]",
    inGrid: false,
  },
];
