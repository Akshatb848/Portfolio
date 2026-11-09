/**
 * The venture-capital spotlight: the two products built at YourNest Venture Capital, told in
 * plain English for a non-technical reader. Every claim restates the project description, its
 * case study or what the product was seen doing in the recorded walkthrough.
 */
/** A caption line of the explainer and the second it starts (mirrors the burned-in text). */
export type Caption = { t: number; text: string };

export type VentureStory = {
  projectId: number;
  key: 'dealscreener' | 'portal';
  name: string;
  /** One sentence a layperson can repeat. */
  oneLiner: string;
  problem: string;
  solution: string;
  users: string;
  /** What changes for the fund, in plain words. */
  outcomes: string[];
  explainer: { src: string; poster: string; captions: Caption[] };
  /** A real screen recording of the product, when one exists. */
  recording?: { src: string; poster: string; captions?: Caption[] };
};

export const ventureStories: VentureStory[] = [
  {
    projectId: 14,
    key: 'dealscreener',
    name: 'Deal Screener',
    oneLiner: 'An AI first reader for every startup pitch the fund receives.',
    problem:
      'A venture capital fund receives far more startup pitches than its partners have time to read properly, so good deals can wait in an inbox.',
    solution:
      'Four AI reviewers read each pitch for market, financials, team and ESG. Fixed scoring rules, not the AI, turn their findings into Yes, Maybe, Needs Review or No, and an AI drafts the investment memo.',
    users: 'Investment partners and analysts at YourNest Venture Capital.',
    outcomes: [
      'Every pitch gets the same first review',
      'Each verdict comes with the reasons behind it',
      'Gaps such as missing financials go to a person',
    ],
    explainer: {
      src: '/videos/dealscreener-explainer.mp4',
      poster: '/videos/dealscreener-explainer.jpg',
      captions: [
        { t: 0, text: 'A venture capital fund receives far more startup pitches than its partners can read. Deal Screener reads every one of them first.' },
        { t: 5.05, text: 'Four AI reviewers read each pitch: is the market big enough, do the numbers add up, is it the right team, is it responsible?' },
        { t: 11.1, text: 'Every pitch takes the same route, so nothing slips through and every step can be checked.' },
        { t: 17.15, text: 'Fixed scoring rules, not guesswork, turn their findings into a verdict. Missing numbers? It asks a human. Then AI drafts the investment memo.' },
      ],
    },
  },
  {
    projectId: 15,
    key: 'portal',
    name: "Founder's Resource Portal",
    oneLiner: 'One secure home where every founder the fund backs gets its help.',
    problem:
      'After a fund invests, founders need news, templates, introductions and quick answers, and those usually arrive scattered across email and chat.',
    solution:
      "Each founder signs in and sees only their own company: sector news, an approved resource library, a 100-day playbook, events and one tracked help thread to the fund's team. The team drafts content and one Super Admin approves it.",
    users: 'Founders of YourNest portfolio companies, and the YourNest team that supports them.',
    outcomes: [
      'One login instead of scattered email threads',
      'Founders only ever see their own company',
      'Nothing reaches founders without approval',
    ],
    explainer: {
      src: '/videos/founder-portal-explainer.mp4',
      poster: '/videos/founder-portal-explainer.jpg',
      captions: [
        { t: 0, text: "When a fund invests in a startup, its founders need more than money. This portal is where they get the fund's help." },
        { t: 5.05, text: 'A founder signs in and sees only their own company: news for their sector, a 100-day plan, and one place to ask the fund for help.' },
        { t: 11.1, text: "Resources, events and introductions are approved by the fund's team before any founder sees them." },
        { t: 17.15, text: 'Every page checks permissions first, and the team works in three tiers, so private company data stays private.' },
        { t: 22.7, text: 'The real portal, with demo data: a founder ticks off a task in their 100-day plan, then opens YourNest support.' },
      ],
    },
    recording: {
      src: '/videos/founder-portal-real.mp4',
      poster: '/videos/founder-portal-real.jpg',
      captions: [
        { t: 0, text: "A founder signs in to the portal (all companies and people here are made up)." },
        { t: 5.7, text: "Founder signs in" },
        { t: 9.3, text: "A guided walkthrough greets the founder; they skip it" },
        { t: 17.2, text: "Founder opens sector news matched to their company" },
        { t: 20.9, text: "Opens a news brief to read what it means for them" },
        { t: 24.5, text: "Closes the brief" },
        { t: 26.3, text: "Founder opens the Resource Library" },
        { t: 30.6, text: "Previews an approved template: the Fundraising Checklist" },
        { t: 34.4, text: "Closes the preview" },
        { t: 36.1, text: "Founder opens the 100-Day Playbook" },
        { t: 39.3, text: "Ticks off a playbook task: Publish core HR policy" },
        { t: 42.0, text: "Founder opens YourNest support" },
        { t: 45.4, text: "Chooses a topic for the request" },
        { t: 46.7, text: "Writes a short subject" },
        { t: 49.2, text: "Explains what help they need" },
        { t: 52.4, text: "Sends the request to their YourNest team" },
        { t: 57.7, text: "Back on the dashboard: playbook progress (now 38%) and recent activity show the new request" },
        { t: 61.4, text: "Now the fund's side: the YourNest team workspace, as the Super Admin." },
        { t: 69.2, text: "Super Admin signs in" },
        { t: 72.0, text: "Super Admin skips the guided walkthrough" },
        { t: 76.0, text: "Opens the approvals queue" },
        { t: 79.8, text: "Approves a sector update an analyst added; it goes live for the founder" },
        { t: 83.3, text: "Opens Companies & founders" },
        { t: 86.8, text: "Opens one company: its founders, YourNest team and playbook" },
        { t: 93.5, text: "Opens the audit trail: every change is logged" },
      ],
    },
  },
];

