/**
 * Single source of truth for the portfolio's content. Every section (hero, simulations,
 * carousel, flashcards, timeline, GitHub panel) reads from here, so a change made once
 * shows up everywhere.
 *
 * Experience, education, certifications and the headline projects follow Akshat's résumé
 * (October 2026). Other projects are public repositories at github.com/Akshatb848.
 */
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  ShieldCheck,
  Bot,
  BarChart3,
  BookOpen,
  ShoppingCart,
  Languages,
  Wind,
  Users,
  Music,
  Plane,
  Landmark,
  Brain,
  Zap,
  Layers,
  Cloud,
  Compass,
} from 'lucide-react';
import type { ToneName } from '@/lib/tones';

export type Project = {
  id: number;
  name: string;
  title: string;
  description: string;
  tech: string[];
  category: string;
  color: ToneName;
  /** Public repository, when there is one. */
  github?: string;
  language: string;
  icon: LucideIcon;
  featured: boolean;
  /** Path under /public; only rendered when the file exists at build time. A .jpg with the
   *  same name next to it is used as the poster frame. */
  video?: string;
  /** 'concept' = AI-generated visual (labelled on the site); 'recording' = real screen capture. */
  videoKind?: 'concept' | 'recording';
};

export type Language = { name: string; level: string };

export type Experience = {
  id: number;
  company: string;
  companyInitial: string;
  role: string;
  type: string;
  period: string;
  location: string;
  color: ToneName;
  description: string;
  bullets: string[];
  tech: string[];
  githubRepo?: string;
};

export type RepoSummary = {
  name: string;
  lang: string;
  description?: string;
  pushedAt?: string;
  url?: string;
};

