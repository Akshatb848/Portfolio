/**
 * Case-study detail for each project: the architecture as an ordered flow and the figures
 * worth calling out. Every stage and number restates the project description or its
 * repository README; nothing here is new or estimated.
 */
export type Stage = { label: string; detail: string };
export type Figure = { value: string; label: string };
export type CaseStudy = { stages: Stage[]; figures: Figure[] };

export const caseStudies: Record<number, CaseStudy> = {
  14: {
    stages: [
      { label: 'Pitch intake', detail: 'FastAPI endpoint receives the deck and founder data' },
      { label: 'Redis queue', detail: 'Each deal becomes a job for a background worker' },
      { label: 'Specialist agents', detail: 'Market & moat, financial metrics, founder–market fit, ESG (Ollama)' },
      { label: 'Deterministic score', detail: 'Rules, not an LLM, turn agent findings into a verdict' },
      { label: 'Verdict', detail: 'Yes, Maybe, Needs Review or No' },
      { label: 'IC memo', detail: 'An agent drafts the investment-committee memo; results stored in PostgreSQL' },
    ],
    figures: [
      { value: '5', label: 'Agents incl. IC memo' },
      { value: '4', label: 'Verdicts' },
      { value: '130', label: 'Passing tests' },
    ],
  },
  13: {
    stages: [
      { label: 'Next.js UI', detail: 'Brief request; live progress streamed over SSE' },
      { label: 'FastAPI', detail: 'API layer and job orchestration' },
      { label: 'LangGraph', detail: 'Routes work across the agent graph' },
      { label: '8 agents', detail: 'Specialists via LiteLLM, each citing sources' },
      { label: 'PostgreSQL + Redis', detail: 'State, results and caching' },
      { label: 'Report', detail: 'Briefs, roadmaps, SWOT, summaries, PDF' },
    ],
    figures: [
      { value: '8', label: 'Specialist agents' },
      { value: '5', label: 'Report types' },
      { value: 'GCP', label: 'Terraform + CI/CD deploy' },
    ],
  },
  1: {
    stages: [
      { label: 'Swing input', detail: 'Captured through the Streamlit dashboard' },
      { label: 'Agents', detail: 'Modular agents / core / services' },
      { label: 'ChromaDB RAG', detail: 'Retrieves coaching knowledge' },
      { label: 'Feedback', detail: 'Coaching guidance back to the player' },
    ],
    figures: [
      { value: '149', label: 'Passing tests in CI' },
      { value: '3', label: 'Languages: Python, TS, Swift' },
    ],
  },
  2: {
    stages: [
      { label: 'System under audit', detail: 'An ML model or a GenAI / RAG app' },
      { label: 'Check agents', detail: 'Fairness, drift, SHAP, prompt injection, citations' },
      { label: 'Controls', detail: 'Each control scored PASS, FAIL or REVIEW' },
      { label: 'Risk register', detail: 'Remediation actions and workflow traces' },
      { label: 'Audit pack', detail: 'Audit-ready PDF via ReportLab' },
    ],
    figures: [
      { value: '5', label: 'Check families' },
      { value: '3', label: 'Control outcomes' },
    ],
  },
  3: {
    stages: [
      { label: 'Dataset', detail: 'Uploaded for analysis' },
      { label: 'Agents', detail: 'Automate the data-science workflow' },
      { label: 'RAG', detail: 'Knowledge-grounded analysis' },
      { label: 'FastAPI services', detail: 'Core and service layers' },
      { label: 'Dashboard', detail: 'Streamlit front end, Docker-packaged' },
    ],
    figures: [{ value: '4', label: 'Layers: agents, core, services, dashboard' }],
  },
  4: {
    stages: [
      { label: 'Data', detail: 'Pandas, NumPy and SciPy' },
      { label: 'Detect + forecast', detail: 'Anomaly detection and Prophet forecasting' },
      { label: 'KPI catalog', detail: 'Semantic definitions of each metric' },
      { label: 'Ask in English', detail: 'Natural-language queries over the KPIs' },
      { label: 'Executive view', detail: 'Plotly cards, exports and summaries' },
    ],
    figures: [{ value: '5', label: 'Analytics capabilities' }],
  },
  5: {
    stages: [
      { label: 'Newsletters', detail: 'Monthly Ministry of Education issues' },
      { label: 'Retrieval', detail: 'Finds the passages that answer the question' },
      { label: 'RAG chatbot', detail: 'Optional local LLM via Ollama' },
      { label: 'Guardrail', detail: 'Retrieval-only fallback, never a guess' },
      { label: 'REST + dashboard', detail: 'FastAPI backend, analytics overview' },
    ],
    figures: [{ value: 'RAG-first', label: 'No-hallucination fallback' }],
  },
  7: {
    stages: [
      { label: 'Character images', detail: 'Degraded handwritten characters in two class folders' },
      { label: 'Preprocess', detail: 'OpenCV clean-up and resizing' },
      { label: 'Custom CNN', detail: 'Keras, with early stopping' },
      { label: 'Script call', detail: 'Devanagari or Bangla, in a Streamlit demo' },
      { label: 'OCR pipeline', detail: 'FastAPI + LangGraph agents; Docker and Kubernetes assets' },
    ],
    figures: [
      { value: '7,628', label: 'Images in the dataset folders' },
      { value: '37', label: 'Passing tests' },
    ],
  },
  8: {
    stages: [
      { label: 'Sensor readings', detail: 'UCI multisensor air-quality data' },
      { label: 'Clean', detail: 'Data-quality caveats documented' },
      { label: 'Random Forest', detail: 'Tuned with RandomizedSearchCV' },
      { label: 'Hold-out test', detail: 'Hourly CO estimates' },
    ],
    figures: [{ value: '0.63', label: 'R² on the hold-out split' }],
  },
  9: {
    stages: [
      { label: 'Indicators', detail: '2015-16 education and census data' },
      { label: 'Elbow', detail: 'Choose the number of clusters' },
      { label: 'K-Means', detail: 'k = 3 district segments' },
      { label: 'PCA view', detail: 'Segments in two dimensions' },
    ],
    figures: [
      { value: '92', label: 'Districts clustered' },
      { value: '3', label: 'Segments' },
    ],
  },
  10: {
    stages: [
      { label: 'GTZAN audio', detail: 'Ten genres' },
      { label: 'Features', detail: 'Librosa descriptors and Mel spectrograms' },
      { label: 'Models', detail: 'Tuned KNN vs a CNN' },
      { label: 'Evaluate', detail: 'Against a 10% chance baseline' },
    ],
    figures: [
      { value: '53.5%', label: 'CNN test accuracy' },
      { value: '52.5%', label: 'KNN test accuracy' },
      { value: '10%', label: 'Chance baseline' },
    ],
  },
  11: {
    stages: [
      { label: 'Survey', detail: 'Airline responses with NPS' },
      { label: 'Select', detail: 'Correlation, VIF and RFE' },
      { label: 'Model', detail: 'Random Forest and XGBoost' },
      { label: 'Explain', detail: 'SHAP ranks the touchpoints' },
    ],
    figures: [
      { value: '73K', label: 'Survey responses' },
      { value: '0.72', label: 'Test R²' },
    ],
  },
  12: {
    stages: [
      { label: 'Newsletter data', detail: 'Monthly Ministry of Education issues' },
      { label: 'FastAPI', detail: 'Backend behind Nginx' },
      { label: 'FAISS', detail: 'Semantic search over the issues' },
      { label: 'Ollama chatbot', detail: 'Answers grounded in retrieved text' },
      { label: 'Command center', detail: 'Chart.js views for cabinet presentations' },
    ],
    figures: [{ value: 'Docker', label: 'Compose deployment' }],
  },
};
