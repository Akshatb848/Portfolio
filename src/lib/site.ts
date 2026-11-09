export const site = {
  name: 'Akshat Banga',
  /**
   * Canonical origin. On Vercel this is the project's production URL (VERCEL_PROJECT_PRODUCTION_URL,
   * which follows any custom domain automatically once one is connected), so canonical
   * links, the sitemap and share previews never point at an address that isn't live.
   * NEXT_PUBLIC_SITE_URL overrides it.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'https://portfolio-akshat-bangas-projects.vercel.app'),
  title: 'Akshat Banga | AI Engineer & Full-Stack AI Developer',
  headline: 'AI Engineer · Full-Stack AI Developer',
  description:
    'AI Engineer and full-stack AI developer in New Delhi. Builds AI products end to end: LLM apps, RAG and multi-agent systems, plus the FastAPI and PostgreSQL apps around them.',
  email: 'akshatbanga848@gmail.com',
  github: 'https://github.com/Akshatb848',
  githubUsername: 'Akshatb848',
  linkedin: 'https://www.linkedin.com/in/akshat-banga/',
  instagram: 'https://www.instagram.com/the_lazy_automator/',
  instagramHandle: 'the_lazy_automator',
  resumePath: '/Akshat_Banga_Resume.pdf',
  location: 'New Delhi, India',
};
