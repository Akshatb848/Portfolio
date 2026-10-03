import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/Hero';
import assets from '@/data/assets.generated.json';
import { getGitHubData } from '@/lib/github';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ChapterRail } from '@/components/ChapterRail';

const AboutSection = dynamic(() =>
  import('@/components/sections/About').then((m) => ({ default: m.AboutSection }))
);
const SystemsSection = dynamic(() =>
  import('@/components/sections/Systems').then((m) => ({ default: m.SystemsSection }))
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

// Rebuild the page daily so the GitHub section stays current.
export const revalidate = 86400;

export default async function Home() {
  const github = await getGitHubData();
  // Optional assets only render when the file was in /public at build time
  // (see scripts/generate-asset-manifest.mjs), so nothing shows as a broken link.
  const resumeUrl = assets.resume;
  const availableVideos = assets.videos;

  return (
    <>
      <ScrollProgress />
      <Navbar resumeUrl={resumeUrl} />
      <ChapterRail />
      <main id="main-content" className="relative min-h-screen bg-background overflow-x-hidden">
        <HeroSection resumeUrl={resumeUrl} />
        <AboutSection />
        <SystemsSection />
        <SkillsSection />
        <ProjectsSection availableVideos={availableVideos} />
        <ExperienceSection />
        <GitHubSection data={github} />
        <EducationSection />
        <ContactSection resumeUrl={resumeUrl} />
      </main>
      <Footer />
    </>
  );
}
