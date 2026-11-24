import type { TourStep } from '@/data/venture';

/**
 * Click-through tours for each project, built only from real screens and charts committed to
 * the project's own repository (docs/screenshots or docs/images). Captions describe what is on
 * the screen; where a screen ran on demo data or a fallback mode, the caption says so.
 */
export type Tour = {
  /** 'app' = screens of the running software, 'results' = charts from the analysis. */
  kind: 'app' | 'results';
  note: string;
  steps: TourStep[];
};

const t = (slug: string, file: string) => `/tours/${slug}/${file}.webp`;

export const tours: Record<number, Tour> = {
  13: {
    kind: 'app',
    note: 'Screens from a local run of the public repository.',
    steps: [
      { image: t('asis', 'landing'), title: 'Start', caption: 'The landing page. You type a strategic question and ASIS hands it to eight specialist agents.' },
      { image: t('asis', 'analysis-progress'), title: 'Agents at work', caption: 'Each agent reports its status while the analysis runs: orchestrator, market, risk, competitors, geography, finance, strategic options and the final synthesis.' },
      { image: t('asis', 'agent-collaboration'), title: 'Hand-offs', caption: 'A graph of which agent passed work to which, with a replay button. The panel on the right shows each agent’s framework and quality score.' },
      { image: t('asis', 'framework-exhibits'), title: 'Frameworks', caption: 'Findings laid out as consulting exhibits: PESTLE, Porter’s Five Forces, SWOT, Ansoff, BCG, McKinsey 7S, Blue Ocean and a balanced scorecard.' },
      { image: t('asis', 'decision-brief'), title: 'The brief', caption: 'The recommendation, with its confidence score and quality checks. This run had no live model connected, so the app shows a template-mode banner and the figures are placeholders.' },
    ],
  },
  1: {
    kind: 'app',
    note: 'Screens from the public repository, run on its demo clip.',
    steps: [
      { image: t('tennis', 'input'), title: 'The clip', caption: 'The demo uses a synthetic clip of a court, so it runs anywhere without real match footage.' },
      { image: t('tennis', 'processing'), title: 'Analysis', caption: 'Upload, configure, then watch each step finish: court detection, player and ball tracking, shot classification, rallies, statistics and the coaching pass.' },
      { image: t('tennis', 'report'), title: 'Coaching report', caption: 'Ball speed, rallies, shot quality, footwork and tactics, followed by strengths and what to work on next.' },
      { image: t('tennis', 'dashboard'), title: 'Match dashboard', caption: 'The Streamlit view of a demo match: the score, key statistics and a side-by-side player comparison.' },
    ],
  },
  2: {
    kind: 'app',
    note: 'Screens from a run on the built-in demo dataset with a small open-weights model.',
    steps: [
      { image: t('aegis', 'app'), title: 'Run an audit', caption: 'One audit run: 2 controls pass, 2 fail, 2 need review and 4 risks go into the register. Below that, red-team prompts and whether each one was refused.' },
      { image: t('aegis', 'audit-pack'), title: 'Audit pack', caption: 'The PDF it writes: an executive summary, each control with its evidence, and a remediation addendum for the controls that failed.' },
    ],
  },
  3: {
    kind: 'app',
    note: 'Screens from a run on the Iris sample dataset that ships with the app.',
    steps: [
      { image: t('dsagents', 'modeling'), title: 'Leaderboard', caption: 'Seven models trained and ranked, with the winning model and its settings.' },
      { image: t('dsagents', 'exploration'), title: 'Exploration', caption: 'Skewness, normality and group tests, a correlation matrix and a multicollinearity check, all produced by the pipeline.' },
      { image: t('dsagents', 'feature_engineering'), title: 'Feature engineering', caption: 'The data before and after: outliers clipped, features scaled and interaction features added.' },
      { image: t('dsagents', 'assistant'), title: 'Assistant', caption: 'A plain-language summary of the whole run, with buttons to explain the results or suggest improvements.' },
    ],
  },
  4: {
    kind: 'app',
    note: 'Screens from the app running on its 2,000-row sample dataset.',
    steps: [
      { image: t('analytics', 'overview'), title: 'Overview', caption: 'KPI cards, filters, sales over time, sales by category and a correlation matrix.' },
      { image: t('analytics', 'insights'), title: 'Insights', caption: 'Findings and recommendations written in plain English, so nobody has to read the charts to get the point.' },
      { image: t('analytics', 'predictions'), title: 'Forecast', caption: 'A sales forecast with a reliability check. On this sample data the app says plainly that the forecast is no better than a naive guess.' },
      { image: t('analytics', 'ask_data'), title: 'Ask your data', caption: 'Type a question and get a chart with the table behind it. Here: total sales by region and channel.' },
    ],
  },
  5: {
    kind: 'app',
    note: 'Cropped to the chatbot panel of the running dashboard.',
    steps: [
      { image: t('edurag', 'chat-answer'), title: 'Grounded answer', caption: 'Asked about RVSK progress, the assistant answers from the newsletter data and lays the figures out as a table.' },
      { image: t('edurag', 'chat-refusal'), title: 'Out of scope', caption: 'Asked something the newsletters don’t cover, it says so and lists what it can answer instead.' },
    ],
  },
  7: {
    kind: 'app',
    note: 'The app screen and the training chart from the public repository.',
    steps: [
      { image: t('indic', 'app'), title: 'The app', caption: 'The Streamlit app. This public copy ships without trained weights, and the app says so rather than showing made-up predictions.' },
      { image: t('indic', 'training'), title: 'Training run', caption: 'Accuracy per epoch from the saved Keras log. The chart notes that “validation” reused the training images, so the score is not a true test result.' },
    ],
  },
  8: {
    kind: 'results',
    note: 'Chart from the analysis notebook.',
    steps: [
      { image: t('airquality', 'importance'), title: 'What drives the estimate', caption: 'Random Forest feature importance: the nitrogen oxide readings carry most of the signal for carbon monoxide.' },
    ],
  },
  9: {
    kind: 'results',
    note: 'Charts from the analysis notebook.',
    steps: [
      { image: t('edtech', 'elbow_curve'), title: 'Choosing k', caption: 'The elbow curve. The bend is why the model uses three clusters.' },
      { image: t('edtech', 'kmeans_population_vs_literacy'), title: 'Clusters', caption: 'Districts plotted by population and literacy, coloured by cluster.' },
      { image: t('edtech', 'pca_projection'), title: 'PCA view', caption: 'All the indicators reduced to two dimensions to check that the groups separate.' },
    ],
  },
  10: {
    kind: 'results',
    note: 'Charts from the training notebooks.',
    steps: [
      { image: t('genre', 'model_comparison'), title: 'Model comparison', caption: 'Test accuracy for each version, from a plain KNN at 34% to the CNN at 53.5%. Chance is 10%.' },
      { image: t('genre', 'knn_per_genre_f1'), title: 'Per genre', caption: 'Classical and jazz are the easiest to recognise. Rock and hip-hop are the hardest.' },
      { image: t('genre', 'cnn_training'), title: 'Training curve', caption: 'The CNN gets close to 100% on its training data but stays around 55% on test data. It overfits, and the chart makes that visible.' },
    ],
  },
  11: {
    kind: 'results',
    note: 'Charts from the analysis notebook.',
    steps: [
      { image: t('nps', 'shap_summary'), title: 'What moves NPS', caption: 'SHAP summary: on-board experience, arrival and boarding have the biggest effect on the score.' },
      { image: t('nps', 'rf_feature_importance'), title: 'Random Forest', caption: 'The Random Forest model puts the same three touchpoints at the top.' },
      { image: t('nps', 'xgb_baseline_feature_importance'), title: 'XGBoost', caption: 'XGBoost agrees that the on-board experience matters most.' },
    ],
  },
  12: {
    kind: 'app',
    note: 'Screens from the public demo, which runs on bundled sample data.',
    steps: [
      { image: t('edinsights', 'dashboard'), title: 'Dashboard', caption: 'Pick a month and the KPI cards and charts update.' },
      { image: t('edinsights', 'chat'), title: 'Chatbot', caption: 'With no LLM running, the chatbot returns the newsletter passages that answer the question instead of making something up.' },
    ],
  },
};