export const projects: Project[] = [
  {
    id: 13,
    name: 'ASIS-Strategic-Intelligence-Platform',
    title: 'ASIS – Strategic Intelligence Platform',
    description:
      'An 8-agent enterprise decision-intelligence system that generates cited strategic briefs, roadmaps, SWOT analyses, executive summaries and PDF reports. FastAPI backend, Next.js frontend with live progress over SSE, Docker, Terraform, CI/CD and a GCP deployment structure.',
    tech: ['LangGraph', 'Agents', 'FastAPI', 'Next.js', 'LiteLLM', 'PostgreSQL', 'Redis', 'Qdrant', 'Docker', 'Terraform', 'CI/CD', 'GCP'],
    category: 'Agentic AI',
    color: 'cyan',
    language: 'Python',
    icon: Compass,
    featured: true,
  },
  {
    id: 1,
    name: 'AI-Tennis-Swing-Analyzer',
    title: 'AI Tennis Swing Analyzer',
    description:
      'Multi-agent AI platform that analyzes tennis swings using a Streamlit dashboard. Built with a modular agents/core/services architecture, ChromaDB-backed RAG for coaching knowledge retrieval. Python core with TypeScript and Swift components.',
    tech: ['Python', 'TypeScript', 'Streamlit', 'ChromaDB', 'RAG', 'Agents', 'Docker'],
    category: 'Computer Vision',
    color: 'indigo',
    github: 'https://github.com/Akshatb848/AI-Tennis-Swing-Analyzer',
    language: 'Python',
    icon: Activity,
    featured: true,
    video: '/videos/ai-tennis-demo.mp4',
    videoKind: 'concept',
  },
  {
    id: 2,
    name: 'AI-Governance-and-Risk-Management',
    title: 'AEGIS – AI Governance & Risk Platform',
    description:
      'Multi-agent audit platform for ML and GenAI/RAG systems covering fairness, drift, explainability, prompt injection and citation checks. Automates PASS/FAIL/REVIEW controls, risk registers, remediation actions and workflow traces, and produces audit-ready PDF packs.',
    tech: ['Python', 'LangGraph', 'Agents', 'Streamlit', 'SHAP', 'RAG'],
    category: 'Generative AI',
    color: 'purple',
    github: 'https://github.com/Akshatb848/AI-Governance-and-Risk-Management',
    language: 'Jupyter Notebook',
    icon: ShieldCheck,
    featured: true,
    video: '/videos/aegis-demo.mp4',
    videoKind: 'concept',
  },
  {
    id: 3,
    name: 'data-science-agent-platform',
    title: 'Data Science Agent Platform',
    description:
      'Agentic AI platform that automates data science workflows through a modular agents/core/services/dashboard architecture, with Docker support and a RAG pipeline for knowledge-grounded analysis.',
    tech: ['Python', 'Agents', 'RAG', 'FastAPI', 'Docker', 'Streamlit'],
    category: 'Agentic AI',
    color: 'emerald',
    github: 'https://github.com/Akshatb848/data-science-agent-platform',
    language: 'Python',
    icon: Bot,
    featured: true,
    video: '/videos/ds-agent-demo.mp4',
    videoKind: 'concept',
  },
  {
    id: 4,
    name: 'AI-Analytics-Dashboard',
    title: 'AI Analytics Dashboard',
    description:
      'AI analytics product with automated insights, anomaly detection, Prophet forecasting, a semantic KPI catalog and natural-language queries. Executive dashboard cards, dynamic visualisations, data export, statistical summaries and stakeholder-ready reporting.',
    tech: ['Python', 'Streamlit', 'Plotly', 'Prophet', 'Pandas', 'NumPy', 'SciPy'],
    category: 'Data & Analytics',
    color: 'sky',
    github: 'https://github.com/Akshatb848/AI-Analytics-Dashboard',
    language: 'Python',
    icon: BarChart3,
    featured: true,
    video: '/videos/analytics-demo.mp4',
    videoKind: 'concept',
  },
  {
    id: 5,
    name: 'LLM-dashboard',
    title: 'LLM Education Dashboard & RAG Chatbot',
    description:
      'Conference-ready Ministry of Education dashboard featuring a RAG-first AI chatbot that strictly prevents hallucinations. Includes monthly newsletter retrieval, analytics overview, and optional OLLAMA integration. REST API backend with strict no-hallucination retrieval-only fallback mode.',
    tech: ['JavaScript', 'Python', 'FastAPI', 'RAG', 'OLLAMA', 'REST API'],
    category: 'Generative AI',
    color: 'violet',
    github: 'https://github.com/Akshatb848/LLM-dashboard',
    language: 'JavaScript',
    icon: BookOpen,
    featured: false,
    video: '/videos/llm-dashboard-demo.mp4',
    videoKind: 'concept',
  },
  {
    id: 6,
    name: 'EcomPriceGen-AI-Powered-Pricing-Discount-Calculator',
    title: 'EcomPriceGen – LLM-Powered Pricing Calculator',
    description:
      'Automated e-commerce pricing engine combining two notebooks: a RAG Agent for product knowledge retrieval and a Smart E-Commerce Platform. Fine-tunes HuggingFace\'s Zephyr-7B model with LoRA (Low-Rank Adaptation) for resource-efficient training, accepting natural language discount queries.',
    tech: ['Python', 'HuggingFace', 'Zephyr-7B', 'LoRA', 'PEFT', 'RAG', 'Jupyter'],
    category: 'Generative AI',
    color: 'amber',
    github: 'https://github.com/Akshatb848/EcomPriceGen-AI-Powered-Pricing-Discount-Calculator',
    language: 'Jupyter Notebook',
    icon: ShoppingCart,
    featured: false,
  },
  {
    id: 7,
    name: 'Degraded-Devanagari-and-Bangla-Script-Identification-Using-CNN-Frameworks',
    title: 'Degraded Indic Script Classifier (99.34% accuracy)',
    description:
      'CNN-based OCR for degraded Devanagari and Bangla characters on the Ekush dataset: VGG-16 reaches 99.34% accuracy (DenseNet-121 98.89%, ResNet-50 98.60%, AlexNet 97.75%). Inference is packaged with Streamlit, Docker and Kubernetes assets, a testing structure and modular, deployment-ready services.',
    tech: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'VGG-16', 'ResNet-50', 'Streamlit', 'Docker', 'Kubernetes'],
    category: 'Computer Vision',
    color: 'rose',
    github:
      'https://github.com/Akshatb848/Degraded-Devanagari-and-Bangla-Script-Identification-Using-CNN-Frameworks',
    language: 'Python',
    icon: Languages,
    featured: true,
  },
  {
    id: 8,
    name: 'Real-Time-Air-Quality-Prediction-Using-ML-Algorithms',
    title: 'Real-Time Air Quality Prediction',
    description:
      'ML solution for forecasting air quality indicators from real-time chemical sensor data (CO, NMHC, C6H6). Implements Random Forest Regressor (250 estimators) with feature importance ranking from a Random Forest-based selection pipeline.',
    tech: ['Python', 'Scikit-learn', 'Random Forest', 'Pandas', 'Matplotlib', 'Jupyter'],
    category: 'Machine Learning',
    color: 'teal',
    github: 'https://github.com/Akshatb848/Real-Time-Air-Quality-Prediction-Using-ML-Algorithms',
    language: 'Jupyter Notebook',
    icon: Wind,
    featured: false,
  },
  {
    id: 9,
    name: 'Market-Segmentation-for-Edtech-Startups',
    title: 'EdTech Market Segmentation',
    description:
      'Unsupervised ML project segmenting EdTech users into meaningful groups using K-Means clustering with Elbow Method optimization and PCA dimensionality reduction. Produces four distinct behavioral segments for targeted marketing and personalization strategies.',
    tech: ['Python', 'Scikit-learn', 'K-Means', 'PCA', 'Pandas', 'Seaborn'],
    category: 'Machine Learning',
    color: 'cyan',
    github: 'https://github.com/Akshatb848/Market-Segmentation-for-Edtech-Startups',
    language: 'Jupyter Notebook',
    icon: Users,
    featured: false,
  },
  {
    id: 10,
    name: 'Music-Genre-Classification-USING-KNN-and-CNN',
    title: 'Music Genre Classification',
    description:
      'Audio classification system that identifies music genres using both K-Nearest Neighbors (KNN) and Convolutional Neural Network (CNN) architectures. Demonstrates comparison of traditional ML vs deep learning for audio feature classification.',
    tech: ['Python', 'KNN', 'CNN', 'Librosa', 'PyTorch', 'Jupyter'],
    category: 'Deep Learning',
    color: 'fuchsia',
    github: 'https://github.com/Akshatb848/Music-Genre-Classification-USING-KNN-and-CNN',
    language: 'Jupyter Notebook',
    icon: Music,
    featured: false,
  },
  {
    id: 11,
    name: 'NPS-Driven-Strategy-for-Aviation',
    title: 'NPS-Driven Aviation Strategy',
    description:
      'Data-driven business strategy analysis for the aviation sector using Net Promoter Score (NPS) methodologies. Derives actionable insights from passenger satisfaction data to guide airline operational and customer experience improvements.',
    tech: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Jupyter', 'Statistics'],
    category: 'Data & Analytics',
    color: 'slate',
    github: 'https://github.com/Akshatb848/NPS-Driven-Strategy-for-Aviation',
    language: 'Jupyter Notebook',
    icon: Plane,
    featured: false,
  },
  {
    id: 12,
    name: 'Deloitte-South-Asia-projects',
    title: 'MoE Education Intelligence Dashboard (Deloitte)',
    description:
      'Government-grade AI analytics platform built for India\'s Ministry of Education with Deloitte Touche Tohmatsu. Converts monthly newsletter data into an interactive command center (FAISS semantic search, LLM chatbot via Ollama, Chart.js visualizations) optimized for cabinet presentations. Deployable via Docker Compose.',
    tech: ['Python', 'FastAPI', 'FAISS', 'Ollama', 'Docker', 'JavaScript', 'Chart.js', 'Nginx'],
    category: 'Enterprise AI',
    color: 'green',
    github: 'https://github.com/Akshatb848/Deloitte-South-Asia-projects',
    language: 'Python',
    icon: Landmark,
    featured: false,
  },
];

