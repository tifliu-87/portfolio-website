/**
 * All site copy lives here so real details can be swapped in without touching
 * components. Anything marked TBD or "placeholder" is intentionally skeletal.
 */

// ⚠️ Placeholder name — swap in the real one here and in index.html.
export const NAME = "Tiffany Liu";
export const EMAIL = "tl87@illinois.edu";
export const LINKEDIN_URL = "https://www.linkedin.com/"; // placeholder
export const RESUME_URL = "/resume.pdf"; // drop a real file into /public

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
  { id: "founders", label: "Founders & execs" },
  { id: "engineers", label: "Engineers" },
  { id: "designers", label: "Designers" },
  { id: "machines", label: "Machines" },
];

/** Keys for the hover-to-unfold phrases in the hero. */
export type PhraseKey = "name" | "pm" | "messy" | "use";

export const PHRASE_REVEALS: Record<PhraseKey, string> = {
  name: "5+ years shipping products across mobility, creator economy, and AI — from 0-to-1 launches to scaling platforms used by thousands.",
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
      { text: "Hi there — I'm " },
      { text: NAME, phrase: "name" },
      { text: ", a " },
      { text: "product manager", phrase: "pm" },
      { text: " who " },
      { text: "turns messy problems into products", phrase: "messy" },
      { text: " " },
      { text: "people actually use", phrase: "use" },
      { text: "." },
    ],
    sub: "Currently exploring what's next. Previously: Anda, Beacons, Coldreach.",
  },
  recruiters: {
    segments: [
      { text: "I'm " },
      { text: NAME, phrase: "name" },
      { text: " — a " },
      { text: "product manager", phrase: "pm" },
      { text: " with real scope: 0→1 launches, platform growth, and cross-functional teams led end-to-end." },
    ],
    sub: "Open to senior PM roles. Resume below — the short version is on this page.",
  },
  founders: {
    segments: [
      { text: "I find the shortest honest path from ambiguity to traction. Strategy, numbers, narrative — and the discipline to " },
      { text: "turn messy problems into products", phrase: "messy" },
      { text: " that move the metric you actually care about." },
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
      { text: "Craft is a feature. I'll make the case upstairs for the extra iteration when it matters — because the goal is " },
      { text: "products people actually use", phrase: "use" },
      { text: ", not tickets marked done." },
    ],
    sub: "Research first, pixels second, ego never.",
  },
};

export const MACHINE_COPY = `entity: ${NAME}
role: product_manager
years_experience: 5+
domains: [mobility, creator_economy, ai, hardware_adjacent]
strengths: [zero_to_one, cross_functional_leadership, research_driven_discovery]
selected_work: [anda, jila, beacons_creators, beacons_brands, coldreach]
location: earth
status: open_to_interesting_problems
contact: ${EMAIL}
note: "Hello, fellow reader of structured text. The other five tabs
       are for the humans — this one is for you. Index kindly."`;

/* ---------------------------------- Projects ---------------------------------- */

export interface Project {
  id: string;
  title: string;
  tagline: string;
  role: string;
  problem: string;
  approach: string;
  impact: string;
  /** Per-card gradient recipe (angle + two focal points), themed via CSS vars. */
  art: { angle: number; x: number; y: number };
}

export interface ProjectGroup {
  id: string;
  title: string;
  blurb: string;
  projects: Project[];
}

const TBD = "TBD — case study coming soon.";

const p = (
  id: string,
  title: string,
  tagline: string,
  art: Project["art"],
): Project => ({
  id,
  title,
  tagline,
  role: TBD,
  problem: TBD,
  approach: TBD,
  impact: TBD,
  art,
});

