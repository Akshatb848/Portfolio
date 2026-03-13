import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/Hero';
import { AboutSection } from '@/components/sections/About';
import { SkillsSection } from '@/components/sections/Skills';
import { ProjectsSection } from '@/components/sections/Projects';
import { ExperienceSection } from '@/components/sections/Experience';
import { GitHubSection } from '@/components/sections/GitHub';
import { EducationSection } from '@/components/sections/Education';
import { ContactSection } from '@/components/sections/Contact';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <GitHubSection />
      <EducationSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
