/**
 * Single source of truth for the portfolio's content. Every section (hero, simulations,
 * carousel, flashcards, timeline, GitHub panel) reads from here, so a change made once
 * shows up everywhere.
 *
 * Projects are real repositories at github.com/Akshatb848; descriptions and tech stacks
 * were verified against the repositories in March 2026.
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
  github: string;
  language: string;
  icon: LucideIcon;
  featured: boolean;
  /** Path under /public; only rendered when the file exists at build time. A .jpg with the
   *  same name next to it is used as the poster frame. */
  video?: string;
  /** 'concept' = AI-generated visual (labelled on the site); 'recording' = real screen capture. */
  videoKind?: 'concept' | 'recording';
};

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
      'End-to-end AI Governance & Risk Management platform using a multi-agent architecture. Audits ML models for fairness, drift, and explainability (SHAP), and evaluates GenAI/RAG systems for prompt injection resistance and citation accuracy. Generates compliance-ready PDF reports.',
    tech: ['Python', 'LangGraph', 'Streamlit', 'SHAP', 'Jupyter', 'RAG'],
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
      'Open-source Tableau AI alternative offering automated statistical insights, time-series forecasting with Facebook Prophet, and natural language queries for plain-English data exploration. Features an executive dashboard studio for saving AI-generated insights as reusable cards.',
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
    featured: true,
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
    title: 'CNN Script Identification (99.34% Accuracy)',
    description:
      'Identifies degraded Devanagari and Bangla script characters using four CNN architectures on the Ekush dataset (600K+ images). VGG-16 achieves 99.34%, DenseNet-121 98.89%, ResNet-50 98.60%, AlexNet 97.75%. Dockerized with a Streamlit web interface for live inference.',
    tech: ['Python', 'TensorFlow', 'Keras', 'VGG-16', 'ResNet-50', 'Streamlit', 'Docker'],
    category: 'Computer Vision',
    color: 'rose',
    github:
      'https://github.com/Akshatb848/Degraded-Devanagari-and-Bangla-Script-Identification-Using-CNN-Frameworks',
    language: 'Python',
    icon: Languages,
    featured: false,
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
    company: 'Jio Platforms Limited',
    companyInitial: 'JP',
    role: 'Assistant Manager (AIOps)',
    type: 'Full-time',
    period: 'Present',
    location: 'India',
    color: 'indigo',
    description:
      "AIOps role at India's largest digital services platform (400M+ users), building and deploying machine learning solutions for network operations and internal tooling.",
    bullets: [
      'Designing and deploying production ML pipelines for large-scale data processing',
      'Building RAG-based retrieval systems and LLM-powered internal tools',
      'Developing AI automation systems for network operations and monitoring',
      'Implementing MLOps practices for continuous model training and deployment',
      'Collaborating on generative AI features serving enterprise and consumer products',
    ],
    tech: ['Python', 'PyTorch', 'LangChain', 'AWS', 'Kubernetes', 'MLflow'],
  },
  {
    id: 2,
    company: 'Deloitte South Asia',
    companyInitial: 'DL',
    role: 'Intern – EDUT – Technology and Transformation',
    type: 'Internship',
    period: '',
    location: 'India',
    color: 'emerald',
    description:
      'Technology and Transformation internship within the EDUT practice, delivering AI and ML consulting for enterprise clients across industry verticals.',
    bullets: [
      'Built and deployed ML models for enterprise clients in finance, healthcare, and education',
      'Developed NLP and computer vision solutions for document intelligence use cases',
      'Created an AI-powered analytics dashboard for India\'s Ministry of Education (MoE EDUT)',
      'Integrated FAISS vector search with Ollama LLM and FastAPI for RAG-based querying',
      'Containerized the full analytics stack using Docker for deployment consistency',
    ],
    tech: ['Python', 'FAISS', 'Ollama', 'FastAPI', 'Docker', 'Power BI'],
    githubRepo: 'https://github.com/Akshatb848/Deloitte-South-Asia-projects',
  },
  {
    id: 3,
    company: 'Unified Mentor',
    companyInitial: 'UM',
    role: 'Data Science Intern',
    type: 'Internship',
    period: '',
    location: 'Remote',
    color: 'purple',
    description:
      'Data science internship building ML-powered products, developing recommendation and personalization systems for educational technology platforms.',
    bullets: [
      'Designed recommendation engine for personalizing learning content and pathways',
      'Developed NLP pipelines for automated educational content processing',
      'Created student performance prediction models for early intervention systems',
      'Conducted EDA and feature engineering on large student datasets',
    ],
    tech: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'SQL'],
    githubRepo: 'https://github.com/Akshatb848/UNIFIED-MENTOR',
  },
  {
    id: 4,
    company: 'C-DOT (Centre for Development of Telematics)',
    companyInitial: 'CD',
    role: 'Research Engineer – AI / ML',
    type: 'Contract',
    period: '',
    location: 'New Delhi, India',
    color: 'rose',
    description:
      'Government of India telecom research institute. Contributed to AI-driven network security and optimization research.',
    bullets: [
      'Developed deep learning models for network intrusion detection and classification',
      'Built ML-based traffic analysis systems for telecom network optimization',
      'Implemented unsupervised anomaly detection for critical infrastructure monitoring',
    ],
    tech: ['Python', 'TensorFlow', 'OpenCV', 'Scikit-learn', 'Docker', 'Linux'],
  },
  {
    id: 5,
    company: 'Feynn Labs',
    companyInitial: 'FL',
    role: 'AI Research Intern',
    type: 'Internship',
    period: '',
    location: 'Remote',
    color: 'amber',
    description:
      'Early-stage AI research company. Built ML models and contributed to AI product development and research initiatives.',
    bullets: [
      'Developed NLP models for text classification and sentiment analysis tasks',
      'Built computer vision data augmentation pipelines to improve model accuracy',
      'Contributed to open-source ML projects and internal research tooling',
    ],
    tech: ['Python', 'PyTorch', 'HuggingFace', 'Pandas', 'Scikit-learn'],
  },
];

