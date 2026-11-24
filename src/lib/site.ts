export const site = {
  name: 'Akshat Banga',
  /**
   * Canonical origin: the project's permanent Vercel address, which never expires (unlike the
   * per-deployment URLs Vercel removes under its retention policy). It is fixed here rather than
   * read from VERCEL_PROJECT_PRODUCTION_URL, because that follows the custom domain set in Vercel
   * even when the domain's DNS is not live, which would point share previews at a dead address.
   * Set NEXT_PUBLIC_SITE_URL once a custom domain is confirmed working.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio-akshat-bangas-projects.vercel.app',
  title: 'Akshat Banga | AI Engineer & Full-Stack AI Developer',
  headline: 'AI Engineer · Full-Stack AI Developer',
  description:
    'AI engineer and full-stack AI developer in New Delhi. I build LLM apps, RAG and multi-agent systems, and the FastAPI and PostgreSQL apps that run them.',
  email: 'akshatbanga848@gmail.com',
  github: 'https://github.com/Akshatb848',
  githubUsername: 'Akshatb848',
  linkedin: 'https://www.linkedin.com/in/akshat-banga/',
  instagram: 'https://www.instagram.com/the_lazy_automator/',
  instagramHandle: 'the_lazy_automator',
  resumePath: '/Akshat_Banga_Resume.pdf',
  location: 'New Delhi, India',
};