export const projectCategories = [
  'All',
  'Generative AI',
  'Computer Vision',
  'Machine Learning',
  'Deep Learning',
  'Agentic AI',
  'Data & Analytics',
  'Enterprise AI',
];

export const experiences: Experience[] = [
  {
    id: 1,
    company: 'YourNest Venture Capital',
    companyInitial: 'YN',
    role: 'Intern – Strategy and AI',
    type: 'Internship',
    period: 'Jun 2026 – Nov 2026',
    location: 'Gurugram',
    color: 'violet',
    description:
      'Brought multi-agent AI into venture-capital dealflow, from deal ingestion to the final investment verdict.',
    bullets: [
      'Built a multi-agent AI workflow automating the entire dealflow process end-to-end, from deal ingestion to final investment verdict.',
      'Engineered deterministic scoring models evaluating thesis alignment, market performance, moat, financials and industry readiness.',
    ],
    tech: ['Multi-agent AI', 'Agents', 'Scoring models'],
  },
  {
    id: 2,
    company: 'Deloitte South Asia',
    companyInitial: 'DL',
    role: 'Intern – EDUT Technology and Transformation',
    type: 'Internship',
    period: 'Jan 2026 – Feb 2026',
    location: 'Gurugram',
    color: 'emerald',
    description:
      'AI-driven transformation work with LLMs, RAG pipelines and agentic workflows for enterprise-scale use cases.',
    bullets: [
      'Architected AI-driven transformation solutions using LLMs, RAG pipelines and agentic workflows for enterprise-scale use cases.',
      'Engineered LangChain-based multi-agent systems with vector database integration, reducing manual data-analysis effort by 40%.',
      'Developed Generative AI prototypes using OpenAI APIs with GCP/Azure-ready deployment patterns for enterprise AI adoption.',
    ],
    tech: ['LangChain', 'RAG', 'Agents', 'Vector search', 'OpenAI API', 'GCP', 'Azure'],
    githubRepo: 'https://github.com/Akshatb848/Deloitte-South-Asia-projects',
  },
  {
    id: 3,
    company: 'Unified Mentor',
    companyInitial: 'UM',
    role: 'Data Science Intern',
    type: 'Internship',
    period: 'Oct 2025 – Jan 2026',
    location: 'New Delhi',
    color: 'purple',
    description: 'Predictive modelling and NLP pipelines for business forecasting and text analytics.',
    bullets: [
      'Built predictive ML models using Python, TensorFlow and Scikit-learn, achieving 92%+ accuracy on business forecasting tasks.',
      'Implemented BERT-based NLP pipelines for text classification and sentiment analysis across 100K+ records with validation checks.',
    ],
    tech: ['Python', 'TensorFlow', 'Scikit-learn', 'BERT', 'NLP'],
    githubRepo: 'https://github.com/Akshatb848/UNIFIED-MENTOR',
  },
  {
    id: 4,
    company: 'Jio Platforms Limited',
    companyInitial: 'JP',
    role: 'Assistant Manager – AIOps, CloudXP and Jio HCMP',
    type: 'Full-time',
    period: 'Oct 2023 – Dec 2024',
    location: 'Navi Mumbai',
    color: 'indigo',
    description:
      'Cloud operations and observability for Jio CloudXP and NIC Meghraj 2.0, supporting enterprise AI and GenAI-enabled workloads.',
    bullets: [
      'Supported Jio CloudXP and NIC Meghraj 2.0 cloud operations across observability, monitoring, agent reliability and production readiness for enterprise AI and GenAI-enabled workloads.',
      'Monitored Prometheus, Pulse Agent, Pulse Gateway and service-availability metrics to improve the reliability of cloud platforms used for automation, analytics and AI operations.',
      'Deployed Pulse Agent, Pulse Gateway and Prometheus updates across sandbox, replica and production servers using controlled release and rollback practices.',
      'Supported Docker/Kubernetes clusters, LaaS pods, ELK Stack, Cassandra, PostgreSQL and MySQL to strengthen scalable infrastructure for cloud-native and AI operations.',
    ],
    tech: ['Prometheus', 'Pulse Agent', 'Docker', 'Kubernetes', 'ELK Stack', 'Cassandra', 'PostgreSQL', 'MySQL'],
  },
  {
    id: 5,
    company: 'C-DOT | Feynn Labs',
    companyInitial: 'CF',
    role: 'ML Trainee / Intern',
    type: 'Traineeship',
    period: 'Feb 2022 – Jul 2022',
    location: 'New Delhi / Remote',
    color: 'amber',
    description: 'Early deep learning and computer vision work.',
    bullets: [
      'Built deep learning and computer vision models using PyTorch, TensorFlow and OpenCV for classification and signal-processing workflows.',
    ],
    tech: ['PyTorch', 'TensorFlow', 'OpenCV'],
  },
];

