/**
 * The AI toolkit shown as floating tiles. Each entry says what the tool was actually used
 * for and points at the project or role that shows it, so nothing here is a bare logo wall.
 */
import {
  Sparkles,
  Bot,
  Network,
  Link2,
  Smile,
  Cpu,
  Workflow,
  Database,
  LayoutDashboard,
  Zap,
  Container,
  type LucideIcon,
} from 'lucide-react';
import type { ToneName } from '@/lib/tones';
import { site } from '@/lib/site';

export type Tool = {
  id: string;
  name: string;
  icon: LucideIcon;
  color: ToneName;
  usedFor: string;
  /** In-page anchor (#project-N / #experience-N) or external link. */
  href?: string;
  linkLabel?: string;
  projectId?: number;
};

export const tools: Tool[] = [
  {
    id: 'claude',
    name: 'Claude',
    icon: Sparkles,
    color: 'orange',
    usedFor: 'Built and shipped this portfolio with Claude Code: the 3D scenes, accessibility audits and pull requests.',
  },
  {
    id: 'openai',
    name: 'OpenAI API · LiteLLM',
    icon: Bot,
    color: 'emerald',
    usedFor: 'Model-agnostic LLM calls behind the 8-agent ASIS platform.',
    href: '#project-13',
    linkLabel: 'See ASIS',
    projectId: 13,
  },
  {
    id: 'langgraph',
    name: 'LangGraph',
    icon: Network,
    color: 'violet',
    usedFor: 'Agent orchestration for ASIS and the AEGIS governance audit pipeline.',
    href: '#project-2',
    linkLabel: 'See AEGIS',
    projectId: 2,
  },
  {
    id: 'langchain',
    name: 'LangChain',
    icon: Link2,
    color: 'teal',
    usedFor: 'Multi-agent systems at Deloitte that cut manual data-analysis effort by 40%.',
    href: '#experience-2',
    linkLabel: 'See the Deloitte role',
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    icon: Smile,
    color: 'amber',
    usedFor: 'Open-weights models (Qwen, MiniLM embeddings) that let AEGIS run without API keys.',
    href: '#project-2',
    linkLabel: 'See AEGIS',
    projectId: 2,
  },
  {
    id: 'ollama',
    name: 'Ollama',
    icon: Cpu,
    color: 'slate',
    usedFor: 'Local LLMs behind the RAG chatbot and the Deloitte education intelligence dashboard.',
    href: '#project-5',
    linkLabel: 'See the RAG chatbot',
    projectId: 5,
  },
  {
    id: 'n8n',
    name: 'n8n',
    icon: Workflow,
    color: 'rose',
    usedFor: 'Low-code automation workflows behind the AI content on @the_lazy_automator.',
    href: site.instagram,
    linkLabel: 'See @the_lazy_automator',
  },
  {
    id: 'vector',
    name: 'FAISS · ChromaDB',
    icon: Database,
    color: 'indigo',
    usedFor: 'Semantic search for RAG in the Deloitte dashboard and the data-science agent platform.',
    href: '#project-12',
    linkLabel: 'See the Deloitte dashboard',
    projectId: 12,
  },
  {
    id: 'streamlit',
    name: 'Streamlit',
    icon: LayoutDashboard,
    color: 'fuchsia',
    usedFor: 'Interactive front ends for AEGIS, TennisIQ and the AI analytics dashboard.',
    href: '#project-1',
    linkLabel: 'See TennisIQ',
    projectId: 1,
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    icon: Zap,
    color: 'cyan',
    usedFor: 'APIs for ASIS, the data-science agent platform and the RAG chatbot.',
    href: '#project-3',
    linkLabel: 'See the agent platform',
    projectId: 3,
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: Container,
    color: 'sky',
    usedFor: 'Containerised deployments for ASIS, TennisIQ and the Indic script classifier.',
    href: '#project-7',
    linkLabel: 'See the Indic classifier',
    projectId: 7,
  },
];