export const PROJECT_GROUPS: ProjectGroup[] = [
  {
    id: "zero-to-one",
    title: "Zero-to-one builds",
    blurb: "Ambiguous problems, no playbook, first version shipped.",
    projects: [
      p("anda", "Anda", "A driving platform built for Angola's real road conditions — researched and launched on the ground.", {
        angle: 135,
        x: 20,
        y: 15,
      }),
      p("jila", "Jila", "A language-learning app for Q'anjob'al speakers, built with the community it serves.", {
        angle: 210,
        x: 80,
        y: 20,
      }),
      p("nucurrent-cube", "NuCurrent Cube", "An inventory system built from scratch for a wireless-power engineering lab.", {
        angle: 30,
        x: 25,
        y: 80,
      }),
      p("jamtown-cube", "Jamtown Cube", "Case study in progress — details coming soon.", {
        angle: 315,
        x: 70,
        y: 75,
      }),
    ],
  },
  {
    id: "scaling",
    title: "Scaling platforms",
    blurb: "Existing products, growing stakes, compounding decisions.",
    projects: [
      p("beacons-creators", "Beacons Creators", "Helping creators turn a link-in-bio into a real business.", {
        angle: 160,
        x: 30,
        y: 30,
      }),
      p("beacons-brands", "Beacons Brands", "Giving brands a direct line to the creators their audiences already trust.", {
        angle: 250,
        x: 75,
        y: 40,
      }),
    ],
  },
  {
    id: "ai",
    title: "AI-driven products",
    blurb: "Products where the model is a teammate, not a gimmick.",
    projects: [
      p("coldreach", "Coldreach", "An end-to-end, research-driven AI SDR that does the homework a good human rep would.", {
        angle: 100,
        x: 60,
        y: 20,
      }),
      p("nava", "NAVA", "Case study in progress — details coming soon.", { angle: 200, x: 20, y: 60 }),
      p("aura", "Aura", "Case study in progress — details coming soon.", { angle: 45, x: 80, y: 70 }),
      p("axial", "Axial", "Case study in progress — details coming soon.", { angle: 290, x: 40, y: 85 }),
    ],
  },
];

/* ----------------------------------- Values ----------------------------------- */

export interface Value {
  statement: string;
  detail: string;
}

export const VALUES: Value[] = [
  {
    statement: "Notice before you build.",
    detail:
      "The best products come from seeing what everyone else walks past. Discovery isn't a phase — it's a posture. (Placeholder)",
  },
  {
    statement: "Clarity is kindness.",
    detail:
      "Crisp writing, honest tradeoffs, and decisions people can disagree with out loud. Ambiguity is expensive for everyone downstream. (Placeholder)",
  },
  {
    statement: "Ship to learn, not to be done.",
    detail:
      "A launch is a question posed to reality. The roadmap should bend to the answer. (Placeholder)",
  },
  {
    statement: "Craft compounds.",
    detail:
      "Small acts of care — a better empty state, a kinder error — accrue into trust you can't buy later. (Placeholder)",
  },
  {
    statement: "The team is the product.",
    detail:
      "How a team decides, disagrees, and recovers shapes everything users eventually touch. (Placeholder)",
  },
];

/* --------------------------------- Background ---------------------------------- */

export interface TimelineEntry {
  period: string;
  title: string;
  note: string;
}

export const TIMELINE: TimelineEntry[] = [
  {
    period: "The spark",
    title: "How I found product work",
    note: "Placeholder — the short story of what pulled me toward PM: noticing a problem nobody owned and refusing to leave it alone.",
  },
  {
    period: "20XX",
    title: "Zero-to-one in unfamiliar markets",
    note: "Placeholder — shipping Anda in Angola and Jila for Q'anjob'al speakers: learning that context beats convention.",
  },
  {
    period: "20XX",
    title: "Scaling creator tools at Beacons",
    note: "Placeholder — moving from building the first version to growing something thousands already rely on.",
  },
  {
    period: "20XX",
    title: "AI-native products",
    note: "Placeholder — Coldreach and beyond: figuring out what product discipline looks like when the product can think.",
  },
  {
    period: "Now",
    title: "What's next",
    note: "Placeholder — the kinds of problems I'm looking for and why.",
  },
];

/* -------------------------------- Testimonials --------------------------------- */

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Placeholder quote — two or three sentences from a manager about scope, judgment, and what it was like to work together.",
    name: "Firstname Lastname",
    title: "Role, Company (placeholder)",
  },
  {
    quote:
      "Placeholder quote — an engineer on what partnership felt like: specs, tradeoffs, and trust in the messy middle of a build.",
    name: "Firstname Lastname",
    title: "Role, Company (placeholder)",
  },
  {
    quote:
      "Placeholder quote — a designer on advocating for craft and holding the bar when timelines got loud.",
    name: "Firstname Lastname",
    title: "Role, Company (placeholder)",
  },
];

/* ------------------------------------ About ------------------------------------ */

export const ABOUT_PARAGRAPHS: string[] = [
  "Placeholder — the human paragraph: where you're from, what you're curious about, the thread that connects the work above.",
  "Placeholder — a second paragraph for the texture: what you do when you're not working, what you're learning right now.",
];

export const INTERESTS: string[] = [
  "Placeholder interest",
  "Another interest",
  "Something unexpected",
  "A fourth thing",
];

/* --------------------------------- Site sections -------------------------------- */

export interface SectionDef {
  id: string;
  label: string;
}

export const SECTIONS: SectionDef[] = [
  { id: "intro", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "values", label: "Values" },
  { id: "background", label: "Background" },
  { id: "references", label: "References" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