export const education = [
  {
    institution: 'University of Southampton, Delhi Campus',
    degree: 'MSc International Management',
    period: 'Aug 2025 – Sep 2026',
    location: 'New Delhi, India',
    initial: 'UoS',
    color: 'indigo',
  },
  {
    institution: 'Amity University',
    degree: 'BTech Computer Science',
    period: '2019 – 2023',
    location: 'Gautam Budh Nagar, India',
    initial: 'AU',
    color: 'emerald',
  },
];

export const certifications = [
  { name: 'Microsoft AI & ML Engineering Professional Certificate', issuer: 'Microsoft', color: 'sky' },
  { name: 'Google Cloud Certifications', issuer: 'Google Cloud', color: 'amber' },
  { name: 'CCNA: Introduction to Networks', issuer: 'Cisco', color: 'indigo' },
  { name: 'SDLC Certification', issuer: 'Software development lifecycle', color: 'violet' },
];

export const languages: Language[] = [
  { name: 'English', level: 'Full professional' },
  { name: 'Hindi', level: 'Full professional' },
  { name: 'German', level: 'Limited working' },
];

export const fallbackRepos: RepoSummary[] = [
  { name: 'AI-Tennis-Swing-Analyzer', lang: 'Python' },
  { name: 'data-science-agent-platform', lang: 'Python' },
  { name: 'Degraded-Devanagari-and-Bangla-Script-Identification-Using-CNN-Frameworks', lang: 'Python' },
  { name: 'LLM-dashboard', lang: 'JavaScript' },
  { name: 'Deloitte-South-Asia-projects', lang: 'Python' },
  { name: 'AI-Analytics-Dashboard', lang: 'Python' },
  { name: 'Dashboard-demo', lang: 'Python' },
  { name: 'AI-Governance-and-Risk-Management', lang: 'Jupyter Notebook' },
  { name: 'UNIFIED-MENTOR', lang: 'Jupyter Notebook' },
  { name: 'Market-Segmentation-for-Edtech-Startups', lang: 'Jupyter Notebook' },
  { name: 'EcomPriceGen-AI-Powered-Pricing-Discount-Calculator', lang: 'Jupyter Notebook' },
  { name: 'Real-Time-Air-Quality-Prediction-Using-ML-Algorithms', lang: 'Jupyter Notebook' },
  { name: 'Music-Genre-Classification-USING-KNN-and-CNN', lang: 'Jupyter Notebook' },
  { name: 'NPS-Driven-Strategy-for-Aviation', lang: 'Jupyter Notebook' },
];