/** A step of the recorded portal walkthrough: a real screenshot and what it shows. */
export type TourStep = {
  image: string;
  title: string;
  caption: string;
  /** Where the click happened, as fractions of the screenshot (for the highlight ring). */
  spot?: { x: number; y: number };
};

/** Filled from the real walkthrough recording (synthetic demo data, see the case study note). */
export const portalTour: TourStep[] = [
  { image: '/venture/portal-founder-dashboard.webp', title: 'Dashboard', caption: "A founder lands on their own company's page: news picked for their company, open requests, playbook progress, the next event and recent activity.", spot: { x: 0.61, y: 0.13 } },
  { image: '/venture/portal-sector-updates.webp', title: 'Sector news', caption: 'Policy, market and regulatory updates for their sector, each with its source and date. Opening one gives a short brief on what it means for them.', spot: { x: 0.933, y: 0.542 } },
  { image: '/venture/portal-resource-library.webp', title: 'Resource library', caption: 'Templates the fund has approved, with filters and search, from fundraising checklists to HR policies.', spot: { x: 0.839, y: 0.554 } },
  { image: '/venture/portal-resource-preview.webp', title: 'Preview a template', caption: 'A founder previews a template, downloads it, or asks the fund for help with it in one click.' },
  { image: '/venture/portal-playbook-ticked.webp', title: '100-day playbook', caption: "The first 100 days after investment, split into four phases. Ticking a task records who did it and when, and the fund's team sees the same progress.", spot: { x: 0.233, y: 0.82 } },
  { image: '/venture/portal-request-tracked.webp', title: 'Ask the fund', caption: 'Every request gets a reference number, a named owner at the fund and a plain-language status, so nothing is lost in an inbox.', spot: { x: 0.4, y: 0.33 } },
  { image: '/venture/portal-approvals-queue.webp', title: 'Team approvals', caption: "On the fund's side, anything an analyst adds waits here until the Super Admin approves it. Only then can founders see it.", spot: { x: 0.833, y: 0.545 } },
  { image: '/venture/portal-companies.webp', title: 'Companies & founders', caption: "One card per portfolio company: its founders, the fund's team assigned to it and its playbook progress.", spot: { x: 0.303, y: 0.751 } },
  { image: '/venture/portal-audit-trail.webp', title: 'Audit trail', caption: 'Every change and download is logged with who did it and when.' },
];
