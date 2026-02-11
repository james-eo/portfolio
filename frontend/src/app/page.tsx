import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
// import About from "@/components/about";
import Skills from '@/components/skills';
import Experience from '@/components/experience';
import Projects from '@/components/projects';
import Education from '@/components/education';
import Contact from '@/components/contact';
import Footer from '@/components/footer';
import CTA from '@/components/cta';

export default function Home() {
  return (
    <main className="min-h-screen bg-background pr-10 pl-10">
      <Navbar />
      <Hero />
      {/* <About /> */}
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <CTA />
      <Contact />
      <Footer />
    </main>
  );
}