export const languageColors: Record<string, string> = {
  Python: '#3572A5',
  'Jupyter Notebook': '#DA5B0B',
  JavaScript: '#F1E05A',
  TypeScript: '#3178C6',
  HTML: '#e34c26',
  Swift: '#F05138',
};

// ─── Skills ──────────────────────────────────────────────────────────────────
// No self-rated percentages. Each skill lists the tech labels that count as evidence;
// the flashcards then show the actual projects and roles where it was used.

export type Skill = { name: string; match: string[] };
export type SkillGroup = {
  id: string;
  title: string;
  icon: LucideIcon;
  color: ToneName;
  description: string;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    icon: Brain,
    color: 'indigo',
    description: 'Core ML, deep learning, NLP and computer vision.',
    skills: [
      { name: 'Python', match: ['Python'] },
      { name: 'TensorFlow / Keras', match: ['TensorFlow', 'Keras'] },
      { name: 'PyTorch', match: ['PyTorch'] },
      { name: 'Scikit-learn', match: ['Scikit-learn', 'Random Forest', 'K-Means', 'KNN'] },
      { name: 'NLP & BERT', match: ['BERT', 'NLP'] },
      { name: 'Computer vision & CNNs', match: ['OpenCV', 'VGG-16', 'ResNet-50', 'CNN'] },
      { name: 'Time series & forecasting', match: ['Prophet'] },
      { name: 'Explainability (SHAP)', match: ['SHAP'] },
    ],
  },
  {
    id: 'genai',
    title: 'Generative AI & Agents',
    icon: Zap,
    color: 'purple',
    description: 'LLM apps, RAG and multi-agent systems.',
    skills: [
      { name: 'Multi-agent systems', match: ['Agents', 'Multi-agent AI'] },
      { name: 'RAG', match: ['RAG'] },
      { name: 'LangGraph', match: ['LangGraph'] },
      { name: 'LangChain', match: ['LangChain'] },
      { name: 'Vector databases', match: ['Qdrant', 'ChromaDB', 'FAISS', 'Vector search'] },
      { name: 'LiteLLM / OpenAI APIs', match: ['LiteLLM', 'OpenAI API'] },
      { name: 'Fine-tuning (LoRA / PEFT)', match: ['LoRA', 'PEFT'] },
      { name: 'Local LLMs (Ollama)', match: ['Ollama', 'OLLAMA'] },
    ],
  },
  {
    id: 'mlops',
    title: 'MLOps & AIOps',
    icon: Layers,
    color: 'sky',
    description: 'Shipping, observing and operating AI systems.',
    skills: [
      { name: 'Docker', match: ['Docker'] },
      { name: 'Kubernetes', match: ['Kubernetes'] },
      { name: 'FastAPI', match: ['FastAPI'] },
      { name: 'Streamlit', match: ['Streamlit'] },
      { name: 'CI/CD', match: ['CI/CD'] },
      { name: 'Prometheus & Pulse Agent', match: ['Prometheus', 'Pulse Agent'] },
      { name: 'ELK Stack', match: ['ELK Stack'] },
      { name: 'Terraform', match: ['Terraform'] },
    ],
  },
  {
    id: 'data',
    title: 'Cloud & Data',
    icon: Cloud,
    color: 'emerald',
    description: 'Cloud platforms, databases and analytics.',
    skills: [
      { name: 'GCP', match: ['GCP'] },
      { name: 'Azure', match: ['Azure'] },
      { name: 'PostgreSQL / MySQL', match: ['PostgreSQL', 'MySQL'] },
      { name: 'Redis', match: ['Redis'] },
      { name: 'Cassandra', match: ['Cassandra'] },
      { name: 'Data visualisation', match: ['Plotly', 'Matplotlib', 'Seaborn', 'Chart.js'] },
      { name: 'Next.js / TypeScript', match: ['Next.js', 'TypeScript', 'JavaScript'] },
      { name: 'Pandas / NumPy', match: ['Pandas', 'NumPy', 'SciPy'] },
    ],
  },
];

