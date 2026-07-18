// Explicit .ts extension: this file also runs server-side via api/chat.ts
// under Node's native type stripping, which resolves imports as strict ESM.
import { EMAIL, LINKEDIN_URL, RESUME_URL } from "../data.ts";
import type { KnowledgeEntry } from "./types";

/**
 * Everything the assistant knows, in one editable place. Answers are written
 * in Tiffany's voice: first person, concise, product-first. Facts come from
 * the resume (public/resume.pdf) and src/data.ts; nothing here should claim
 * anything those sources don't support.
 *
 * To teach the assistant something new: add an entry (or a `more` chunk to an
 * existing one) with generous keywords. No other file needs to change.
 */

/**
 * Rotating pool for the suggested-prompt chips. The drawer shows three at a
 * time and advances through this list after every question, wrapping around.
 * Every prompt here must reliably hit a KNOWLEDGE entry's keywords.
 */
export const SUGGESTED_PROMPTS: string[] = [
  "What did you do at Beacons AI?",
  "What's your favorite project?",
  "What kinds of product problems do you enjoy?",
  "Tell me about your design process",
  "Why product management?",
  "What's your leadership experience?",
  "What impact have you made?",
  "What do you build with?",
  "What are you looking for next?",
  "Tell me something that's not on your resume",
];

export const FALLBACK_ANSWER = `Ooh, you got me. I honestly don't know that one, and I'd rather admit it than make something up.

Things I can actually talk about: my internships at Beacons AI and Coldreach, my projects, how I design, or what I'm looking for next. Or just email me at ${EMAIL}.`;

