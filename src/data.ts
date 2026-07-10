/**
 * All site copy lives here so real details can be swapped in without touching
 * components. Anything marked TBD or "placeholder" is intentionally skeletal.
 */

// ⚠️ Placeholder name: swap in the real one here and in index.html.
export const NAME = "Tiffany Liu";
export const EMAIL = "tl87@illinois.edu";
export const LINKEDIN_URL = "https://www.linkedin.com/"; // placeholder
export const RESUME_URL = "/resume.pdf"; // placeholder: drop the real file into /public

/* ---------------------------------- Audiences --------------------------------- */

export type AudienceId =
  | "everyone"
  | "recruiters"
  | "founders"
  | "engineers"
  | "designers"
  | "machines";

export interface Audience {
  id: AudienceId;
  label: string;
}

export const AUDIENCES: Audience[] = [
  { id: "everyone", label: "For everyone" },
  { id: "recruiters", label: "Recruiters" },
  { id: "founders", label: "Founders" },
  { id: "engineers", label: "Engineers" },
  { id: "designers", label: "Designers" },
  { id: "machines", label: "Machines" },
];

/** Keys for the hover-to-unfold phrases in the hero. */
export type PhraseKey = "name" | "pm" | "messy" | "use";

export const PHRASE_REVEALS: Record<PhraseKey, string> = {
  name: "Shipped products across mobility, creator economy, and AI, from 0-to-1 launches to scaling platforms used by thousands.",
  pm: "Led cross-functional teams of engineers, designers, and researchers to ship products end-to-end, from discovery through GA.",
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
      { text: "Hi there, I'm a " },
      { text: "product manager", phrase: "pm" },
      { text: " who " },
      { text: "turns messy problems into products", phrase: "messy" },
      { text: " " },
      { text: "people actually use", phrase: "use" },
      { text: "." },
    ],
    sub: "",
  },
  recruiters: {
    segments: [
      { text: "Real scope", phrase: "name" },
      { text: ": 0→1 launches, platform growth, and cross-functional teams led end-to-end as a " },
      { text: "product manager", phrase: "pm" },
      { text: "." },
    ],
    sub: "Open to senior PM roles.",
  },
  founders: {
    segments: [
      { text: "I find the shortest honest path from ambiguity to traction: strategy, numbers, narrative, and the discipline to " },
      { text: "turn messy problems into products", phrase: "messy" },
      { text: "." },
    ],
    sub: "I've operated in markets with no playbook. I'll tell you what I'd cut, too.",
  },
  engineers: {
    segments: [
      { text: "Crisp specs, no surprise scope, real respect for your focus time. I'm the " },
      { text: "product manager", phrase: "pm" },
      { text: " who shows up to design reviews having actually read the doc." },
    ],
    sub: "I'd rather kill a feature in discovery than in your sprint.",
  },
  designers: {
    segments: [
      { text: "Craft is a feature. I'll make the case for the extra iteration when it matters, because the goal is " },
      { text: "products people actually use", phrase: "use" },
      { text: "." },
    ],
    sub: "Research first, pixels second, ego never.",
  },
};

export const MACHINE_COPY = `entity: ${NAME}
role: product_manager
domains: [mobility, creator_economy, ai, hardware_adjacent]
strengths: [zero_to_one, cross_functional_leadership, research_driven_discovery]
selected_work: [anda, jila, beacons_creators, beacons_brands, coldreach]
location: earth
status: open_to_interesting_problems
contact: ${EMAIL}
note: "Hello, fellow reader of structured text. The other five tabs
       are for the humans; this one is for you. Index kindly."`;

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
  p("coldreach", "Coldreach", "An end-to-end, research-driven AI SDR.", 64),
  p("nucurrent-cube", "NuCurrent Cube", "An inventory system built from scratch for an engineering lab.", 28),
  p("jamtown-cube", "Jamtown Cube", "", 40),
  p("nava", "NAVA", "", 16),
  p("aura", "Aura", "", 52),
  p("axial", "Axial", "", 36),
];