/** Résumé skills without a public project or role on this site to point to yet. */
export const alsoFamiliar = ['AWS', 'XGBoost', 'LSTMs', 'Transformers', 'MLflow', 'Model monitoring', 'Cloud Build', 'Cloud Run', 'MongoDB', 'SQL', 'REST APIs', 'Prompt engineering'];

export type Evidence = { kind: 'project' | 'role'; label: string; href: string };

const norm = (s: string) => s.toLowerCase();

/** Projects and roles whose tech stack includes any of the skill's match labels. */
export function evidenceFor(skill: Skill): Evidence[] {
  const wanted = new Set(skill.match.map(norm));
  const hit = (tech: string[]) => tech.some((t) => wanted.has(norm(t)));
  return [
    ...experiences
      .filter((e) => hit(e.tech))
      .map((e) => ({ kind: 'role' as const, label: e.company, href: `#experience-${e.id}` })),
    ...projects
      .filter((p) => hit(p.tech))
      .map((p) => ({ kind: 'project' as const, label: p.title, href: `#project-${p.id}` })),
  ];
}

// Featured order follows the résumé's selected projects, then other highlights.
const FEATURED_ORDER = [13, 2, 4, 7, 3, 1];
export const featuredProjects = FEATURED_ORDER.map((id) => projects.find((p) => p.id === id)).filter(
  (p): p is Project => !!p && p.featured
);
export const projectById = (id: number) => projects.find((p) => p.id === id);
