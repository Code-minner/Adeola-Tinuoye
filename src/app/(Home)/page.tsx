import dynamic from "next/dynamic";
import Hero from "@/app/(Home)/components/Hero";
import About from "@/app/(Home)/components/About";

/** Below-the-fold chunks — Hero + About stay in the first paint. */
const DiscoveryExperience = dynamic(() => import("@/app/(Home)/components/DiscoveryExperience"), {
  loading: () => <div className="min-h-[82vh] bg-[#0c0c0b]" aria-hidden />,
});
const ProjectCollage = dynamic(() => import("@/app/(Home)/components/ProjectCollage"), {
  loading: () => <div className="min-h-[420px] bg-[#0c0c0b]" aria-hidden />,
});
const FeaturedProjects = dynamic(() => import("@/app/(Home)/components/FeaturedProjects"), {
  loading: () => <div className="min-h-[480px] bg-[#0c0c0b]" aria-hidden />,
});
const Articles = dynamic(() => import("@/app/(Home)/components/Articles"), {
  loading: () => <div className="min-h-[320px] bg-[#0c0c0b]" aria-hidden />,
});
const Footer = dynamic(() => import("@/app/(Home)/components/Footer"), {
  loading: () => <div className="min-h-[280px] bg-[#0c0c0b]" aria-hidden />,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c0c0b]">
      <Hero />
      <About />
      <DiscoveryExperience />
      <ProjectCollage />
      <FeaturedProjects />
      <Articles />
      <Footer />
    </div>
  );
}
