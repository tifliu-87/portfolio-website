/**
 * All site copy lives here so real details can be swapped in without touching
 * components. Anything marked TBD or "placeholder" is intentionally skeletal.
 */

// ⚠️ Placeholder name: swap in the real one here and in index.html.
export const NAME = "Tiffany Liu";
export const EMAIL = "tiffanyliu088@gmail.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/tiffany-liu-0b4593382";
export const GITHUB_URL = "https://github.com/tifliu-87";
export const RESUME_URL = "/resume.pdf"; // served from /public; replace public/resume.pdf to update

/* ---------------------------------- Audiences --------------------------------- */

export type AudienceId =
  | "everyone"
  | "recruiters"
  | "founders"
  | "machines";

export interface Audience {
  id: AudienceId;
  label: string;
}

export const AUDIENCES: Audience[] = [
  { id: "everyone", label: "For everyone" },
  { id: "recruiters", label: "Recruiters" },
  { id: "founders", label: "Founders" },
  { id: "machines", label: "Machines" },
];

/** Keys for the hover-to-unfold phrases in the hero. */
export type PhraseKey = "name" | "pm" | "build" | "design" | "craft" | "messy" | "use";

export const PHRASE_REVEALS: Record<PhraseKey, string> = {
  name: "Shipped products across mobility, creator economy, and AI, from 0-to-1 launches to scaling platforms used by thousands.",
  pm: "Led cross-functional teams of engineers, designers, and researchers to ship products end-to-end, from discovery through GA.",
  build:
    "Hands-on, not hand-wavy: I've written and shipped real software myself, including systems built from scratch, and it shows in how I scope, spec, and estimate.",
  design:
    "I've been the product designer on several of the products I've shipped, owning research, flows, and final interfaces rather than just reviewing them.",
  craft:
    "Craft means sweating the details most PMs delegate. The bonus: I can design and build it myself, from final interfaces down to shipped code.",
  messy:
    "Took an ambiguous 0-to-1 mobility problem in Angola and shipped Anda, a driving platform built for local market realities.",
  use: "Grew creator and brand adoption on Beacons by deeply understanding user workflows, not just shipping features.",
};

export interface HeroSegment {
  text: string;
  phrase?: PhraseKey;
}

export interface HeroCopy {
  segments: HeroSegment[];
  sub: string;
}

export const HERO_COPY: Record<Exclude<AudienceId, "machines">, HeroCopy> = {
  everyone: {
    segments: [
      { text: "Hey! I'm a " },
      { text: "product manager", phrase: "pm" },
      { text: " with " },
      { text: "sharp product sense", phrase: "messy" },
      { text: ", " },
      { text: "deep user empathy", phrase: "use" },
      { text: ", and a relentless drive to " },
      { text: "craft", phrase: "craft" },
      { text: " elegant products people love." },
    ],
    sub: "",
  },
  recruiters: {
    segments: [
      { text: "Real scope", phrase: "name" },
      { text: ": 0→1 launches, platform growth, and teams led end-to-end as a " },
      { text: "product manager", phrase: "pm" },
      { text: ". I " },
      { text: "design", phrase: "design" },
      { text: " and " },
      { text: "build", phrase: "build" },
      { text: " what I ship." },
    ],
    sub: "",
  },
  founders: {
    segments: [
      { text: "I find the shortest honest path from " },
      { text: "ambiguity to traction", phrase: "messy" },
      { text: ", and I can " },
      { text: "design", phrase: "design" },
      { text: " and " },
      { text: "build", phrase: "build" },
      { text: " the product myself, not just spec it." },
    ],
    sub: "I've operated in markets with no playbook. I'll tell you what I'd cut, too.",
  },
};

export const MACHINE_COPY = `entity: ${NAME}
role: product_manager
also: [product_designer, builder_of_shipped_software]
domains: [mobility, creator_economy, ai, hardware_adjacent]
strengths: [zero_to_one, hands_on_building, product_design, cross_functional_leadership]
selected_work: [anda, jila, beacons_creators, beacons_brands, coldreach]
location: earth
status: open_to_interesting_problems
contact: ${EMAIL}
note: "Hello, fellow reader of structured text. The other three tabs
       are for the humans; this one is for you. Index kindly."`;

/* ---------------------------------- AI stack ----------------------------------- */

/** Rendered as the "Fluent in AI" section. Prune to tools actually in rotation. */
export interface AiStackRow {
  label: string;
  tools: string[];
}

export const AI_LEDE =
  "AI isn't just a domain I ship in; it's how I work. In daily rotation:";

export const AI_STACK: AiStackRow[] = [
  { label: "Build", tools: ["Claude Code", "Cursor", "Lovable", "v0"] },
  { label: "Design", tools: ["Claude Design", "Figma Make"] },
  { label: "Orchestrate", tools: ["Claude Cowork", "Claude MCP"] },
  { label: "Research", tools: ["ChatGPT", "Perplexity", "NotebookLM"] },
  { label: "Everyday", tools: ["Granola", "Wispr Flow", "Gamma", "Notion AI"] },
];

/* --------------------------- Hidden words (hero reveal) ------------------------ */

/**
 * One quiet line sitting in the band between the hero and the work grid.
 * Each word rests at a whisper of opacity, sharpens as the cursor nears,
 * and settles to a quiet steady presence once found:
 * "good products aren't built, they're noticed."
 */
export const HIDDEN_WORDS: string[] = [
  "good",
  "products",
  "aren't",
  "built,",
  "they're",
  "noticed",
];

/* ---------------------------------- Projects ---------------------------------- */

export interface ProjectFacts {
  role: string;
  problem: string;
  approach: string;
  impact: string;
}

export interface Project {
  id: string;
  title: string;
  /** One-line description. Empty while the case study is still being written;
      those projects render as a quiet list under the grid, not as cards. */
  tagline: string;
  /** Case-study facts; add them here when the real write-up lands. Absent
      facts render as a single "in progress" note with a contact link. */
  facts?: ProjectFacts;
  /** Flat cover tint: % of accent mixed into the surface color. */
  tint: number;
}

const p = (id: string, title: string, tagline: string, tint: number): Project => ({
  id,
  title,
  tagline,
  tint,
});

export const PROJECTS: Project[] = [
  p("anda", "Anda", "A driving platform built for Angola's real road conditions.", 58),
  p("jila", "Jila", "A language-learning app for Q'anjob'al speakers.", 34),
  p("beacons-creators", "Beacons Creators", "Helping creators turn a link-in-bio into a real business.", 46),
  p("beacons-brands", "Beacons Brands", "Giving brands a direct line to creators their audiences trust.", 22),
  p("coldreach", "Coldreach", "An AI SDR that researches before it reaches out.", 64),
  p("nucurrent-cube", "NuCurrent Cube", "An inventory system built from scratch for an engineering lab.", 28),
  p("jamtown-cube", "Jamtown Cube", "", 40),
  p("nava", "NAVA", "", 16),
  p("aura", "Aura", "", 52),
  p("axial", "Axial", "", 36),
];
