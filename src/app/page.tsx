import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/Hero';

const AboutSection = dynamic(() =>
  import('@/components/sections/About').then((m) => ({ default: m.AboutSection }))
);
const SkillsSection = dynamic(() =>
  import('@/components/sections/Skills').then((m) => ({ default: m.SkillsSection }))
);
const ProjectsSection = dynamic(() =>
  import('@/components/sections/Projects').then((m) => ({ default: m.ProjectsSection }))
);
const ExperienceSection = dynamic(() =>
  import('@/components/sections/Experience').then((m) => ({ default: m.ExperienceSection }))
);
const GitHubSection = dynamic(() =>
  import('@/components/sections/GitHub').then((m) => ({ default: m.GitHubSection }))
);
const EducationSection = dynamic(() =>
  import('@/components/sections/Education').then((m) => ({ default: m.EducationSection }))
);
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
      <Footer />
    </main>
  );
}
