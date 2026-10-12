export const site = {
  name: 'Akshat Banga',
  /**
   * Canonical origin. On Vercel this is the project's production URL (VERCEL_PROJECT_PRODUCTION_URL,
   * which becomes akshatbanga.com automatically once that domain is connected), so canonical
   * links, the sitemap and share previews never point at an address that isn't live.
   * NEXT_PUBLIC_SITE_URL overrides it.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'https://akshatbanga.com'),
  title: 'Akshat Banga | AI Generalist & Transformation Expert',
  headline: 'AI Generalist · Transformation Expert',
  description:
    'AI Generalist and transformation expert in New Delhi. Transforms manual work with low-code / no-code AI and the right AI tools, and builds LLM apps, RAG and multi-agent systems when a problem needs custom code.',
  email: 'akshatbanga848@gmail.com',
  github: 'https://github.com/Akshatb848',
  githubUsername: 'Akshatb848',
  linkedin: 'https://www.linkedin.com/in/akshat-banga-6574aa170/',
  instagram: 'https://www.instagram.com/the_lazy_automator/',
  instagramHandle: 'the_lazy_automator',
  resumePath: '/Akshat_Banga_Resume.pdf',
  location: 'New Delhi, India',
};
