import ProjectCollage from "@/app/(Home)/components/ProjectCollage";
import Hero from "@/app/(Home)/components/Hero";
import About from "@/app/(Home)/components/About";
import Articles from "@/app/(Home)/components/Articles";
import FeaturedProjects from "@/app/(Home)/components/FeaturedProjects";
import Footer from "@/app/(Home)/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c0c0b]">
      <Hero />
      <About />
      <ProjectCollage />
      <FeaturedProjects />
      <Articles />
      <Footer />
    </div>
  );
}