export const education = [
  {
    institution: 'University of Southampton',
    degree: 'MSc International Management',
    location: 'Southampton, UK',
    initial: 'UoS',
    color: 'indigo',
    highlights: [
      'Strategic business decision-making with data-driven AI frameworks',
      'Accounting, financial modelling, and risk management using quantitative methods',
      'Marketing analytics and customer intelligence powered by machine learning',
      'International business strategy with focus on digital transformation and AI adoption',
    ],
  },
  {
    institution: 'Amity University',
    degree: 'B.Tech Computer Science & Engineering',
    location: 'Noida, India',
    initial: 'AU',
    color: 'emerald',
    highlights: [
      'Specialization in Artificial Intelligence & Machine Learning',
      'Final year project: Degraded Devanagari and Bangla Script Identification using CNN frameworks',
      'Active participant in AI/ML competitions and inter-university hackathons',
    ],
  },
];

/**
 * Certifications verified from LinkedIn profile.
 */
export const certifications = [
  { name: 'Deep Learning Specialization', issuer: 'deeplearning.ai', color: 'violet' },
  { name: 'Machine Learning Specialization', issuer: 'Coursera / Andrew Ng', color: 'indigo' },
  { name: 'TensorFlow Developer Certificate', issuer: 'Google', color: 'amber' },
  { name: 'Generative AI with LLMs', issuer: 'AWS & Coursera', color: 'orange' },
  { name: 'MLOps Specialization', issuer: 'deeplearning.ai', color: 'violet' },
  { name: 'LangChain for LLM Application Development', issuer: 'deeplearning.ai', color: 'emerald' },
  { name: 'AWS Certified Machine Learning – Specialty', issuer: 'Amazon Web Services', color: 'orange' },
  { name: 'Microsoft AI & ML Engineering', issuer: 'Microsoft', color: 'sky' },
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
    description: 'Core ML and deep learning used across production projects and research.',
    skills: [
      { name: 'Python', match: ['Python'] },
      { name: 'PyTorch', match: ['PyTorch'] },
      { name: 'TensorFlow / Keras', match: ['TensorFlow', 'Keras'] },
      { name: 'Scikit-learn', match: ['Scikit-learn', 'Random Forest', 'K-Means', 'KNN'] },
      { name: 'Computer Vision', match: ['OpenCV', 'VGG-16', 'ResNet-50', 'CNN'] },
      { name: 'Explainability (SHAP)', match: ['SHAP'] },
      { name: 'Pandas / NumPy', match: ['Pandas', 'NumPy', 'SciPy'] },
      { name: 'Time-series (Prophet)', match: ['Prophet'] },
    ],
  },
  {
    id: 'genai',
    title: 'Generative AI & Agents',
    icon: Zap,
    color: 'purple',
    description: 'RAG, fine-tuning and multi-agent systems, from notebook to product.',
    skills: [
      { name: 'RAG systems', match: ['RAG'] },
      { name: 'Agentic / multi-agent AI', match: ['Agents', 'LangGraph'] },
      { name: 'LangChain', match: ['LangChain'] },
      { name: 'LangGraph', match: ['LangGraph'] },
      { name: 'Fine-tuning (LoRA / PEFT)', match: ['LoRA', 'PEFT'] },
      { name: 'Hugging Face', match: ['HuggingFace', 'Zephyr-7B'] },
      { name: 'Vector search', match: ['FAISS', 'ChromaDB', 'Pinecone'] },
      { name: 'Local LLMs (Ollama)', match: ['Ollama', 'OLLAMA'] },
    ],
  },
  {
    id: 'mlops',
    title: 'MLOps & Deployment',
    icon: Layers,
    color: 'sky',
    description: 'Packaging, serving and operating ML systems.',
    skills: [
      { name: 'Docker', match: ['Docker'] },
      { name: 'FastAPI', match: ['FastAPI'] },
      { name: 'REST APIs', match: ['REST API', 'FastAPI'] },
      { name: 'Streamlit apps', match: ['Streamlit'] },
      { name: 'MLflow', match: ['MLflow'] },
      { name: 'Kubernetes', match: ['Kubernetes'] },
      { name: 'Nginx', match: ['Nginx'] },
      { name: 'Linux', match: ['Linux'] },
    ],
  },
  {
    id: 'data',
    title: 'Data & Cloud',
    icon: Cloud,
    color: 'emerald',
    description: 'Analytics, visualisation and cloud infrastructure for AI workloads.',
    skills: [
      { name: 'SQL', match: ['SQL'] },
      { name: 'Data visualisation', match: ['Plotly', 'Matplotlib', 'Seaborn', 'Chart.js', 'Power BI'] },
      { name: 'AWS', match: ['AWS'] },
      { name: 'JavaScript / TypeScript', match: ['JavaScript', 'TypeScript'] },
      { name: 'Statistics', match: ['Statistics', 'PCA', 'SciPy'] },
      { name: 'Audio ML (Librosa)', match: ['Librosa'] },
    ],
  },
];

/** Skills listed on the résumé that have no public project evidence yet. */
export const alsoFamiliar = ['GCP', 'Azure', 'Terraform', 'Apache Spark', 'Apache Airflow', 'Redis', 'PostgreSQL', 'MongoDB', 'Pinecone', 'CI/CD'];

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

export const featuredProjects = projects.filter((p) => p.featured);
export const projectById = (id: number) => projects.find((p) => p.id === id);
