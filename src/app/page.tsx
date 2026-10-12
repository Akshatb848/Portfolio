import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/Hero';
import assets from '@/data/assets.generated.json';
import { getGitHubData } from '@/lib/github';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ChapterRail } from '@/components/ChapterRail';
import { HudReadout } from '@/components/HudReadout';
import { WorldLayer } from '@/components/WorldLayer';
import { PointerFX } from '@/components/PointerFX';
import { Marquee } from '@/components/Marquee';

const AboutSection = dynamic(() =>
  import('@/components/sections/About').then((m) => ({ default: m.AboutSection }))
);
const SystemsSection = dynamic(() =>
  import('@/components/sections/Systems').then((m) => ({ default: m.SystemsSection }))
);
const SkillsSection = dynamic(() =>
  import('@/components/sections/Skills').then((m) => ({ default: m.SkillsSection }))
);
const ToolkitSection = dynamic(() =>
  import('@/components/sections/Toolkit').then((m) => ({ default: m.ToolkitSection }))
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
  const availablePosters = assets.posters;

  return (
    <>
      <ScrollProgress />
      <Navbar resumeUrl={resumeUrl} />
      <WorldLayer portrait={assets.portrait ?? null} />
      <PointerFX />
      <ChapterRail />
      <HudReadout />
      <main id="main-content" className="relative z-1 min-h-screen overflow-x-hidden">
        <HeroSection resumeUrl={resumeUrl} portrait={assets.portrait ?? null} />
        <AboutSection />
        <Marquee
          top={['AI Generalist', 'Low-code / No-code AI', 'Multi-agent systems', 'RAG', 'Automation']}
          bottom={['LangGraph', 'n8n', 'Claude', 'Hugging Face', 'FastAPI', 'Ollama', 'Streamlit']}
        />
        <SystemsSection />
        <SkillsSection />
        <ToolkitSection />
        <ProjectsSection availableVideos={availableVideos} availablePosters={availablePosters} />
        <Marquee
          top={['Built', 'Shipped', 'Measured', 'Documented', 'Open source']}
          bottom={['Deloitte', 'YourNest VC', 'Jio Platforms', 'Unified Mentor', 'C-DOT']}
        />
        <ExperienceSection />
        <GitHubSection data={github} />
        <EducationSection />
        <ContactSection resumeUrl={resumeUrl} />
      </main>
      <Footer />
    </>
  );
}
