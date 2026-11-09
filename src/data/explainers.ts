/**
 * Captioned animated explainers for the other projects (rendered with the reel-motion-styles
 * engine). Captions repeat the burned-in text so phones can show them readably; every figure
 * comes from data/caseStudies.ts.
 */
import type { Caption } from '@/data/venture';

export const explainers: Record<number, { src: string; poster: string; captions: Caption[] }> = {
  13: {
    src: '/videos/asis-explainer.mp4',
    poster: '/videos/asis-explainer.jpg',
    captions: [
      { t: 0, text: "A leadership team asks a strategic question. ASIS turns it into a cited, board-ready brief." },
      { t: 4.75, text: "The request moves through an agent graph, step by step, with live progress on screen." },
      { t: 10.6, text: "Eight specialist agents research it and cite their sources: briefs, roadmaps, SWOT analyses and PDF reports." },
    ],
  },
  1: {
    src: '/videos/tennisiq-explainer.mp4',
    poster: '/videos/tennisiq-explainer.jpg',
    captions: [
      { t: 0, text: "Film a tennis match on one camera and TennisIQ turns it into a coaching report." },
      { t: 4.75, text: "Computer vision finds the court, ball and players and measures every rally. Then AI agents write the coaching." },
      { t: 10.6, text: "151 tests pass in CI on three Python versions." },
    ],
  },
  2: {
    src: '/videos/aegis-explainer.mp4',
    poster: '/videos/aegis-explainer.jpg',
    captions: [
      { t: 0, text: "Companies must now prove their AI is fair, stable and safe. AEGIS audits ML models and GenAI apps." },
      { t: 4.75, text: "Agents check fairness, drift, explainability, prompt injection and citations, then log risks and fixes." },
      { t: 10.6, text: "Each control ends as Pass, Fail or Review, and the results become an audit-ready PDF." },
    ],
  },
  3: {
    src: '/videos/dsagents-explainer.mp4',
    poster: '/videos/dsagents-explainer.jpg',
    captions: [
      { t: 0, text: "Data analysis means hours of repetitive steps. This platform hands them to AI agents." },
      { t: 4.75, text: "Upload a dataset: agents run the workflow, with retrieval to ground the analysis." },
      { t: 10.6, text: "Four layers: agents, core, services and dashboard, shipped with Docker." },
    ],
  },
  4: {
    src: '/videos/analytics-explainer.mp4',
    poster: '/videos/analytics-explainer.jpg',
    captions: [
      { t: 0, text: "Executives want answers, not spreadsheets. This dashboard explains the numbers." },
      { t: 4.75, text: "It flags anomalies, forecasts trends and lets anyone ask about a KPI in plain English." },
      { t: 10.6, text: "Five analytics tools in one place, ready to export for a meeting." },
    ],
  },
  5: {
    src: '/videos/edurag-explainer.mp4',
    poster: '/videos/edurag-explainer.jpg',
    captions: [
      { t: 0, text: "Readers need quick answers from monthly education newsletters, without made-up facts." },
      { t: 4.75, text: "The chatbot first finds the passages that answer the question, then replies only from them." },
      { t: 10.6, text: "If nothing relevant is found, it says so instead of guessing." },
    ],
  },
  7: {
    src: '/videos/indic-explainer.mp4',
    poster: '/videos/indic-explainer.jpg',
    captions: [
      { t: 0, text: "Old, damaged handwriting is hard for software to read. First it must know which script it is looking at." },
      { t: 4.75, text: "Images are cleaned up, then a custom neural network decides: Devanagari or Bangla." },
      { t: 10.6, text: "Trained on 7,628 character images, with a demo app and 37 passing tests." },
    ],
  },
  8: {
    src: '/videos/airquality-explainer.mp4',
    poster: '/videos/airquality-explainer.jpg',
    captions: [
      { t: 0, text: "Can a model estimate carbon monoxide levels from a cluster of air sensors?" },
      { t: 4.75, text: "Sensor data is cleaned, then a tuned Random Forest learns the pattern." },
      { t: 10.6, text: "On data it never saw it scores R\u00b2 0.63, and the data's limits are written down." },
    ],
  },
  9: {
    src: '/videos/edtech-explainer.mp4',
    poster: '/videos/edtech-explainer.jpg',
    captions: [
      { t: 0, text: "An EdTech startup cannot launch everywhere at once. Which districts look alike?" },
      { t: 4.75, text: "Education and census indicators go into K-Means clustering; the elbow method picks three groups." },
      { t: 10.6, text: "92 districts fall into three segments: a first step toward choosing where to focus." },
    ],
  },
  10: {
    src: '/videos/genre-explainer.mp4',
    poster: '/videos/genre-explainer.jpg',
    captions: [
      { t: 0, text: "Can a computer tell ten music genres apart just by listening?" },
      { t: 4.75, text: "Songs become audio features and spectrogram images; a KNN model and a neural network compete." },
      { t: 10.6, text: "Both beat chance about five times over: 53.5% and 52.5% against 10%." },
    ],
  },
  11: {
    src: '/videos/nps-explainer.mp4',
    poster: '/videos/nps-explainer.jpg',
    captions: [
      { t: 0, text: "Airlines track Net Promoter Score. But which part of the journey actually moves it?" },
      { t: 4.75, text: "73,000 survey responses go through feature selection and two models." },
      { t: 10.6, text: "SHAP then ranks the touchpoints that drive the score (test R\u00b2 0.72)." },
    ],
  },
  12: {
    src: '/videos/edinsights-explainer.mp4',
    poster: '/videos/edinsights-explainer.jpg',
    captions: [
      { t: 0, text: "Monthly education reports are long. This dashboard makes them searchable and visual." },
      { t: 4.75, text: "Data is indexed with FAISS so a chatbot answers from the right passages, even with no LLM running." },
      { t: 10.6, text: "Timeline, charts, search and chat in one place. This public version runs on sample data." },
    ],
  },
};
