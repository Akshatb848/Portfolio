import fs from 'node:fs';
import path from 'node:path';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/Hero';
import { site } from '@/lib/site';

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
const ContactSection = dynamic(() =>
  import('@/components/sections/Contact').then((m) => ({ default: m.ContactSection }))
);

// Resolved at build time: optional assets only render when the file is in /public,
// so a missing résumé or demo clip never shows up as a broken link or empty frame.
const publicDir = path.join(process.cwd(), 'public');
const hasPublicFile = (p: string) => fs.existsSync(path.join(publicDir, p));

export default function Home() {
  const resumeUrl = hasPublicFile(site.resumePath) ? site.resumePath : null;
  const videosDir = path.join(publicDir, 'videos');
  const availableVideos = fs.existsSync(videosDir)
    ? fs.readdirSync(videosDir).map((f) => `/videos/${f}`)
    : [];

  return (
    <>
      <Navbar resumeUrl={resumeUrl} />
      <main id="main-content" className="relative min-h-screen bg-background overflow-x-hidden">
        <HeroSection resumeUrl={resumeUrl} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection availableVideos={availableVideos} />
        <ExperienceSection />
        <GitHubSection />
        <EducationSection />
        <ContactSection resumeUrl={resumeUrl} />
      </main>
      <Footer />
    </>
  );
}
