import { experiences, projects } from '@/data/portfolio';

/**
 * A tiny, real retrieval engine over this site's own content: TF-IDF vectors and cosine
 * similarity, computed in the browser. It powers the "ask this site" demo; there is no LLM,
 * the answer is the best-matching sentence, cited.
 */
export type Doc = { id: string; title: string; kind: 'Project' | 'Role'; href: string; text: string; sentences: string[] };
export type Hit = { doc: Doc; score: number; sentence: string };

const STOP = new Set(
  'a an and are as at be but by can did do does for from has have how i in into is it its of on or that the their them they this to was what when where which who why will with you your my me about any use used using work worked project projects experience build built made make know'.split(' ')
);

export const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9+#.\- ]+/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^[.\-]+|[.\-]+$/g, ''))
    .filter((w) => w.length > 1 && !STOP.has(w));

const splitSentences = (s: string) => s.split(/(?<=[.!?])\s+/).filter(Boolean);

let index: { docs: Doc[]; idf: Map<string, number>; vecs: Map<string, number>[] } | null = null;

function build() {
  const docs: Doc[] = [
    ...projects.map((p) => {
      const text = `${p.title}. ${p.description} Built with ${p.tech.join(', ')}.`;
      return { id: `p${p.id}`, title: p.title, kind: 'Project' as const, href: `#project-${p.id}`, text, sentences: splitSentences(text) };
    }),
    ...experiences.map((e) => {
      const text = `${e.role} at ${e.company}. ${e.description} ${e.bullets.join(' ')} Tools: ${e.tech.join(', ')}.`;
      return { id: `e${e.id}`, title: `${e.role}, ${e.company}`, kind: 'Role' as const, href: `#experience-${e.id}`, text, sentences: splitSentences(text) };
    }),
  ];
  const df = new Map<string, number>();
  const tfs = docs.map((d) => {
    const tf = new Map<string, number>();
    for (const t of tokenize(d.text)) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
    return tf;
  });
  const idf = new Map<string, number>();
  for (const [t, n] of df) idf.set(t, Math.log((docs.length + 1) / (n + 1)) + 1);
  const vecs = tfs.map((tf) => normalize(weigh(tf, idf)));
  return { docs, idf, vecs };
}

const weigh = (tf: Map<string, number>, idf: Map<string, number>) => {
  const v = new Map<string, number>();
  for (const [t, n] of tf) if (idf.has(t)) v.set(t, (1 + Math.log(n)) * idf.get(t)!);
  return v;
};

const normalize = (v: Map<string, number>) => {
  const len = Math.hypot(...v.values()) || 1;
  for (const [t, x] of v) v.set(t, x / len);
  return v;
};

const dot = (a: Map<string, number>, b: Map<string, number>) => {
  let s = 0;
  for (const [t, x] of a) s += x * (b.get(t) ?? 0);
  return s;
};

/** The query vector's strongest terms, for display. */
export function embed(query: string) {
  index ??= build();
  const tf = new Map<string, number>();
  for (const t of tokenize(query)) tf.set(t, (tf.get(t) ?? 0) + 1);
  return normalize(weigh(tf, index.idf));
}

export function search(query: string, k = 3): Hit[] {
  index ??= build();
  const q = embed(query);
  if (q.size === 0) return [];
  return index.docs
    .map((doc, i) => ({ doc, score: dot(q, index!.vecs[i]) }))
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ doc, score }) => {
      // Cite the descriptive sentence that best matches the query (not the title line or
      // the tech list, which match often but say little).
      const prose = doc.sentences.slice(1).filter((s) => !/^(Built with|Tools:)/.test(s));
      const candidates = prose.length ? prose : doc.sentences;
      let best = candidates[0];
      let bestScore = 0;
      for (const s of candidates) {
        const sv = normalize(weigh(new Map(tokenize(s).map((t) => [t, 1])), index!.idf));
        const sc = dot(q, sv);
        if (sc > bestScore) {
          bestScore = sc;
          best = s;
        }
      }
      return { doc, score, sentence: best };
    });
}

/** Below this similarity the demo refuses instead of guessing, like the real chatbot. */
export const MIN_SCORE = 0.12;