export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "about",
    section: "About",
    keywords: [
      "about you",
      "who are you",
      "introduce",
      "introduction",
      "background",
      "tiffany",
      "yourself",
      "summary",
      "overview",
      "bio",
    ],
    answer: `I'm Tiffany, a product manager who designs and builds. I've shipped products across mobility, the creator economy, and AI, from 0-to-1 launches to platforms used by millions.

I study Computer Science and Advertising at the University of Illinois Urbana-Champaign, and I've done PM internships at Beacons AI and Coldreach, both YC companies. I also co-founded NAVA, a B2B product intelligence platform.

What makes me a little unusual: I don't just spec products. I've designed the interfaces and written the shipped code myself, and that shows up in how I scope, estimate, and work with engineers.`,
    related: ["beacons", "coldreach", "looking-for"],
  },
  {
    id: "education",
    section: "Education",
    keywords: [
      "education",
      "school",
      "college",
      "university",
      "uiuc",
      "illinois",
      "degree",
      "major",
      "gpa",
      "graduate",
      "graduation",
      "student",
      "study",
    ],
    answer: `I'm at the University of Illinois Urbana-Champaign studying Computer Science + Advertising, graduating in May 2028. Current GPA is 4.0.

The combination is deliberate: CS gives me the technical depth to build and to work credibly with engineers, and Advertising is really the study of how people decide, which is half of product work.`,
    related: ["technical", "leadership"],
  },
  {
    id: "beacons",
    section: "Experience",
    keywords: [
      "beacons",
      "beacons ai",
      "creator economy",
      "creators platform",
      "brands platform",
      "influencer",
      "internship",
      "intern",
      "experience",
      "work experience",
      "current role",
      "current job",
      "where do you work",
    ],
    answer: `I've done two PM internships at Beacons AI, a YC company building tools for 10M+ creators.

Right now I'm on the Brands Platform team, where I own 0-to-1 strategy and delivery of an AI influencer campaign platform that sources from a 10M-creator database. The result I'm proudest of: creator-match precision went from 10% to 90%, at 6x the speed, driven by heavy dogfooding and a 50-scenario eval suite. We shipped 45 changes in 4 weeks and demoed at NY Tech Week.

Before that, I was on the Creators Platform, working on AI brand-deal workflows. Want the story on that one?`,
    more: [
      `On the Creators side, I owned end-to-end AI product strategy for brand-deal workflows, working directly with the CTO from discovery to delivery.

I interviewed 20+ top creators (1M+ followers each) to map friction across the six stages of a brand deal, ran a 5-competitor teardown, and turned it all into data-backed PRDs. Two features I proposed are now major revenue generators with 50k weekly signups.`,
      `The thing Beacons taught me most: precision problems are eval problems. The jump from 10% to 90% match precision didn't come from a cleverer model. It came from defining what "good" meant across 50 real scenarios and grinding against that suite until the product agreed with the users.`,
    ],
    related: ["coldreach", "impact", "problems"],
  },
  {
    id: "coldreach",
    section: "Experience",
    keywords: [
      "coldreach",
      "sdr",
      "ai sdr",
      "sales",
      "repositioning",
      "seo",
      "geo",
    ],
    answer: `At Coldreach, a YC company building a research-driven AI SDR, I led a full product repositioning with a cross-functional team of 8.

Two threads to it. First, the story: I spearheaded an SEO and GEO-optimized website overhaul that lifted organic search 230% and views 314% in 8 weeks. Second, the product: I surfaced 20+ UX friction points and shipped 3 features, including an AI assistant entry point that increased adoption 60% and a data-heavy campaign overview page. Task completion time dropped 40%.

It was a good lesson in how positioning and product are the same problem viewed from two sides.`,
    related: ["beacons", "impact"],
  },
  {
    id: "nava",
    section: "Experience",
    keywords: [
      "nava",
      "founder",
      "co-founder",
      "cofounder",
      "startup",
      "founded",
      "cpo",
      "product intelligence",
    ],
    answer: `NAVA is the startup I co-founded, as Chief Product Officer. It's a B2B product intelligence platform that converts UX friction into prioritized, actionable product changes.

I own product vision, architecture, and the MVP build end-to-end. On the validation side, I've run customer discovery with startup founders and CEOs, and engaged investors at a16z and YC to pressure-test problem-market fit. Every market signal feeds back into the roadmap and positioning.

It's the most complete expression of how I like to work: find the real friction, decide what matters, build it.`,
    related: ["problems", "technical"],
  },
  {
    id: "jila",
    section: "Projects",
    keywords: [
      "jila",
      "hack4impact",
      "language",
      "qanjobal",
      "q'anjob'al",
      "accessibility",
      "nonprofit",
      "social impact",
    ],
    answer: `Jila is a language-learning and daily-tasks app for Q'anjob'al speakers, an underresourced language community. I built it with Hack4Impact, starting as product designer and growing into the PM role.

The hard part wasn't features, it was constraints: low literacy, limited tech familiarity, real accessibility needs. Every tradeoff had to respect that. We landed on text-to-speech, video resources, and a job board, and I delivered 50 high-fidelity mobile and desktop screens working alongside engineers and community stakeholders.

It's the project that most shaped how I think about empathy in product work.`,
    related: ["design-process", "favorite"],
  },
  {
    id: "anda",
    section: "Projects",
    keywords: ["anda", "angola", "mobility", "driving", "africa"],
    answer: `Anda is a driving platform built for Angola's real road conditions. It started as an ambiguous 0-to-1 mobility problem in a market with no playbook, which is exactly the kind of problem I like.

The full case study is still being written up for the site. If you want the details now, the fastest route is asking Tiffany directly at ${EMAIL}.`,
    related: ["problems", "contact"],
  },
  {
    id: "cubec",
    section: "Projects",
    keywords: [
      "cubec",
      "consulting",
      "consultant",
      "musicians",
      "spotify",
      "rag",
      "embeddings",
      "nucurrent",
      "inventory",
    ],
    answer: `As a senior technical consultant with Champaign-Urbana Business and Engineering Consulting, I shipped a full-stack AI system, embeddings plus RAG, for a B2B company connecting musicians with nonprofit events.

Beyond the core system, I built a discovery algorithm that sourced 5,000 Spotify artists by popularity and geography, developed automated outreach that reached 250 artists, and drove SEO gains of 54% on mobile and 52% on desktop.

Separately, I built an inventory system from scratch for an engineering lab (the NuCurrent Cube project on the site).`,
    related: ["technical", "impact"],
  },
  {
    id: "leadership",
    section: "Leadership",
    keywords: [
      "leadership",
      "lead",
      "leader",
      "product space",
      "vice president",
      "vp",
      "team",
      "mentor",
      "club",
      "organization",
    ],
    answer: `My biggest leadership role is Vice President of Project Success at Product Space UIUC, where I lead 100+ members across 16 cross-functional project teams. The work spans GTM strategy, UX research, competitive positioning, growth and monetization, and product-market fit validation.

I came in through the fellowship, which has a 6% acceptance rate, and led a 12-week client engagement: weekly client calls, 9 workstreams, translating ambiguous client needs into scoped product decisions, and shipping a final MVP.

I also lead as CPO at NAVA, and I led a cross-functional team of 8 during my Coldreach internship.`,
    related: ["nava", "coldreach"],
  },
  {
    id: "technical",
    section: "Technical Skills",
    keywords: [
      "technical",
      "technologies",
      "tech stack",
      "stack",
      "code",
      "coding",
      "programming",
      "engineer",
      "engineering",
      "react",
      "typescript",
      "python",
      "fastapi",
      "supabase",
      "postgresql",
      "tools",
      "skills",
      "build",
    ],
    answer: `I write and ship real software, not just specs. Recent stack: React, TypeScript, FastAPI, Supabase, PostgreSQL, and RAG pipelines with embeddings.

AI tooling is how I work day to day: Claude Code, Cursor, Lovable, and v0 for building; Claude Design and Figma Make for design; Claude Cowork and MCP for orchestration; ChatGPT, Perplexity, and NotebookLM for research.

This portfolio site is itself a sample: React, TypeScript, and Vite, designed and built by me. The technical depth matters as a PM because I can scope honestly, estimate credibly, and prototype instead of describing.`,
    more: [
      `A concrete example: the musician-nonprofit matching system I shipped as a consultant runs embeddings and RAG in production, with React on the front and FastAPI, Supabase, and PostgreSQL behind it. I also built its artist discovery algorithm, which sourced 5,000 Spotify artists by popularity and geography.`,
    ],
    related: ["cubec", "ai-fluency"],
  },
  {
    id: "ai-fluency",
    section: "Technical Skills",
    keywords: [
      "ai",
      "artificial intelligence",
      "llm",
      "claude",
      "cursor",
      "ai tools",
      "ai fluency",
      "ai products",
      "evals",
      "eval",
    ],
    answer: `AI isn't just a domain I ship in; it's how I work.

On the shipping side: an AI influencer campaign platform at Beacons (creator-match precision from 10% to 90%, driven by a 50-scenario eval suite), an AI SDR repositioning at Coldreach, and a production RAG system for matching musicians with nonprofits.

On the working side, my daily rotation includes Claude Code, Cursor, Lovable, v0, Claude Design, Figma Make, MCP, Perplexity, and NotebookLM. My strong opinion: for AI products, the eval suite is the spec. Define "good" rigorously and the product follows.`,
    related: ["beacons", "technical"],
  },
  {
    id: "design-process",
    section: "Design Philosophy",
    keywords: [
      "design process",
      "design philosophy",
      "design",
      "designer",
      "ux",
      "user research",
      "figma",
      "interface",
      "craft",
    ],
    answer: `I've been the actual product designer on several products I've shipped, owning research, flows, and final interfaces rather than just reviewing them.

My process starts with users, not screens: for Beacons that meant 20+ interviews with top creators before any PRD; for Jila it meant designing around low literacy and accessibility constraints with community stakeholders in the room. Then I go unusually deep on craft, the details most PMs delegate: typography, motion, empty states.

The philosophy in one line: good products aren't built, they're noticed. Design should disappear so the work can speak.`,
    more: [
      `On tools: Figma for core design work, plus Claude Design and Figma Make for AI-assisted exploration. For Jila I delivered 50 high-fidelity mobile and desktop screens, and this portfolio site (including the theme system and the interactions) is my own design, taken all the way to shipped code.`,
    ],
    related: ["jila", "pm-philosophy"],
  },
  {
    id: "pm-philosophy",
    section: "PM Philosophy",
    keywords: [
      "why product management",
      "why pm",
      "product philosophy",
      "pm philosophy",
      "product management",
      "product manager",
      "philosophy",
      "approach",
      "how do you work",
    ],
    // TODO(tiffany): personalize the origin story; this is drafted from the
    // site's positioning docs, not from a conversation with you.
    answer: `Product management is where everything I care about converges: understanding people, making judgment calls under ambiguity, and actually shipping.

My approach is finding the shortest honest path from ambiguity to traction. That means talking to users before writing PRDs, cutting scope ruthlessly (I'll tell you what I'd cut, too), and dogfooding until the product agrees with reality. At Beacons that path ran through a 50-scenario eval suite; at Coldreach it ran through 20+ UX friction points.

The "honest" part matters as much as the "shortest": no vanity metrics, no shipping theater.`,
    related: ["problems", "design-process"],
  },
  {
    id: "problems",
    section: "PM Philosophy",
    keywords: [
      "product problems",
      "problems you enjoy",
      "what kind of problems",
      "kinds of problems",
      "enjoy",
      "excites",
      "passionate",
      "interests you",
      "zero to one",
      "0 to 1",
      "ambiguity",
      "ambiguous",
    ],
    answer: `I gravitate toward messy 0-to-1 problems, the ones without a playbook.

The pattern across my work: an ambiguous mobility problem in Angola became Anda. A blank "AI for brand deals" mandate at Beacons became two revenue-generating features. UX friction with no owner became NAVA, a whole company.

What they share is that the hard part is defining the problem, not executing a known solution. I like being dropped into that fog, talking to enough users to find the real shape of the thing, and then building my way out. Scaling something already working is fine; finding what works is the fun part.`,
    related: ["nava", "beacons", "anda"],
  },
  {
    id: "favorite",
    section: "Favorite Projects",
    // Phrase keywords only: a bare "favorite" would wrongly catch questions
    // like "favorite ice cream flavor", which must fall back honestly.
    keywords: [
      "favorite project",
      "favourite project",
      "favorite work",
      "best project",
      "best work",
      "proudest",
      "most proud",
      "top project",
    ],
    // TODO(tiffany): make this actually true. Drafted as a defensible pairing.
    answer: `Honest answer: it's a tie, for different reasons.

The Beacons brands platform is the one I'm proudest of technically. Taking creator-match precision from 10% to 90% by building a 50-scenario eval suite, then watching brands convert after our NY Tech Week demo, was product work with a scoreboard.

Jila is the one closest to my heart. Designing for Q'anjob'al speakers meant every assumption I had about "intuitive" interfaces got rebuilt around low literacy and accessibility. It changed how I design everything since.

Ask me about either one and I'll happily go deeper.`,
    related: ["beacons", "jila"],
  },
  {
    id: "impact",
    section: "Impact",
    keywords: [
      "impact",
      "results",
      "metrics",
      "outcomes",
      "achievements",
      "accomplishments",
      "numbers",
    ],
    answer: `A few numbers I stand behind:

At Beacons: creator-match precision from 10% to 90% at 6x speed, 45 changes shipped in 4 weeks, and two proposed features now driving major revenue with 50k weekly signups.

At Coldreach: organic search up 230% and views up 314% in 8 weeks, a 60% adoption lift from a new AI assistant entry point, and task completion time down 40%.

As a consultant: SEO up 54% on mobile, a discovery algorithm sourcing 5,000 artists, and a production RAG system shipped end to end.

Behind each number is the same habit: define what "good" means, then measure against it honestly.`,
    related: ["beacons", "coldreach", "cubec"],
  },
  {
    id: "looking-for",
    section: "Future Goals",
    keywords: [
      "looking for",
      "currently looking",
      "next",
      "future",
      "goals",
      "opportunities",
      "hire",
      "hiring",
      "available",
      "open to",
      "role",
      "internships",
    ],
    // TODO(tiffany): sharpen once you know the specific next step you want.
    answer: `I'm open to interesting product problems, especially product management internships and early-team roles where I can own something 0-to-1.

The environments where I do my best work: small teams moving fast, real users to talk to, and problems where the spec doesn't exist yet. AI-native products are a particular draw since that's where I've been shipping.

If you're working on something like that, I'd genuinely love to hear about it: ${EMAIL}, or find me on LinkedIn.`,
    related: ["contact", "problems"],
  },
  {
    id: "off-resume",
    section: "Fun Facts",
    keywords: [
      "not on your resume",
      "off the resume",
      "fun fact",
      "fun facts",
      "surprising",
      "hobby",
      "hobbies",
      "interests",
      "outside work",
      "something else",
      "personal",
    ],
    answer: `Here's one: this website is itself a project. I designed and built it from scratch, and it's full of quiet details most visitors never find.

There's a theme slider with six hand-tuned color stops from rose to plum. There's a sentence hidden between the hero and the work grid that only appears when your cursor sweeps over it. And if you leave your mouse still long enough, a little companion dot falls asleep next to it.

I think that says more about how I work than a bullet point could: I sweat details nobody asked for, because someone always notices.`,
    related: ["design-process", "technical"],
  },
  {
    id: "contact",
    section: "Resume",
    keywords: [
      "contact",
      "email",
      "reach",
      "linkedin",
      "resume",
      "cv",
      "get in touch",
      "connect",
      "phone",
    ],
    answer: `The best way to reach Tiffany is email: ${EMAIL}.

She's also on LinkedIn (${LINKEDIN_URL}), and her resume is right here on the site: ${RESUME_URL}.

If you're reaching out about a role or a product you're building, say a little about the problem. She reads everything.`,
    related: ["looking-for"],
  },
];
