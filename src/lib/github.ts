import { fallbackRepos, type RepoSummary } from '@/data/portfolio';
import { site } from '@/lib/site';

export type GitHubData = {
  repos: RepoSummary[];
  /** 'live' when fetched from the GitHub API, 'snapshot' when using the bundled list. */
  source: 'live' | 'snapshot';
};

type ApiRepo = {
  name: string;
  language: string | null;
  description: string | null;
  pushed_at: string;
  html_url: string;
  fork: boolean;
  archived: boolean;
};

const isApiRepo = (r: unknown): r is ApiRepo =>
  typeof r === 'object' &&
  r !== null &&
  typeof (r as ApiRepo).name === 'string' &&
  typeof (r as ApiRepo).html_url === 'string';

/**
 * Public repositories, fetched at build time and refreshed daily (ISR). Any failure
 * (rate limit, network, unexpected payload) falls back to the bundled snapshot, so the
 * section always renders. Set GITHUB_TOKEN to raise the API rate limit.
 */
export async function getGitHubData(): Promise<GitHubData> {
  try {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    const res = await fetch(
      `https://api.github.com/users/${site.githubUsername}/repos?per_page=100&sort=pushed`,
      { headers, next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const body: unknown = await res.json();
    if (!Array.isArray(body)) throw new Error('Unexpected GitHub payload');

    const repos = body
      .filter(isApiRepo)
      .filter((r) => !r.fork && !r.archived && r.name !== site.githubUsername)
      .map<RepoSummary>((r) => ({
        name: r.name,
        lang: r.language ?? 'Other',
        description: r.description ?? undefined,
        pushedAt: r.pushed_at,
        url: r.html_url,
      }));

    if (repos.length === 0) throw new Error('No public repositories returned');
    return { repos, source: 'live' };
  } catch {
    return { repos: fallbackRepos, source: 'snapshot' };
  }
}
